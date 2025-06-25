import type { Section } from "@/types/builder";
import { SectionRenderer } from "./SectionRenderer";

interface BuilderAreaProps {
  sections: Section[];
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  onSelectSection: (sectionId: string | null) => void;
}

export const BuilderArea = ({
  sections,
  selectedSectionId,
  isPreviewMode,
  onSelectSection,
}: BuilderAreaProps) => {
  if (sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 max-w-md">
          <div className="text-6xl mb-6">🎨</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Start Building Your Website
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Add sections from the library on the left to start creating your
            website. Click on any section template to add it to your page.
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <span>💡</span>
            <span>
              Pro tip: Use the preview mode to see how your site looks
            </span>
          </div>
        </div>
      </div>
    );
  }

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div
      className={`h-full overflow-auto ${
        isPreviewMode ? "bg-white" : "bg-gray-50"
      }`}
    >
      <div className={`${isPreviewMode ? "" : "p-4"}`}>
        {!isPreviewMode && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Website Preview
              </h2>
              <div className="text-sm text-gray-500">
                {sections.length} section{sections.length !== 1 ? "s" : ""}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Click on any section to edit its properties
            </p>
          </div>
        )}

        <div className={`${isPreviewMode ? "" : "space-y-4"}`}>
          {sortedSections.map((section) => (
            <div
              key={section.id}
              className={`${
                isPreviewMode
                  ? ""
                  : "border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              }`}
            >
              <SectionRenderer
                section={section}
                isSelected={selectedSectionId === section.id}
                isPreviewMode={isPreviewMode}
                onSelectSection={onSelectSection}
              />
            </div>
          ))}
        </div>

        {!isPreviewMode && sections.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                  Builder Tips
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Click on any section to select and edit it</li>
                  <li>
                    • Use the properties panel on the right to customize
                    sections
                  </li>
                  <li>
                    • Toggle preview mode to see how your site looks to visitors
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
