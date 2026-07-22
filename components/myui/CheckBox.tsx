type CheckBoxProps = {
    label?: string;
    name: string;
}

export default function CheckBox({ label, name }: CheckBoxProps) {
    return (
        <div className="flex items-center gap-2">
            <input type="checkbox" id={name} className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 " />
            <label htmlFor={name} className="text-xs text-gray-800">{label}</label>
        </div>
    )
}