import { memo, useState } from "react";
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleClick = () => {
      if (!isPreviewMode && onClick) {
        onClick();
      }
    };

    const handleMobileMenuToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMobileMenuOpen(!mobileMenuOpen);
    };

    // Ensure proper border color based on text color
    const borderColor = textColor ? `${textColor}20` : "#e5e7eb";

    const navLinks = [
      { name: "Home", href: "#" },
      { name: "About", href: "#" },
      { name: "Services", href: "#" },
      { name: "Contact", href: "#" },
    ];

    return (
      <header
        className={`relative w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b transition-all duration-200 ${
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
          <div className="flex items-center flex-shrink-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate max-w-[200px] sm:max-w-none">
              {title}
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm lg:text-base hover:opacity-75 transition-opacity py-2 px-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                onClick={(e) => e.preventDefault()}
                aria-label={`${link.name} navigation link`}
                style={{ color: textColor || "#1f2937" }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="md:hidden">
            <button
              type="button"
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-20 transition-colors touch-target min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile navigation menu"
              style={{ color: textColor || "#1f2937" }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 z-50 border-t shadow-lg"
            style={{
              backgroundColor: backgroundColor || "#ffffff",
              borderTopColor: borderColor,
            }}
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-3 py-3 text-base hover:bg-gray-100 hover:bg-opacity-20 rounded-lg transition-colors touch-target"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMobileMenuOpen(false);
                  }}
                  style={{ color: textColor || "#1f2937" }}
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>
        )}

        {!isPreviewMode && (
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black bg-opacity-75 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium backdrop-blur-sm">
            Header Section
          </div>
        )}
      </header>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
