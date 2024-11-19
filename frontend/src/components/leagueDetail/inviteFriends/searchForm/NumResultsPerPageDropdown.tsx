import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";


const NumResultsPerPageDropdown: React.FC<{ selected: number, onChange: (value: number) => void }> = ({ selected, onChange }) => {
    const options = [
        { label: "5", value: 5 },
        { label: "10", value: 10 },
        { label: "20", value: 20 }
    ];

    return (
        <div className="w-96">
            <label htmlFor="numResultsPerPage" className="block text-left pl-2 text-md font-semibold text-gray-700">Results per page</label>
            <Listbox value={selected} onChange={onChange}>
                <div className="relative mt-1">
                    {/* Listbox Trigger */}
                    <ListboxButton className="w-full bg-white px-4 py-2 border rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out">
                        {selected ? options.find(option => option.value === selected)?.label : ""}
                    </ListboxButton>

                    {/* Listbox Options */}
                    <ListboxOptions className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto focus:outline-none">
                        {options.map((option) => (
                            <ListboxOption key={option.value} value={option.value}>
                                {({ active, selected }) => (
                                    <div
                                        className={`cursor-pointer select-none relative px-4 py-2 ${active ? "bg-blue-500 text-white" : "text-gray-900"} ${selected ? "font-semibold" : ""}`}
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

export default NumResultsPerPageDropdown;