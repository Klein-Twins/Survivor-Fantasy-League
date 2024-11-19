const FormField: React.FC<{ name: string; label: string; value: string | undefined; onChange: (value: string) => void }> = ({ name, label, value, onChange }) => {
    return (
        <div className="flex flex-col space-y-1 w-full">
            <label htmlFor={name} className="block text-left pl-2 text-md font-semibold text-gray-700">{label}</label>
            <input
                id={name}
                name={name}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            />
        </div>
    );
};

export default FormField;