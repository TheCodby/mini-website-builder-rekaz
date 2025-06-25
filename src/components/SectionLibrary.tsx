import type { SectionTemplate } from "@/types/builder";

interface SectionLibraryProps {
  onAddSection: (template: SectionTemplate) => void;
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: "hero-1",
    name: "Hero Section",
    type: "hero",
    description: "A bold hero section with title, subtitle, and CTA button",
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

export const SectionLibrary = ({ onAddSection }: SectionLibraryProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Section Library</h2>
        <p className="text-sm text-gray-500 mt-1">
          Click to add sections to your page
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sectionTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onAddSection(template)}
            className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left group"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{template.preview}</div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-25">
        <p className="text-xs text-gray-400 text-center">
          More section types coming soon
        </p>
      </div>
    </div>
  );
};
