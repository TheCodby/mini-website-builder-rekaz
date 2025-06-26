import { memo } from "react";
import type { SectionProps } from "@/types/builder";
import { FormField } from "../shared/FormField";

interface ContentPropertiesFormProps {
  localProps: SectionProps;
  onInputChange: (key: string, value: string | unknown[]) => void;
  onArrayUpdate: (key: string, value: unknown[]) => void;
}

export const ContentPropertiesForm = memo<ContentPropertiesFormProps>(
  ({ localProps, onInputChange }) => {
    return (
      <div className="space-y-8 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
          Content
        </h3>

        <FormField
          id="content-title"
          label="✨ Title"
          value={localProps.title || ""}
          onChange={(value: string) => onInputChange("title", value)}
        />

        <FormField
          id="content-description"
          label="📄 Description"
          value={localProps.description || ""}
          onChange={(value: string) => onInputChange("description", value)}
          multiline
        />
      </div>
    );
  }
);

ContentPropertiesForm.displayName = "ContentPropertiesForm";
