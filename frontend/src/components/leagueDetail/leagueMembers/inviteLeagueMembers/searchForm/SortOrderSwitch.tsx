import React from "react";
import { Switch } from "@headlessui/react";

interface SortOrderSwitchProps {
    isAscending: boolean;
    toggleOrder: () => void;
}

const SortOrderSwitch: React.FC<SortOrderSwitchProps> = ({ isAscending, toggleOrder }) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <label className="block text-center text-md font-semibold text-gray-700">
                {isAscending ? "Ascending" : "Descending"}
            </label>
            <Switch
                checked={isAscending}
                onChange={toggleOrder}
                className={`${isAscending ? "bg-blue-500" : "bg-gray-300"
                    } relative inline-flex mx-auto items-center h-10 rounded-full w-24 py-2`}
            >
                <span
                    className={`${isAscending ? "translate-x-16" : "translate-x-2"
                        } inline-block w-6 h-6 transform bg-white rounded-full transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
    );
};

export default SortOrderSwitch;