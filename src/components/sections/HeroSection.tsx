import { memo } from "react";
import type { SectionProps } from "@/types/builder";

interface HeroSectionProps extends SectionProps {
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: () => void;
}

export const HeroSection = memo<HeroSectionProps>(
  ({
    title = "Welcome to Our Website",
    subtitle = "Create amazing experiences with our platform",
    buttonText = "Get Started",
    buttonUrl = "#",
    backgroundColor = "#1e40af",
    textColor = "#ffffff",
    isSelected = false,
    isPreviewMode = false,
    onClick,
  }) => {
    const handleClick = () => {
      if (!isPreviewMode && onClick) {
        onClick();
      }
    };

    const handleButtonClick = (e: React.MouseEvent) => {
      if (isPreviewMode && buttonUrl) {
        window.open(buttonUrl, "_blank", "noopener,noreferrer");
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Calculate contrast for button styling
    const isLightBackground = (color: string) => {
      const hex = color.replace("#", "");
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const buttonBgColor = isLightBackground(backgroundColor || "#1e40af")
      ? "#1f2937"
      : "#ffffff";
    const buttonTextColor = isLightBackground(backgroundColor || "#1e40af")
      ? "#ffffff"
      : "#1f2937";

    return (
      <section
        className={`relative min-h-96 flex items-center justify-center px-6 py-16 transition-all duration-200 ${
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
        style={{ backgroundColor: backgroundColor || "#1e40af" }}
        onClick={handleClick}
        role={isPreviewMode ? "banner" : "button"}
        tabIndex={isPreviewMode ? -1 : 0}
        aria-label={isPreviewMode ? undefined : "Select hero section to edit"}
        onKeyDown={(e) => {
          if (!isPreviewMode && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className="text-center max-w-4xl mx-auto"
          style={{ color: textColor || "#ffffff" }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              {subtitle}
            </p>
          )}

          {buttonText && (
            <button
              onClick={handleButtonClick}
              className="inline-flex items-center px-8 py-4 font-semibold rounded-lg hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                borderColor: buttonTextColor + "20",
              }}
              aria-label={`${buttonText}${
                buttonUrl && isPreviewMode ? " - Opens in new tab" : ""
              }`}
            >
              {buttonText}
            </button>
          )}
        </div>

        {!isPreviewMode && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
            Hero Section
          </div>
        )}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";
