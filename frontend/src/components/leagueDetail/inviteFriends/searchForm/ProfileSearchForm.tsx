import React, { useState } from "react";
import FormField from "./InputField";
import SortByDropdown from "./SortByDropdown";
import SortOrderSwitch from "./SortOrderSwitch";
import { Button } from "@headlessui/react";
import { ProfileSearchFormValues } from "../../../../services/profile/profileService";
import NumResultsPerPageDropdown from "./NumResultsPerPageDropdown";


interface ProfileSearchFormProps {
    onSearchSubmit: (searchParams: ProfileSearchFormValues) => void;
}

const ProfileSearchForm: React.FC<ProfileSearchFormProps> = ({ onSearchSubmit }) => {

    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const [sortBy, setSortBy] = useState<'userName' | 'firstName' | 'lastName'>();
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
        onSearchSubmit(searchParams);  // Pass the form values directly here
    };

    return (
        <div className="flex flex-col bg-stone-200 p-6 rounded-lg shadow-lg max-w-full md:max-w-4xl mx-auto space-y-4">
            {/* Form Fields */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
                <FormField name="firstName" label="First Name" value={firstName} onChange={setFirstName} />
                <FormField name="lastName" label="Last Name" value={lastName} onChange={setLastName} />
                <FormField name="userName" label="Username" value={userName} onChange={setUserName} />
            </div>

            {/* Sort By Dropdown and Sort Order Switch */}

            <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6 md:items-end">
                <div className="flex justify-between w-full md:w-2/3 items-end space-y-4 md:space-x-6 md:space-y-0">
                    <SortByDropdown selected={sortBy} onChange={setSortBy} />
                    <NumResultsPerPageDropdown selected={numProfilesPerPage} onChange={setNumProfilesPerPage} />
                    <SortOrderSwitch isAscending={isAscending} toggleOrder={toggleIsAscending} />
                </div>
                <Button onClick={handleSubmit} className="bg-white py-2 px-8 rounded-md md:w-1/3 h-10 my-[2px] hover:bg-stone-100 transition duration-200">
                    Search
                </Button>
            </div>
        </div>
    );
}

export default ProfileSearchForm;