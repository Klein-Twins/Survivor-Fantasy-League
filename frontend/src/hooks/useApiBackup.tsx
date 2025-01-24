import { AxiosResponse } from "axios";
import { ApiResponse } from "../../generated-api";
import { useState } from "react";

interface UseApiState<TResponse> {
    data: TResponse | null;
    isLoading: boolean;
    error: string | null;
}

export interface ApiRequestData<TRequestBody = undefined | null, TRequestParams = undefined | null> {
    body: TRequestBody,
    queryParams: TRequestParams,
}

interface UseApiResult<TRequestBody, TRequestParams, TResponse> {
    data: TResponse | null;
    isLoading: boolean;
    error: string | null;
    execute: (params: ApiRequestData<TRequestBody, TRequestParams>) => Promise<TResponse>;
}
export function useApi<TRequestBody = undefined | null, TRequestParams = undefined | null, TResponse = ApiResponse>(
    serviceFunction: ({ queryParams, body }: ApiRequestData<TRequestBody, TRequestParams>) => Promise<AxiosResponse<TResponse>>
): UseApiResult<TRequestBody, TRequestParams, TResponse> {
    const [state, setState] = useState<UseApiState<TResponse>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const execute = async (requestData: ApiRequestData<TRequestBody, TRequestParams>): Promise<TResponse> => {
        setState({
            data: null,
            isLoading: true,
            error: null,
        });

        try {
            const response = await serviceFunction(requestData);
            setState({
                data: response.data,
                isLoading: false,
                error: null,
            });
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setState({
                data: null,
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    };

    return {
        ...state,
        execute,
    };
}