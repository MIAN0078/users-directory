import { useCallback, useEffect, useState } from "react";
import { isAbortError } from "../api/client";
import type { Status } from "../types";

export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Har naye request ke liye naya controller
    const controller = new AbortController();

    setStatus("loading");
    setError(null);

    fetcher(controller.signal)
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch((err: unknown) => {
        // Cancel hui request error nahi hai, ignore karo
        if (isAbortError(err)) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      });

    // Cleanup: fetcher badle ya component hate to purani request cancel
    return () => controller.abort();
  }, [fetcher, reloadKey]);

  // Retry button isko call karega
  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { data, setData, status, error, retry };
}