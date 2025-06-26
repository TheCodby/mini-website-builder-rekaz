import { memo } from "react";
import type { Section, SectionProps } from "@/types/builder";
import { HeroPropertiesForm } from "./forms/HeroPropertiesForm";
import { HeaderPropertiesForm } from "./forms/HeaderPropertiesForm";
import { ContentPropertiesForm } from "./forms/ContentPropertiesForm";
import { FooterPropertiesForm } from "./forms/FooterPropertiesForm";

interface PropertyFormRendererProps {
  selectedSection: Section;
  localProps: SectionProps;
  onInputChange: (key: string, value: string | unknown[]) => void;
  onArrayUpdate: (key: string, value: unknown[]) => void;
}

export const PropertyFormRenderer = memo<PropertyFormRendererProps>(
  ({ selectedSection, localProps, onInputChange, onArrayUpdate }) => {
    const commonProps = {
      localProps,
      onInputChange,
      onArrayUpdate,
    };

    switch (selectedSection.type) {
      case "hero":
        return <HeroPropertiesForm {...commonProps} />;
      case "header":
        return <HeaderPropertiesForm {...commonProps} />;
      case "content":
        return <ContentPropertiesForm {...commonProps} />;
      case "footer":
        return <FooterPropertiesForm {...commonProps} />;
      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>No properties available for this section type.</p>
          </div>
        );
    }
  }
);

PropertyFormRenderer.displayName = "PropertyFormRenderer";
