import React from "react";
import Dropdown from "../../../../ui/forms/Dropdown";

interface NumResultsPerPageDropdownProps {
    selected: number;
    onChange: (value: number) => void;
}

const NumResultsPerPageDropdown: React.FC<NumResultsPerPageDropdownProps> = ({ selected, onChange }) => {
    const options = [
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "20", value: 20 },
    ];

    return (
        <Dropdown
            options={options}
            selected={selected}
            onChange={onChange}
            label="Results Per Page"
            id="numResultsPerPage"
        />
    );
};

export default NumResultsPerPageDropdown;