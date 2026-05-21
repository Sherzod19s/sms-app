"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  teacherFromRow,
  teacherToRow,
  type ClassRow,
  type TeacherRow,
} from "@/lib/supabase/mappers";
import type { CRUDHook, Teacher } from "@/lib/types";

/**
 * Teachers as data records — no longer tied to auth.users / profiles.
 *
 * `classIds` doesn't live on the teachers row; we derive it by joining against
 * the classes table, and we sync it back on update by flipping
 * classes.teacher_id values to match.
 */
export function useTeachers(): CRUDHook<Teacher> {
  const [data, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const supabase = createClient();
    const [teachersRes, classesRes] = await Promise.all([
      supabase
        .from("teachers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("classes").select("id, teacher_id"),
    ]);

    if (teachersRes.error) {
      console.error("[teachers] fetch failed", teachersRes.error);
      toast.error(`Failed to load teachers: ${teachersRes.error.message}`);
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
      (teachersRes.data as TeacherRow[]).map((t) =>
        teacherFromRow(t, classMap.get(t.id) ?? [])
      )
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  // Sync teacher → classes assignment. Called from add() (after insert) and
  // update() to flip classes.teacher_id rows.
  const syncClassAssignments = useCallback(
    async (teacherId: string, classIds: string[]) => {
      const supabase = createClient();
      // Unset this teacher from all classes they're currently on.
      const { error: unsetErr } = await supabase
        .from("classes")
        .update({ teacher_id: null })
        .eq("teacher_id", teacherId);
      if (unsetErr) {
        console.error("[teachers] unset assignments failed", unsetErr);
        toast.error(`Could not update assignments: ${unsetErr.message}`);
        return false;
      }
      // Reassign to the requested classes (if any).
      if (classIds.length > 0) {
        const { error: setErr } = await supabase
          .from("classes")
          .update({ teacher_id: teacherId })
          .in("id", classIds);
        if (setErr) {
          console.error("[teachers] set assignments failed", setErr);
          toast.error(`Could not update assignments: ${setErr.message}`);
          return false;
        }
      }
      return true;
    },
    []
  );

  const add = useCallback(
    async (item: Omit<Teacher, "id">) => {
      const supabase = createClient();
      const { data: inserted, error } = await supabase
        .from("teachers")
        .insert(teacherToRow(item))
        .select("id")
        .single();
      if (error || !inserted) {
        console.error("[teachers] insert failed", error);
        toast.error(`Could not save: ${error?.message ?? "unknown error"}`);
        return;
      }
      if (item.classIds && item.classIds.length > 0) {
        await syncClassAssignments(inserted.id, item.classIds);
      }
      await fetchAll();
    },
    [fetchAll, syncClassAssignments]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Teacher, "id">>) => {
      const supabase = createClient();
      const row = teacherToRow(patch);
      if (Object.keys(row).length > 0) {
        const { error } = await supabase.from("teachers").update(row).eq("id", id);
        if (error) {
          console.error("[teachers] update failed", error);
          toast.error(`Could not update: ${error.message}`);
          return;
        }
      }
      if (patch.classIds !== undefined) {
        const ok = await syncClassAssignments(id, patch.classIds);
        if (!ok) return;
      }
      await fetchAll();
    },
    [fetchAll, syncClassAssignments]
  );

  const remove = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("teachers").delete().eq("id", id);
      if (error) {
        console.error("[teachers] delete failed", error);
        toast.error(`Could not delete: ${error.message}`);
        return;
      }
      await fetchAll();
    },
    [fetchAll]
  );

  return { data, add, update, remove, loading, hydrated: !loading };
}
