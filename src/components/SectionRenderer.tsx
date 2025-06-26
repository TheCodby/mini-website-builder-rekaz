import { memo } from "react";
import type { Section } from "@/types/builder";
import {
  HeroSection,
  HeaderSection,
  ContentSection,
  FooterSection,
} from "./sections";

interface SectionRendererProps {
  section: Section;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: () => void;
  onSelectSection?: (sectionId: string) => void; // Keep for backward compatibility
}

export const SectionRenderer = memo<SectionRendererProps>(
  ({
    section,
    isSelected = false,
    isPreviewMode = false,
    onClick,
    onSelectSection,
  }) => {
    const handleSectionClick = (e?: React.MouseEvent) => {
      // Prevent event from bubbling up to BuilderArea background click handler
      if (e) {
        e.stopPropagation();
      }

      if (!isPreviewMode) {
        // Use onClick if provided, otherwise use onSelectSection for backward compatibility
        if (onClick) {
          onClick();
        } else if (onSelectSection) {
          onSelectSection(section.id);
        }
      }
    };

    const commonProps = {
      ...section.props,
      sectionId: section.id,
      isSelected,
      isPreviewMode,
      onClick: handleSectionClick,
    };

    switch (section.type) {
      case "hero":
        return <HeroSection {...commonProps} />;

      case "header":
        return <HeaderSection {...commonProps} />;

      case "content":
        return <ContentSection {...commonProps} />;

      case "footer":
        return <FooterSection {...commonProps} />;

      default:
        // Graceful fallback for unknown section types
        return (
          <div
            data-section-id={section.id}
            className={`relative p-8 bg-gray-100 border-2 border-dashed border-gray-300 text-center transition-all duration-200 ${
              !isPreviewMode ? "cursor-pointer" : ""
            } ${
              isSelected && !isPreviewMode
                ? "ring-2 ring-red-500 ring-offset-2"
                : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleSectionClick();
            }}
            role={isPreviewMode ? "region" : "button"}
            tabIndex={isPreviewMode ? -1 : 0}
            aria-label={
              isPreviewMode
                ? undefined
                : `Select unknown section type '${section.type}' to edit`
            }
            onKeyDown={(e) => {
              if (!isPreviewMode && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                handleSectionClick();
              }
            }}
          >
            <div className="text-gray-500">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">
                Unknown Section Type
              </h3>
              <p className="text-sm">
                Section type &apos;{section.type}&apos; is not recognized
              </p>
            </div>

            {!isPreviewMode && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                Unknown Section
              </div>
            )}
          </div>
        );
    }
  }
);

SectionRenderer.displayName = "SectionRenderer";
