import { memo } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  type?: "text" | "url" | "email";
}

export const FormField = memo<FormFieldProps>(
  ({
    id,
    label,
    value,
    onChange,
    placeholder = "",
    multiline = false,
    type = "text",
  }) => {
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      onChange(e.target.value);
    };

    const inputClasses =
      "peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300";

    const labelClasses =
      "absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600";

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="relative group">
          {multiline ? (
            <textarea
              id={id}
              value={value}
              onChange={handleChange}
              className={`${inputClasses} min-h-[100px] resize-none`}
              placeholder={placeholder}
              rows={3}
            />
          ) : (
            <input
              type={type}
              id={id}
              value={value}
              onChange={handleChange}
              className={inputClasses}
              placeholder={placeholder}
            />
          )}
          <label htmlFor={id} className={labelClasses}>
            {placeholder}
          </label>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";
