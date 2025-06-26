import { memo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Section } from "@/types/builder";
import { SectionRenderer } from "./SectionRenderer";
import { DraggableSection } from "./DraggableSection";
import { DropZone } from "./DropZone";

interface BuilderAreaProps {
  sections: Section[];
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  onSelectSection: (sectionId: string | null) => void;
  activeId?: string | null;
  overId?: string | null;
  isDragging?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export const BuilderArea = memo<BuilderAreaProps>(
  ({
    sections,
    selectedSectionId,
    isPreviewMode,
    onSelectSection,
    activeId = null,
    overId = null,
    isDragging = false,
    isMobile = false,
    isTablet = false,
  }) => {
    const sortedSections = [...sections].sort((a, b) => a.order - b.order);
    const sectionIds = sortedSections.map((section) => section.id);

    const handleSectionClick = (sectionId: string) => {
      if (!isPreviewMode && !activeId) {
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
                  {isMobile &&
                    !selectedSectionId &&
                    " • Touch & hold drag handle to reorder"}
                  {!isMobile && " • Drag to reorder"}
                </p>
              </div>
              <div className="px-3 py-1 bg-primary-500 text-white rounded-full text-sm font-medium">
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
                    : "Choose a section from the library on the left to start building your website, or drag sections directly to the builder."}
                </p>

                {/* Quick start tips */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {isMobile
                      ? "Add sections to build your page structure"
                      : "Drag sections from the library to add them"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {isMobile
                      ? "Tap sections to customize their content"
                      : "Click sections to customize their content"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    {isMobile
                      ? "Hold & drag sections to reorder them"
                      : "Drag sections to reorder them"}
                  </div>
                </div>
              </div>

              {/* Drop zones for empty state */}
              {!isPreviewMode && (
                <DropZone
                  id="drop-zone-0"
                  index={0}
                  isActive={isDragging}
                  isOver={overId === "drop-zone-0"}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
              )}
            </div>
          ) : (
            // Sections list with sortable context
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              <div
                className={`${isPreviewMode ? "" : "p-6"} space-y-${
                  isPreviewMode ? "0" : "4"
                }`}
              >
                {/* Drop zone at the beginning */}
                {!isPreviewMode && (
                  <DropZone
                    id="drop-zone-0"
                    index={0}
                    isActive={isDragging}
                    isOver={overId === "drop-zone-0"}
                    isMobile={isMobile}
                    isTablet={isTablet}
                  />
                )}

                {sortedSections.map((section, index) => (
                  <div key={section.id}>
                    {isPreviewMode ? (
                      <SectionRenderer
                        section={section}
                        isSelected={selectedSectionId === section.id}
                        isPreviewMode={isPreviewMode}
                        onClick={() => handleSectionClick(section.id)}
                      />
                    ) : (
                      <DraggableSection
                        section={section}
                        isSelected={selectedSectionId === section.id}
                        isPreviewMode={isPreviewMode}
                        isMobile={isMobile}
                        isTablet={isTablet}
                        index={index}
                      >
                        <SectionRenderer
                          section={section}
                          isSelected={selectedSectionId === section.id}
                          isPreviewMode={isPreviewMode}
                          onClick={() => handleSectionClick(section.id)}
                        />
                      </DraggableSection>
                    )}

                    {/* Drop zone after each section */}
                    {!isPreviewMode && (
                      <DropZone
                        id={`drop-zone-${index + 1}`}
                        index={index + 1}
                        isActive={isDragging}
                        isOver={overId === `drop-zone-${index + 1}`}
                        isMobile={isMobile}
                        isTablet={isTablet}
                      />
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    );
  }
);

BuilderArea.displayName = "BuilderArea";
