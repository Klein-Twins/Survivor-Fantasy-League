import { useState } from "react";
import { AxiosResponse } from "axios";

// Type guard to check if the response is an AxiosResponse
function isAxiosResponse<T>(response: any): response is AxiosResponse<T> {
  return response && response.hasOwnProperty("data");
}

interface UsePostApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>; // Consistently return T
}

export function usePostApi<T>(
  fetchFunction: (...args: any[]) => Promise<AxiosResponse<T> | T> // Accept both AxiosResponse and raw data
): UsePostApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: any[]): Promise<T> => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetchFunction(...args);

      if (isAxiosResponse(response)) {
        setData(response.data);
        return response.data; // Return data
      } else {
        setData(response);
        return response;
      }
    } catch (err: any) {
      // Handle error based on the structure you described
      const errorMessage =
        err.response?.data?.error || err.message || "An unexpected error occurred";

      setError(errorMessage); // Update the hook's error state
      throw new Error(errorMessage); // Re-throw the error for the caller
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, execute };
}

export default usePostApi;