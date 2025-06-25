import { memo } from "react";
import type { SectionProps } from "@/types/builder";

interface FooterSectionProps extends SectionProps {
  isSelected?: boolean;
  isPreviewMode?: boolean;
  onClick?: () => void;
}

export const FooterSection = memo<FooterSectionProps>(
  ({
    title = "Your Company",
    description = "© 2024 Your Company. All rights reserved.",
    backgroundColor = "#1f2937",
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

    // Ensure proper border color based on text color
    const borderColor = textColor ? `${textColor}20` : "#374151";

    return (
      <footer
        className={`relative w-full px-6 py-12 border-t transition-all duration-200 ${
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
          backgroundColor: backgroundColor || "#1f2937",
          borderTopColor: borderColor,
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              {title && <h3 className="text-2xl font-bold mb-4">{title}</h3>}
              <p className="opacity-90 max-w-md">
                Building amazing digital experiences for our customers and
                communities worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 opacity-90">
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: textColor || "#ffffff" }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: textColor || "#ffffff" }}
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: textColor || "#ffffff" }}
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 opacity-90">
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: textColor || "#ffffff" }}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: textColor || "#ffffff" }}
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:opacity-75 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                    style={{ color: textColor || "#ffffff" }}
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t pt-8 text-center opacity-75"
            style={{ borderTopColor: borderColor }}
          >
            <p>{description}</p>
          </div>
        </div>

        {!isPreviewMode && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-20 text-white px-3 py-1 rounded text-sm font-medium backdrop-blur-sm">
            Footer Section
          </div>
        )}
      </footer>
    );
  }
);

FooterSection.displayName = "FooterSection";
