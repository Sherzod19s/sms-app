"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Persists state to localStorage. SSR-safe: returns initialValue until the
 * effect runs on the client, then hydrates from storage and flips `hydrated`.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const initialRef = useRef(initialValue);

  // Hydrate from storage on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw) as T);
      } else {
        // First load: seed.
        window.localStorage.setItem(key, JSON.stringify(initialRef.current));
        setValue(initialRef.current);
      }
    } catch (err) {
      console.error(`[useLocalStorage] failed to read "${key}"`, err);
    } finally {
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist on change (after hydration only — avoids overwriting on first mount).
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch (err) {
          console.error(`[useLocalStorage] failed to write "${key}"`, err);
        }
        return resolved;
      });
    },
    [key]
  );

  // Listen for cross-tab updates.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key || e.newValue === null) return;
      try {
        setValue(JSON.parse(e.newValue) as T);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, set, hydrated];
}
