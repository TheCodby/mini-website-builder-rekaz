import { memo } from "react";
import type { Section, SectionProps } from "@/types/builder";
import { ColorPicker } from "./shared/ColorPicker";

interface StylingControlsProps {
  selectedSection: Section;
  localProps: SectionProps;
  onColorChange: (
    property: string,
    value: string,
    isFromColorPicker?: boolean
  ) => void;
  onInputChange: (key: string, value: string | unknown[]) => void;
}

export const StylingControls = memo<StylingControlsProps>(
  ({ selectedSection, localProps, onColorChange, onInputChange }) => {
    return (
      <div className="space-y-8 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
          Styling
        </h3>

        {selectedSection.props.backgroundColor !== undefined && (
          <ColorPicker
            label="🎨 Background Color"
            value={localProps.backgroundColor || "#ffffff"}
            onChange={(value: string) =>
              onColorChange("backgroundColor", value, true)
            }
            onInputChange={(value: string) =>
              onInputChange("backgroundColor", value)
            }
          />
        )}

        {selectedSection.props.textColor !== undefined && (
          <ColorPicker
            label="✒️ Text Color"
            value={localProps.textColor || "#000000"}
            onChange={(value: string) =>
              onColorChange("textColor", value, true)
            }
            onInputChange={(value: string) => onInputChange("textColor", value)}
          />
        )}
      </div>
    );
  }
);

StylingControls.displayName = "StylingControls";
