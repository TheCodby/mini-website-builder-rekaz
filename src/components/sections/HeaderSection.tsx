import { memo, useState } from "react";
import type { SectionProps } from "@/types/builder";

interface HeaderSectionProps extends SectionProps {
  sectionId?: string;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

export const HeaderSection = memo<HeaderSectionProps>(
  ({
    sectionId,
    title = "Your Brand",
    backgroundColor = "#ffffff",
    textColor = "#1f2937",
    isSelected = false,
    isPreviewMode = false,
    onClick,
  }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleClick = (e?: React.MouseEvent) => {
      if (e) {
        e.stopPropagation();
      }
      if (!isPreviewMode && onClick) {
        onClick(e);
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
        data-section-id={sectionId}
        className={`relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b transition-all duration-200 ${
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
          borderBottomColor: borderColor,
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
          className="flex items-center justify-between w-full max-w-full mx-auto min-w-0"
          style={{ color: textColor || "#1f2937" }}
        >
          {/* Brand/Logo Section */}
          <div className="flex items-center flex-shrink-0 min-w-0 mr-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate min-w-0 max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
              {title}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-sm lg:text-base hover:opacity-75 transition-opacity py-2 px-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded whitespace-nowrap"
                onClick={(e) => e.preventDefault()}
                aria-label={`${link.name} navigation link`}
                style={{ color: textColor || "#1f2937" }}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0">
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

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            className="md:hidden absolute top-full left-0 right-0 z-50 border-t shadow-lg max-w-full overflow-hidden"
            style={{
              backgroundColor: backgroundColor || "#ffffff",
              borderTopColor: borderColor,
            }}
          >
            <nav className="px-4 py-3 space-y-1 max-w-full">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-3 py-3 text-base hover:bg-gray-100 hover:bg-opacity-20 rounded-lg transition-colors touch-target truncate"
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

        {/* Edit Mode Label */}
        {!isPreviewMode && (
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-black bg-opacity-75 text-white px-2 py-1 sm:px-3 sm:py-1 rounded text-xs sm:text-sm font-medium backdrop-blur-sm z-10">
            Header Section
          </div>
        )}
      </header>
    );
  }
);

HeaderSection.displayName = "HeaderSection";
