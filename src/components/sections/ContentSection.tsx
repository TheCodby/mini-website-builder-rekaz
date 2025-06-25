import { memo } from "react";
import type { SectionProps } from "@/types/builder";

interface ContentSectionProps extends SectionProps {
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: () => void;
}

export const ContentSection = memo<ContentSectionProps>(
  ({
    title = "About Us",
    description = "Tell your story and connect with your audience through compelling content.",
    backgroundColor = "#ffffff",
    textColor = "#374151",
    isSelected = false,
    isPreviewMode = false,
    onClick,
  }) => {
    const handleClick = () => {
      if (!isPreviewMode && onClick) {
        onClick();
      }
    };

    return (
      <section
        className={`relative w-full px-6 py-16 transition-all duration-200 ${
          !isPreviewMode ? "cursor-pointer" : ""
        } ${
          isSelected && !isPreviewMode
            ? "ring-2 ring-blue-500 ring-offset-2"
            : ""
        } ${
          !isPreviewMode
            ? "hover:ring-1 hover:ring-blue-300 hover:ring-offset-1"
            : ""
        }`}
        style={{ backgroundColor: backgroundColor || "#ffffff" }}
        onClick={handleClick}
        role={isPreviewMode ? "main" : "button"}
        tabIndex={isPreviewMode ? -1 : 0}
        aria-label={
          isPreviewMode ? undefined : "Select content section to edit"
        }
        onKeyDown={(e) => {
          if (!isPreviewMode && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className="max-w-4xl mx-auto text-center"
          style={{ color: textColor || "#374151" }}
        >
          {title && (
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
              {title}
            </h2>
          )}

          {description && (
            <div className="prose prose-lg mx-auto">
              <p className="text-lg md:text-xl leading-relaxed opacity-90">
                {description}
              </p>
            </div>
          )}
        </div>

        {!isPreviewMode && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
            Content Section
          </div>
        )}
      </section>
    );
  }
);

ContentSection.displayName = "ContentSection";
