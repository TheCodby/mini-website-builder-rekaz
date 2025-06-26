import { memo } from "react";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onInputChange: (value: string) => void;
}

export const ColorPicker = memo<ColorPickerProps>(
  ({ label, value, onChange, onInputChange }) => {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-16 h-16 border-3 border-gray-300 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary-400 focus:border-primary-500 shadow-lg hover:shadow-xl hover:scale-105"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/30 to-primary-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <div className="flex-1 relative group">
            <input
              type="text"
              id={`${label.replace(/\s+/g, "-").toLowerCase()}-input`}
              value={value}
              onChange={(e) => onInputChange(e.target.value)}
              className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent font-mono text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
              placeholder={value}
            />
            <label
              htmlFor={`${label.replace(/\s+/g, "-").toLowerCase()}-input`}
              className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
            >
              Hex Code
            </label>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
        </div>
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";
