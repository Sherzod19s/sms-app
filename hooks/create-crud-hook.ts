"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./use-local-storage";
import { uid } from "@/lib/utils";
import type { CRUDHook } from "@/lib/types";

export function createCRUDHook<T extends { id: string }>(
  storageKey: string,
  seed: T[],
  idPrefix: string
) {
  return function useCRUD(): CRUDHook<T> {
    const [data, setData, hydrated] = useLocalStorage<T[]>(storageKey, seed);

    const add = useCallback(
      (item: Omit<T, "id">) => {
        const created = { ...item, id: uid(idPrefix) } as T;
        setData((prev) => [...prev, created]);
        return created;
      },
      [setData]
    );

    const update = useCallback(
      (id: string, patch: Partial<Omit<T, "id">>) => {
        setData((prev) =>
          prev.map((row) => (row.id === id ? { ...row, ...patch } : row))
        );
      },
      [setData]
    );

    const remove = useCallback(
      (id: string) => {
        setData((prev) => prev.filter((row) => row.id !== id));
      },
      [setData]
    );

    return { data, add, update, remove, hydrated };
  };
}
