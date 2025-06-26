import { memo } from "react";
import type { SectionProps } from "@/types/builder";
import { FormField } from "../shared/FormField";

interface HeroPropertiesFormProps {
  localProps: SectionProps;
  onInputChange: (key: string, value: string | unknown[]) => void;
  onArrayUpdate: (key: string, value: unknown[]) => void;
}

export const HeroPropertiesForm = memo<HeroPropertiesFormProps>(
  ({ localProps, onInputChange }) => {
    return (
      <div className="space-y-8 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
          Content
        </h3>

        <FormField
          id="hero-title"
          label="✨ Title"
          value={localProps.title || ""}
          onChange={(value) => onInputChange("title", value)}
        />

        <FormField
          id="hero-subtitle"
          label="📝 Subtitle"
          value={localProps.subtitle || ""}
          onChange={(value) => onInputChange("subtitle", value)}
          multiline
        />

        <FormField
          id="hero-button-text"
          label="🔘 Button Text"
          value={localProps.buttonText || ""}
          onChange={(value) => onInputChange("buttonText", value)}
          placeholder="e.g., Get Started"
        />

        <FormField
          id="hero-button-url"
          label="🔗 Button URL"
          value={localProps.buttonUrl || ""}
          onChange={(value) => onInputChange("buttonUrl", value)}
        />
      </div>
    );
  }
);

HeroPropertiesForm.displayName = "HeroPropertiesForm";
