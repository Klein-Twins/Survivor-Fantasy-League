import React from "react";

interface SubmitButtonProps {
    loading?: boolean;
    disabled?: boolean;
    label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, disabled, label }) => {
    return (
        <button
            type="submit"
            disabled={disabled || loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-400 disabled:hover:bg-blue-500 disabled:opacity-20"
        >{loading ? "Please Wait..." : label}
        </button>
    );
}

export default SubmitButton;