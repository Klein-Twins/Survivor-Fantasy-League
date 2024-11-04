// src/hooks/useForm.ts
import { useState } from "react";

interface UseFormOptions<T extends Record<string, any>> {
    initialValues: T;
    validate: (values: T) => Partial<Record<keyof T, string>>;
    onSubmit: (values: T) => void;
    requiredFields: Array<keyof T>;
}

interface UseFormReturn<T extends Record<string, any>> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (name: keyof T) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isSubmitDisabled: boolean;
}

function useForm<T extends Record<string, any>>({
    initialValues,
    validate,
    onSubmit,
    requiredFields
}: UseFormOptions<T>): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({ ...prevValues, [name]: value }));

        if (touched[name as keyof T]) {
            const validationErrors = validate({ ...values, [name]: value });
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: validationErrors[name as keyof T],
            }));
        }
    };

    const handleBlur = (name: keyof T) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        const validationErrors = validate(values);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validationErrors[name],
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            onSubmit(values);
        }
    };

    const isSubmitDisabled = 
        Object.values(errors).some((error) => error !== undefined) ||
        requiredFields?.some((field) => values[field] === "");

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitDisabled,
    };
}

export default useForm;