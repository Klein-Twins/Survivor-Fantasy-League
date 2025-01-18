import React from 'react';

interface VerticalTextProps {
    text: string;
    className?: string;
}

const VerticalText: React.FC<VerticalTextProps> = ({ text, className }) => {
    return (
        <div className={`flex flex-col items-center space-y-1 ${className}`}>
            {text.split("").map((char, index) => (
                <span key={index}>
                    {char}
                </span>
            ))}
        </div>
    );
}

export default VerticalText;