import React from "react";
import Dropdown from "../../../../ui/forms/Dropdown";

interface SortByDropdownProps {
    selected: "userName" | "firstName" | "lastName" | undefined;
    onChange: (value: "userName" | "firstName" | "lastName" | undefined) => void;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({ selected, onChange }) => {
    const options: { label: string, value: "userName" | "firstName" | "lastName" | undefined }[] = [
        { label: "---", value: undefined },
        { label: "Username", value: "userName" },
        { label: "First Name", value: "firstName" },
        { label: "Last Name", value: "lastName" },
    ];

    return (
        <Dropdown
            options={options}
            selected={selected}
            onChange={onChange}
            label="Sort By"
            id="sortBy"
        />
    );
};

export default SortByDropdown;