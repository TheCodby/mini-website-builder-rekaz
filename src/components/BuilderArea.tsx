import { memo } from "react";
import type { Section } from "@/types/builder";
import { SectionRenderer } from "./SectionRenderer";

interface BuilderAreaProps {
  sections: Section[];
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  onSelectSection: (sectionId: string | null) => void;
  isMobile?: boolean;
}

export const BuilderArea = memo<BuilderAreaProps>(
  ({
    sections,
    selectedSectionId,
    isPreviewMode,
    onSelectSection,
    isMobile = false,
  }) => {
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);

    const handleSectionClick = (sectionId: string) => {
      if (!isPreviewMode) {
        onSelectSection(sectionId);
      }
    };

    const handleBackgroundClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !isPreviewMode) {
        onSelectSection(null);
      }
    };

    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        {!isPreviewMode && (
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Website Builder
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {sections.length} section{sections.length !== 1 ? "s" : ""}{" "}
                  added
                  {isMobile && selectedSectionId && " • Tap to edit properties"}
                </p>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {sections.length}
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div
          className={`flex-1 overflow-y-auto ${
            isPreviewMode ? "bg-white" : "bg-gray-50"
          }`}
          onClick={handleBackgroundClick}
        >
          {sections.length === 0 ? (
            // Empty state
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Let&apos;s start building!
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {isMobile
                    ? "Tap the + button to add your first section and start creating your website."
                    : "Choose a section from the library on the left to start building your website."}
                </p>

                {/* Quick start tips */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Add sections to build your page structure
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Click sections to customize their content
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Use preview mode to see the final result
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Sections list
            <div
              className={`${isPreviewMode ? "" : "p-6"} space-y-${
                isPreviewMode ? "0" : "4"
              }`}
            >
              {sortedSections.map((section, index) => (
                <div
                  key={section.id}
                  className={`relative group ${
                    !isPreviewMode ? "rounded-xl overflow-hidden" : ""
                  } ${
                    !isPreviewMode && selectedSectionId === section.id
                      ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg"
                      : !isPreviewMode
                      ? "hover:shadow-md transition-shadow duration-200"
                      : ""
                  }`}
                >
                  <SectionRenderer
                    section={section}
                    isSelected={selectedSectionId === section.id}
                    isPreviewMode={isPreviewMode}
                    onClick={() => handleSectionClick(section.id)}
                  />

                  {/* Section indicator - shows on hover when not selected */}
                  {!isPreviewMode && selectedSectionId !== section.id && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Section {index + 1}
                    </div>
                  )}

                  {/* Selection indicator - shows section number when selected */}
                  {!isPreviewMode && selectedSectionId === section.id && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Section {index + 1} • Selected
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

BuilderArea.displayName = "BuilderArea";
