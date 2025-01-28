import React from "react";
import { SurvivorDetails } from "../../types/survivorTypes";

interface SurvivorDetailCardProps {
    survivor: SurvivorDetails
}

const SurvivorDetailCard: React.FC<SurvivorDetailCardProps> = ({ survivor }) => {
    return (
        <div className="flex flex-col md:flex-row md:h-auto">
            <div className="w-full md:w-1/2 md:min-h-72 overflow-hidden rounded-md">
                <img
                    className="h-full w-full object-cover object-center rounded-lg"
                    src={`http://localhost:3000/${survivor.imageUrl}`}
                    alt={`${survivor.firstName} ${survivor.lastName}`}
                />
            </div>
            <div className="px-4 py-4">
                <h2 className="text-xl font-semibold text-gray-800">{survivor.firstName} {survivor.lastName}</h2>
                <p className="text-sm text-gray-600 mb-1">{survivor.nickName ? `"${survivor.nickName}"` : ""}</p>
                <p className="text-gray-600 text-sm mb-2">{survivor.fromCity}, {survivor.fromState}, {survivor.fromCountry}</p>
                <p className="text-sm font-medium text-gray-700">Age: {survivor.age}</p>
                <p className="text-sm font-medium text-gray-700">Season: {survivor.seasonId}</p>
                <p className="text-sm font-medium text-gray-700">Occupation: {survivor.job}</p>
                <p className="text-sm text-gray-600 mt-4">{survivor.description}</p>
            </div>
        </div>
    );
}

export default SurvivorDetailCard;