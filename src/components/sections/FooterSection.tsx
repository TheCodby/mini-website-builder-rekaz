import { memo } from "react";
import type { SectionProps } from "@/types/builder";

interface FooterSectionProps extends SectionProps {
  sectionId?: string;
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
}

export const FooterSection = memo<FooterSectionProps>(
  ({
    sectionId,
    title = "Your Company",
    footerDescription = "Building amazing digital experiences for our customers and communities worldwide.",
    copyright = "© 2024 Your Company. All rights reserved.",
    footerLinks,
    backgroundColor = "#1f2937",
    textColor = "#ffffff",
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

    // Ensure proper border color based on text color
    const borderColor = textColor ? `${textColor}20` : "#374151";

    // Use custom footer links if provided, otherwise use defaults
    const footerSections = footerLinks || [
      {
        title: "Company",
        links: [
          { name: "About", href: "#" },
          { name: "Careers", href: "#" },
          { name: "Contact", href: "#" },
        ],
      },
      {
        title: "Support",
        links: [
          { name: "Help Center", href: "#" },
          { name: "Privacy", href: "#" },
          { name: "Terms", href: "#" },
        ],
      },
    ];

    return (
      <footer
        data-section-id={sectionId}
        className={`relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 border-t transition-all duration-200 ${
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
          backgroundColor: backgroundColor || "#1f2937",
          borderTopColor: borderColor,
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
        role={isPreviewMode ? "contentinfo" : "button"}
        tabIndex={isPreviewMode ? -1 : 0}
        aria-label={isPreviewMode ? undefined : "Select footer section to edit"}
        onKeyDown={(e) => {
          if (!isPreviewMode && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div
          className="max-w-7xl mx-auto"
          style={{ color: textColor || "#ffffff" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-6 sm:mb-8 lg:mb-12">
            <div className="sm:col-span-2 lg:col-span-2">
              {title && (
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                  {title}
                </h3>
              )}
              <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-md leading-relaxed">
                {footerDescription}
              </p>
            </div>

            {footerSections.map((section, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold">
                  {section.title}
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-sm sm:text-base opacity-90 hover:opacity-100 transition-opacity py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded block touch-target"
                        onClick={(e) => e.preventDefault()}
                        style={{ color: textColor || "#ffffff" }}
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="border-t pt-6 sm:pt-8 text-center opacity-75"
            style={{ borderTopColor: borderColor }}
          >
            <p className="text-xs sm:text-sm lg:text-base">{copyright}</p>
          </div>
        </div>
      </footer>
    );
  }
);

FooterSection.displayName = "FooterSection";
