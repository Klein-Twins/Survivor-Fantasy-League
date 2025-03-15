import { useCallback, useState } from 'react';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../generated-api';

export type ApiRequestParams<TRequestBody, TQueryParams> =
  TRequestBody extends void
    ? TQueryParams extends void
      ? never
      : { body?: never; queryParams: TQueryParams }
    : TQueryParams extends void
    ? { body: TRequestBody; queryParams?: never }
    : { body: TRequestBody; queryParams: TQueryParams };

interface UseApiState<TResponse extends ApiResponse> {
  data: TResponse | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiResult<
  TRequestBody,
  TQueryParams,
  TResponse extends ApiResponse
> {
  data: TResponse | null;
  isLoading: boolean;
  error: string | null;
  execute: (
    params?: ApiRequestParams<TRequestBody, TQueryParams>
  ) => Promise<TResponse>;
  setData: (data: TResponse | null) => void;
}

export function useApi<
  TRequestBody = void,
  TQueryParams = void,
  TResponse extends ApiResponse = ApiResponse
>(
  serviceFunction: (
    params: ApiRequestParams<TRequestBody, TQueryParams>
  ) => Promise<AxiosResponse<TResponse>>
): UseApiResult<TRequestBody, TQueryParams, TResponse> {
  const [state, setState] = useState<UseApiState<TResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const setData = useCallback((data: TResponse | null) => {
    setState((prevState) => ({
      ...prevState,
      data,
    }));
  }, []);

  const execute = useCallback(
    async (
      params?: ApiRequestParams<TRequestBody, TQueryParams>
    ): Promise<TResponse> => {
      setState({
        data: null,
        isLoading: true,
        error: null,
      });

      try {
        let response;
        response = await serviceFunction(params);

        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          'An error occurred';
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [serviceFunction]
  );

  return {
    ...state,
    execute,
    setData,
  };
}
