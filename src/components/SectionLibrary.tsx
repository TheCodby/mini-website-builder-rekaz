import { memo } from "react";
import { motion } from "framer-motion";
import type { SectionTemplate } from "@/types/builder";
import { DraggableTemplate } from "./DraggableTemplate";
import {
  staggerContainer,
  staggerItem,
  animationPresets,
} from "@/utils/animations";
import Image from "next/image";

interface SectionLibraryProps {
  onAddSection: (template: SectionTemplate) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  collapsed?: boolean;
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: "hero-1",
    name: "Hero Section",
    type: "hero",
    description:
      "Eye-catching hero section with title, subtitle, and call-to-action button",
    preview: "/hero.png",
    defaultProps: {
      title: "Welcome to Our Website",
      subtitle: "Create amazing experiences with our platform",
      buttonText: "Get Started",
      buttonUrl: "#",
      backgroundColor: "#1e40af",
      textColor: "#ffffff",
    },
  },
  {
    id: "header-1",
    name: "Navigation Header",
    type: "header",
    description: "Clean navigation header with logo and menu items",
    preview: "/header.png",
    defaultProps: {
      title: "Your Brand",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      navLinks: [
        { name: "Home", href: "#" },
        { name: "About", href: "#" },
        { name: "Services", href: "#" },
        { name: "Contact", href: "#" },
      ],
    },
  },
  {
    id: "content-1",
    name: "Content Block",
    type: "content",
    description: "Simple content section with title and description",
    preview: "/content.png",
    defaultProps: {
      title: "About Us",
      description:
        "Tell your story and connect with your audience through compelling content.",
      backgroundColor: "#ffffff",
      textColor: "#374151",
    },
  },
  {
    id: "footer-1",
    name: "Footer",
    type: "footer",
    description: "Clean footer with copyright and links",
    preview: "/footer.png",
    defaultProps: {
      title: "Your Company",
      footerDescription:
        "Building amazing digital experiences for our customers and communities worldwide.",
      copyright: "© 2024 Your Company. All rights reserved.",
      backgroundColor: "#1f2937",
      textColor: "#ffffff",
      footerLinks: [
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
      ],
    },
  },
];

export const SectionLibrary = memo<SectionLibraryProps>(
  ({ onAddSection, isMobile = false, isTablet = false, collapsed = false }) => {
    return (
      <motion.div
        className={`${isMobile ? "" : "h-full flex flex-col"} bg-white`}
        {...animationPresets.fadeIn}
      >
        {/* Header - show for desktop and collapsed tablet */}
        {!isMobile && (
          <div
            className={`${
              isTablet && collapsed ? "p-3" : "p-6"
            } border-b border-gray-200`}
          >
            {isTablet && collapsed ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <svg
                    className="w-4 h-4 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 text-center">
                  Library
                </span>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Section Library
                </h2>
                <p className="text-sm text-gray-500">
                  {isMobile
                    ? "Tap to add sections or hold & drag to position them"
                    : "Drag or click to add sections to your page"}
                </p>
              </>
            )}
          </div>
        )}

        {/* Section Grid */}
        <div
          className={`${isMobile ? "" : "flex-1 overflow-y-auto"} ${
            isTablet && collapsed ? "p-2" : "p-6"
          }`}
        >
          <motion.div
            className="grid gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {sectionTemplates.map((template) => (
              <motion.div key={template.id} variants={staggerItem}>
                <DraggableTemplate
                  template={template}
                  isMobile={isMobile}
                  onAddSection={onAddSection}
                >
                  <div className="flex items-start space-x-4">
                    {/* Preview Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden group-hover:bg-primary-100 transition-colors duration-200 border border-gray-200 group-hover:border-primary-300 relative">
                      <Image
                        fill
                        src={template.preview}
                        alt={`${template.name} preview`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to emoji if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const fallback =
                            target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      {/* Fallback emoji */}
                      <div
                        className="w-full h-full flex items-center justify-center text-xl"
                        style={{ display: "none" }}
                      >
                        {template.type === "hero" && "🎯"}
                        {template.type === "header" && "📄"}
                        {template.type === "content" && "📝"}
                        {template.type === "footer" && "🔗"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200 mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </DraggableTemplate>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer - only show when not in mobile overlay */}
        {!isMobile && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {sectionTemplates.length} section
                {sectionTemplates.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        )}
      </motion.div>
    );
  }
);

SectionLibrary.displayName = "SectionLibrary";
