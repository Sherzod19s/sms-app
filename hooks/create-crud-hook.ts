"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import type { CRUDHook } from "@/lib/types";

interface Config<T, TRow> {
  table: string;
  orderBy?: { column: string; ascending?: boolean };
  fromRow: (row: TRow) => T;
  toRow: (item: Partial<Omit<T, "id">>) => Record<string, unknown>;
}

/**
 * Generic factory that returns a hook exposing the same { data, add, update,
 * remove, hydrated, loading } interface our components already depend on,
 * backed by Supabase instead of localStorage.
 *
 * Strategy:
 *  - Fetch on mount.
 *  - After every mutation, refetch the table to keep UI in sync.
 *  - Surface errors to the console + a Sonner toast; never throw to the
 *    component layer.
 */
export function createCRUDHook<T extends { id: string }, TRow extends { id: string }>(
  cfg: Config<T, TRow>
) {
  return function useCRUD(): CRUDHook<T> {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
      const supabase = createClient();
      let query = supabase.from(cfg.table).select("*");
      if (cfg.orderBy) {
        query = query.order(cfg.orderBy.column, {
          ascending: cfg.orderBy.ascending ?? true,
        });
      }
      const { data: rows, error } = await query;
      if (error) {
        console.error(`[${cfg.table}] fetch failed`, error);
        toast.error(`Failed to load ${cfg.table}: ${error.message}`);
        setLoading(false);
        return;
      }
      setData((rows ?? []).map((r) => cfg.fromRow(r as TRow)));
      setLoading(false);
    }, []);

    useEffect(() => {
      void fetchAll();
    }, [fetchAll]);

    const add = useCallback(
      async (item: Omit<T, "id">) => {
        const supabase = createClient();
        const { error } = await supabase.from(cfg.table).insert(cfg.toRow(item));
        if (error) {
          console.error(`[${cfg.table}] insert failed`, error);
          toast.error(`Could not save: ${error.message}`);
          return;
        }
        await fetchAll();
      },
      [fetchAll]
    );

    const update = useCallback(
      async (id: string, patch: Partial<Omit<T, "id">>) => {
        const supabase = createClient();
        const { error } = await supabase
          .from(cfg.table)
          .update(cfg.toRow(patch))
          .eq("id", id);
        if (error) {
          console.error(`[${cfg.table}] update failed`, error);
          toast.error(`Could not update: ${error.message}`);
          return;
        }
        await fetchAll();
      },
      [fetchAll]
    );

    const remove = useCallback(
      async (id: string) => {
        const supabase = createClient();
        const { error } = await supabase.from(cfg.table).delete().eq("id", id);
        if (error) {
          console.error(`[${cfg.table}] delete failed`, error);
          toast.error(`Could not delete: ${error.message}`);
          return;
        }
        await fetchAll();
      },
      [fetchAll]
    );

    return { data, add, update, remove, loading, hydrated: !loading };
  };
}
