import { useState } from "react";

const useResponseError = () => {
    const [responseError, setResponseError] = useState<{ message: string; status: number } | null>(null);

    const handleResponseError = (error: any) => {
        setResponseError(error);
    };

    return { responseError, handleResponseError };
};

export default useResponseError;