import { memo } from "react";
import type { SectionProps, FooterLinkSection } from "@/types/builder";
import { FormField } from "../shared/FormField";
import { FooterLinkEditor } from "../shared/FooterLinkEditor";

interface FooterPropertiesFormProps {
  localProps: SectionProps;
  onInputChange: (key: string, value: string | unknown[]) => void;
  onArrayUpdate: (key: string, value: unknown[]) => void;
}

export const FooterPropertiesForm = memo<FooterPropertiesFormProps>(
  ({ localProps, onInputChange, onArrayUpdate }) => {
    return (
      <div className="space-y-8 min-w-0">
        <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
          <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
          Content
        </h3>

        <FormField
          id="footer-title"
          label="✨ Company Name"
          value={localProps.title || ""}
          onChange={(value: string) => onInputChange("title", value)}
          placeholder="e.g., Your Company"
        />

        <FormField
          id="footer-description"
          label="📄 Description"
          value={localProps.footerDescription || ""}
          onChange={(value: string) =>
            onInputChange("footerDescription", value)
          }
          multiline
        />

        <FormField
          id="footer-copyright"
          label="📄 Copyright Text"
          value={localProps.copyright || ""}
          onChange={(value: string) => onInputChange("copyright", value)}
        />

        <FooterLinkEditor
          footerLinks={(localProps.footerLinks as FooterLinkSection[]) || []}
          onChange={(footerLinks: FooterLinkSection[]) =>
            onArrayUpdate("footerLinks", footerLinks)
          }
        />
      </div>
    );
  }
);

FooterPropertiesForm.displayName = "FooterPropertiesForm";
