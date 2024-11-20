import React, { useState } from "react";
import { Button } from "@headlessui/react";

import FormField from "./InputField";
import SortByDropdown from "./SortByDropdown";
import SortOrderSwitch from "./SortOrderSwitch";
import NumResultsPerPageDropdown from "./NumResultsPerPageDropdown";

import { ProfileSearchFormValues } from "../../../../../services/profile/profileService";

interface ProfileSearchFormProps {
    onSearchSubmit: (searchParams: ProfileSearchFormValues) => void;
}

const ProfileSearchForm: React.FC<ProfileSearchFormProps> = ({ onSearchSubmit }) => {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const [sortBy, setSortBy] = useState<"userName" | "firstName" | "lastName">();
    const [isAscending, setIsAscending] = useState<boolean>(true);
    const [numProfilesPerPage, setNumProfilesPerPage] = useState<number>(5);

    const toggleIsAscending = () => setIsAscending(!isAscending);

    const handleSubmit = () => {
        const searchParams: ProfileSearchFormValues = {
            firstName,
            lastName,
            sortBy,
            isAsc: isAscending,
            numProfilesPerPage,
        };
        onSearchSubmit(searchParams);
    };

    return (
        <div className="flex flex-col w-full md:space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 justify-between items-end">
                <FormField name="firstName" label="First Name" value={firstName} onChange={setFirstName} />
                <FormField name="lastName" label="Last Name" value={lastName} onChange={setLastName} />
                <FormField name="userName" label="Username" value={userName} onChange={setUserName} />
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 justify-between items-end">
                <SortByDropdown selected={sortBy} onChange={setSortBy} />
                <NumResultsPerPageDropdown selected={numProfilesPerPage} onChange={setNumProfilesPerPage} />
                <SortOrderSwitch isAscending={isAscending} toggleOrder={toggleIsAscending} />
                <Button
                    onClick={handleSubmit}
                    className="bg-white py-2 px-8 rounded-md w-full h-10 my-[2px] hover:bg-stone-100 transition duration-200"
                >
                    Search
                </Button>
            </div>
        </div>
    );
};

export default ProfileSearchForm;