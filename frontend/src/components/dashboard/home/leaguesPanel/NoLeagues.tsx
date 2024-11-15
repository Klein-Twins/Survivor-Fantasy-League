import React from "react";

interface NoLeaguesProps {
    onClickAddForm: (value: boolean) => void;  // This is used to toggle the form visibility
}

const NoLeagues: React.FC<NoLeaguesProps> = ({ onClickAddForm }) => {
    return (
        <div className="flex flex-col items-center space-y-2 text-center py-8">
            <h3 className="text-xl text-gray-600 mb-2">
                You are currently not enrolled in any leagues.
            </h3>
            <button
                className="bg-blue-500 text-white w-1/2 font-semibold py-2 px-6 mb-4 rounded-md hover:bg-blue-600 transition duration-300 shadow-md transform hover:scale-105"
                onClick={() => onClickAddForm(true)} // Open the form when clicked
            >
                Create a League
            </button>
        </div>
    );
}

export default NoLeagues;