import { useState, useCallback } from "react";
import { AxiosResponse } from "axios";

interface UseGetApiResult<T, P> {
  responseData: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (params?: P) => Promise<void>; // P enforces stricter type for params
}

export function useGetApi<T, P = void>(
  apiFunction: (params?: P) => Promise<T> // P is the params type
): UseGetApiResult<T, P> {
  const [responseData, setResponseData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (params?: P) => {
      setIsLoading(true);
      setError(null);

      try {
        const responseData = await apiFunction(params);
        setResponseData(responseData);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  return { responseData, isLoading, error, fetchData };
}

export default useGetApi;