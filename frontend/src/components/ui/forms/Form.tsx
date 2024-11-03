import React from "react";

interface FormProps {
    title?: string;
    children?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({title, children}) => {

    return (
        <>
            {title && <h2 className="text-center">{title}</h2>}
            {children}
        </>
    )
}

export default Form;