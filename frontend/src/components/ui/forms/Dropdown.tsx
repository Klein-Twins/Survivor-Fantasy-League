import React from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

interface DropdownProps<T> {
    options: { label: string; value: T }[];
    selected: T;
    onChange: (value: T) => void;
    label: string;
    id: string;
}

const Dropdown = <T,>({ options, selected, onChange, label, id }: DropdownProps<T>) => {
    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="block text-left pl-2 text-md font-semibold text-gray-700"
            >
                {label}
            </label>
            <Listbox value={selected} onChange={onChange}>
                <div className="relative mt-1">
                    {/* Listbox Trigger */}
                    <ListboxButton className="w-full bg-white px-4 py-2 border rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out">
                        {selected
                            ? options.find((option) => option.value === selected)?.label
                            : "---"}
                    </ListboxButton>

                    {/* Listbox Options */}
                    <ListboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
                        {options.map((option) => (
                            <ListboxOption key={String(option.value)} value={option.value}>
                                {({ active, selected }) => (
                                    <div
                                        className={`cursor-pointer select-none relative px-4 py-2 ${active ? "bg-blue-500 text-white" : "text-gray-900"
                                            } ${selected ? "font-semibold" : ""}`}
                                    >
                                        {option.label}
                                    </div>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
};

export default Dropdown;