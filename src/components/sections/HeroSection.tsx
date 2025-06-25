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
      if (hex.length !== 6) return false;
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
        className={`relative min-h-[50vh] sm:min-h-[60vh] lg:min-h-[70vh] xl:min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 transition-all duration-200 ${
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
          className="text-center max-w-4xl mx-auto w-full"
          style={{ color: textColor || "#ffffff" }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 lg:mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}

          {buttonText && (
            <button
              onClick={handleButtonClick}
              className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 lg:px-10 lg:py-4 font-semibold text-sm sm:text-base lg:text-lg rounded-lg hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg touch-target min-h-[44px]"
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
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black bg-opacity-75 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium backdrop-blur-sm">
            Hero Section
          </div>
        )}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";
