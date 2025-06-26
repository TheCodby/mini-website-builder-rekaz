import { memo } from "react";
import type { SectionProps, NavLink } from "@/types/builder";
import { FormField } from "../shared/FormField";
import { LinkArrayEditor } from "../shared/LinkArrayEditor";

interface HeaderPropertiesFormProps {
  localProps: SectionProps;
  onInputChange: (key: string, value: string | unknown[]) => void;
  onArrayUpdate: (key: string, value: unknown[]) => void;
}

export const HeaderPropertiesForm = memo<HeaderPropertiesFormProps>(
  ({ localProps, onInputChange, onArrayUpdate }) => {
    return (
      <div className="space-y-8 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
          Content
        </h3>

        <FormField
          id="header-title"
          label="✨ Brand Title"
          value={localProps.title || ""}
          onChange={(value: string) => onInputChange("title", value)}
          placeholder="e.g., Your Brand Name"
        />

        <LinkArrayEditor
          label="🔗 Navigation Links"
          links={(localProps.navLinks as NavLink[]) || []}
          onChange={(links: NavLink[]) => onArrayUpdate("navLinks", links)}
          addButtonText="Add Navigation Link"
        />
      </div>
    );
  }
);

HeaderPropertiesForm.displayName = "HeaderPropertiesForm";
