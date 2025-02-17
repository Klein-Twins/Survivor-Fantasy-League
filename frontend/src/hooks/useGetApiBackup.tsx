import { useState, useCallback } from "react";

interface UseGetApiResult<T, P> {
  responseData: T | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (params: P) => Promise<void>; // P enforces stricter type for params
  setResponseData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useGetApi<T, P = void>(
  apiFunction: (params: P) => Promise<T> // P is the params type
): UseGetApiResult<T, P> {
  const [responseData, setResponseData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (params: P) => {
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
    [] // Remove apiFunction from dependency array
  );

  return { responseData, isLoading, error, fetchData, setResponseData };
}

export default useGetApi;