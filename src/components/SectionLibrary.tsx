import type { SectionTemplate } from "@/types/builder";
import { DraggableTemplate } from "./DraggableTemplate";

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
    preview: "🎯",
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
    preview: "📄",
    defaultProps: {
      title: "Your Brand",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
    },
  },
  {
    id: "content-1",
    name: "Content Block",
    type: "content",
    description: "Simple content section with title and description",
    preview: "📝",
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
    preview: "🔗",
    defaultProps: {
      title: "Your Company",
      description: "© 2024 Your Company. All rights reserved.",
      backgroundColor: "#1f2937",
      textColor: "#ffffff",
    },
  },
];

export const SectionLibrary = ({
  onAddSection,
  isMobile = false,
  isTablet = false,
  collapsed = false,
}: SectionLibraryProps) => {
  return (
    <div className={`${isMobile ? "" : "h-full flex flex-col"} bg-white`}>
      {/* Header - show for desktop and collapsed tablet */}
      {!isMobile && (
        <div
          className={`${
            isTablet && collapsed ? "p-3" : "p-6"
          } border-b border-gray-200`}
        >
          {isTablet && collapsed ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <svg
                  className="w-4 h-4 text-blue-600"
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
              <span className="text-xs text-gray-500 text-center">Library</span>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Section Library
              </h2>
              <p className="text-sm text-gray-500">
                {isMobile
                  ? "Click to add sections to your page"
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
        <div className="grid gap-4">
          {sectionTemplates.map((template) => (
            <DraggableTemplate
              key={template.id}
              template={template}
              isMobile={isMobile}
              onAddSection={onAddSection}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl group-hover:bg-blue-100 transition-colors duration-200">
                  {template.preview}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                {/* Add/Drag icon */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        isMobile
                          ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                          : "M4 8h16M4 16h16"
                      }
                    />
                  </svg>
                </div>
              </div>
            </DraggableTemplate>
          ))}
        </div>
      </div>

      {/* Footer - only show when not in mobile overlay */}
      {!isMobile && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Need more sections?</p>
            <p className="text-xs text-gray-400">More templates coming soon</p>
          </div>
        </div>
      )}
    </div>
  );
};
