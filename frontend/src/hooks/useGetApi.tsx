import { useState, useEffect } from "react";
import { AxiosResponse } from "axios";

interface UseGetApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useGetApi<T>(fetchFunction: () => Promise<AxiosResponse<T>>): UseGetApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFunction();
        setData(response.data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, isLoading, error };
}

export default useGetApi;