"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  teacherFromProfile,
  type ClassRow,
  type ProfileRow,
} from "@/lib/supabase/mappers";
import type { CRUDHook, Teacher } from "@/lib/types";

/**
 * Teachers are profiles with role='teacher'. The schema does not have a
 * dedicated teachers table, so:
 *  - data: profile rows (role='teacher') decorated with classIds derived from
 *          the classes table.
 *  - add: not supported here (teachers are created via signup). Surfaces a
 *          toast explaining how to onboard a teacher.
 *  - update: writes full_name to profiles. The other Teacher fields (subject,
 *          contact, joinDate) aren't in the schema and are silently dropped.
 *  - remove: deletes the profile row (cascades from auth.users via FK in your
 *          own setup if you want — see README).
 */
export function useTeachers(): CRUDHook<Teacher> {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const supabase = createClient();
    const [profilesRes, classesRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("role", "teacher"),
      supabase.from("classes").select("id, teacher_id"),
    ]);

    if (profilesRes.error) {
      console.error("[teachers] fetch failed", profilesRes.error);
      toast.error(`Failed to load teachers: ${profilesRes.error.message}`);
      setLoading(false);
      return;
    }

    const classMap = new Map<string, string[]>();
    (classesRes.data ?? []).forEach((c: Pick<ClassRow, "id" | "teacher_id">) => {
      if (!c.teacher_id) return;
      const list = classMap.get(c.teacher_id) ?? [];
      list.push(c.id);
      classMap.set(c.teacher_id, list);
    });

    setData(
      (profilesRes.data as ProfileRow[]).map((p) =>
        teacherFromProfile(p, classMap.get(p.id) ?? [])
      )
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const add = useCallback(async (_item: Omit<Teacher, "id">) => {
    toast.info("Add teachers by inviting them to sign up — they'll appear here once they create an account.");
  }, []);

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Teacher, "id">>) => {
      const supabase = createClient();
      const row: Record<string, unknown> = {};
      if (patch.name !== undefined) row.full_name = patch.name;
      // subject / contact / joinDate aren't in the profiles table — dropped.

      // Sync the teacher↔class assignment by writing to the classes table.
      if (patch.classIds !== undefined) {
        // Unset this teacher from all classes, then reassign the chosen ones.
        const { error: unsetErr } = await supabase
          .from("classes")
          .update({ teacher_id: null })
          .eq("teacher_id", id);
        if (unsetErr) {
          console.error("[teachers] unset assignments failed", unsetErr);
          toast.error(`Could not update assignments: ${unsetErr.message}`);
          return;
        }
        if (patch.classIds.length > 0) {
          const { error: setErr } = await supabase
            .from("classes")
            .update({ teacher_id: id })
            .in("id", patch.classIds);
          if (setErr) {
            console.error("[teachers] set assignments failed", setErr);
            toast.error(`Could not update assignments: ${setErr.message}`);
            return;
          }
        }
      }

      if (Object.keys(row).length > 0) {
        const { error } = await supabase.from("profiles").update(row).eq("id", id);
        if (error) {
          console.error("[teachers] profile update failed", error);
          toast.error(`Could not update teacher: ${error.message}`);
          return;
        }
      }
      await fetchAll();
    },
    [fetchAll]
  );

  const remove = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) {
        console.error("[teachers] delete failed", error);
        toast.error(`Could not delete teacher: ${error.message}`);
        return;
      }
      await fetchAll();
    },
    [fetchAll]
  );

  return { data, add, update, remove, loading, hydrated: !loading };
}
