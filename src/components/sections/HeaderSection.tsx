import { memo } from "react";
import type { SectionProps } from "@/types/builder";

interface HeaderSectionProps extends SectionProps {
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: () => void;
}

export const HeaderSection = memo<HeaderSectionProps>(
  ({
    title = "Your Brand",
    backgroundColor = "#ffffff",
    textColor = "#1f2937",
    isSelected = false,
    isPreviewMode = false,
    onClick,
  }) => {
    const handleClick = () => {
      if (!isPreviewMode && onClick) {
        onClick();
      }
    };

    // Ensure proper border color based on text color
    const borderColor = textColor ? `${textColor}20` : "#e5e7eb";

    return (
      <header
        className={`relative w-full px-6 py-4 border-b transition-all duration-200 ${
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
        style={{
          backgroundColor: backgroundColor || "#ffffff",
          borderBottomColor: borderColor,
        }}
        onClick={handleClick}
        role={isPreviewMode ? "banner" : "button"}
        tabIndex={isPreviewMode ? -1 : 0}
        aria-label={isPreviewMode ? undefined : "Select header section to edit"}
        onKeyDown={(e) => {
          if (!isPreviewMode && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className="flex items-center justify-between max-w-7xl mx-auto"
          style={{ color: textColor || "#1f2937" }}
        >
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              onClick={(e) => e.preventDefault()}
              aria-label="Home navigation link"
              style={{ color: textColor || "#1f2937" }}
            >
              Home
            </a>
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              onClick={(e) => e.preventDefault()}
              aria-label="About navigation link"
              style={{ color: textColor || "#1f2937" }}
            >
              About
            </a>
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              onClick={(e) => e.preventDefault()}
              aria-label="Services navigation link"
              style={{ color: textColor || "#1f2937" }}
            >
              Services
            </a>
            <a
              href="#"
              className="hover:opacity-75 transition-opacity"
              onClick={(e) => e.preventDefault()}
              aria-label="Contact navigation link"
              style={{ color: textColor || "#1f2937" }}
            >
              Contact
            </a>
          </nav>

          <div className="md:hidden">
            <button
              className="p-2 rounded hover:bg-gray-100 hover:bg-opacity-20 transition-colors"
              onClick={(e) => e.preventDefault()}
              aria-label="Toggle mobile menu"
              style={{ color: textColor || "#1f2937" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {!isPreviewMode && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
            Header Section
          </div>
        )}
      </header>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
