import { useState, useCallback } from "react";
import { AxiosResponse } from "axios";

interface UseGetApiResult<T, P> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (params: P) => Promise<void>; // P enforces stricter type for params
}

export function useGetApi<T, P>(
  apiFunction: (params: P) => Promise<AxiosResponse<T>> // P is the params type
): UseGetApiResult<T, P> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (params: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await apiFunction(params);
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, isLoading, error, fetchData };
}

export default useGetApi;