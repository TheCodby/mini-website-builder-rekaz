import { memo } from "react";
import type { SectionProps } from "@/types/builder";

interface ContentSectionProps extends SectionProps {
  sectionId?: string;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

export const ContentSection = memo<ContentSectionProps>(
  ({
    sectionId,
    title = "About Us",
    description = "Tell your story and connect with your audience through compelling content.",
    backgroundColor = "#ffffff",
    textColor = "#374151",
    isSelected = false,
    isPreviewMode = false,
    onClick,
  }) => {
    const handleClick = (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (!isPreviewMode && onClick) {
        onClick(e);
      }
    };

    return (
      <section
        data-section-id={sectionId}
        className={`relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24 transition-all duration-200 ${
          !isPreviewMode ? "cursor-pointer" : ""
        } ${
          isSelected && !isPreviewMode
            ? "ring-2 ring-primary-500 ring-offset-2"
            : ""
        } ${
          !isPreviewMode
            ? "hover:ring-1 hover:ring-primary-300 hover:ring-offset-1"
            : ""
        }`}
        style={{
          backgroundColor: backgroundColor || "#ffffff",
          ...(isSelected &&
            !isPreviewMode && {
              ringColor: "#df625b",
              boxShadow: "0 0 0 2px #df625b, 0 0 0 4px rgba(223, 98, 91, 0.1)",
            }),
          ...(!isPreviewMode && {
            ":hover": {
              ringColor: "#f87171",
              boxShadow:
                "0 0 0 1px #f87171, 0 0 0 3px rgba(248, 113, 113, 0.1)",
            },
          }),
        }}
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 lg:mb-10 leading-tight">
              {title}
            </h2>
          )}

          {description && (
            <div className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto max-w-none">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed opacity-90 max-w-3xl mx-auto">
                {description}
              </p>
            </div>
          )}
        </div>

        {!isPreviewMode && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black bg-opacity-75 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium backdrop-blur-sm">
            Content Section
          </div>
        )}
      </section>
    );
  }
);

ContentSection.displayName = "ContentSection";
