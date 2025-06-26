import { memo, useState } from "react";
import { DragOverlay } from "@dnd-kit/core";
import { Header } from "../Header";
import { BuilderArea } from "../BuilderArea";
import { PropertiesPanel } from "../PropertiesPanel";
import { SectionLibrary } from "../SectionLibrary";
import { SectionRenderer } from "../SectionRenderer";
import type {
  Section,
  SectionTemplate,
  BuilderState,
  AutoSaveState,
  SectionProps,
  ExportMetadata,
  ImportOptions,
} from "@/types/builder";

interface HistoryInfo {
  canUndo: boolean;
  canRedo: boolean;
  lastAction?: { description: string } | null;
  historySize: number;
}

interface MobileLayoutProps {
  builderState: BuilderState;
  historyInfo: HistoryInfo;
  autoSaveState: AutoSaveState;
  actions: {
    handleTogglePreview: () => void;
    handleSelectSection: (id: string | null) => void;
    handleAddSection: (template: SectionTemplate) => void;
    handleUpdateSection: (
      sectionId: string,
      props: SectionProps,
      shouldCreateHistory?: boolean
    ) => void;
    handleDeleteSection: (id: string) => void;
    handleUndo: () => void;
    handleRedo: () => void;
    handleExport: (
      metadata?: Partial<ExportMetadata>
    ) => Promise<{ success: boolean; filename?: string; error?: string }>;
    handleImport: (
      options?: ImportOptions
    ) => Promise<{ success: boolean; error?: string; warnings?: string[] }>;
    toggleAutoSave: (enabled: boolean) => void;
    clearAutoSavedData: () => void;
    handleRecoveryAccept: () => void;
    handleRecoveryDismiss: () => void;
  };
  activeId: string | null;
  overId: string | null;
  isDragging: boolean;
  activeSection: Section | null;
}

export const MobileLayout = memo<MobileLayoutProps>(
  ({
    builderState,
    historyInfo,
    autoSaveState,
    actions,
    activeId,
    overId,
    isDragging,
    activeSection,
  }) => {
    const [showLibrary, setShowLibrary] = useState(false);
    const [showProperties, setShowProperties] = useState(false);

    const selectedSection = builderState.sections.find(
      (s: Section) => s.id === builderState.selectedSectionId
    );

    const handleSelectSection = (sectionId: string | null) => {
      actions.handleSelectSection(sectionId);
      if (sectionId) {
        setShowProperties(true);
      } else {
        setShowProperties(false);
      }
    };

    const handleAddSection = (template: SectionTemplate) => {
      actions.handleAddSection(template);
      setShowLibrary(false);
    };

    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header
          isPreviewMode={builderState.isPreviewMode}
          onTogglePreview={actions.handleTogglePreview}
          isMobile={true}
          onUndo={actions.handleUndo}
          onRedo={actions.handleRedo}
          canUndo={historyInfo.canUndo}
          canRedo={historyInfo.canRedo}
          lastAction={historyInfo.lastAction?.description}
          onExport={actions.handleExport}
          onImport={actions.handleImport}
          autoSaveState={autoSaveState}
          onToggleAutoSave={actions.toggleAutoSave}
          onClearAutoSave={actions.clearAutoSavedData}
        />

        {/* Main builder area */}
        <div className="flex-1 relative overflow-hidden">
          <div className="h-full">
            <BuilderArea
              sections={builderState.sections}
              selectedSectionId={builderState.selectedSectionId}
              isPreviewMode={builderState.isPreviewMode}
              onSelectSection={handleSelectSection}
              activeId={activeId}
              overId={overId}
              isDragging={isDragging}
              isMobile={true}
            />
          </div>

          {/* Floating action button to open library */}
          {!builderState.isPreviewMode && (
            <button
              onClick={() => setShowLibrary(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40"
              aria-label="Add Section"
            >
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}

          {/* Section Library Overlay */}
          {showLibrary && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
              onClick={() => setShowLibrary(false)}
            >
              <div
                className="w-full bg-white rounded-t-xl max-h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg font-semibold">Add Section</h2>
                  <button
                    onClick={() => setShowLibrary(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SectionLibrary
                    onAddSection={handleAddSection}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Properties Panel Overlay */}
          {showProperties && selectedSection && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
              onClick={() => setShowProperties(false)}
            >
              <div
                className="w-full bg-white rounded-t-xl max-h-[80vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                  <h2 className="text-lg font-semibold">Edit Section</h2>
                  <button
                    onClick={() => setShowProperties(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <PropertiesPanel
                    selectedSection={selectedSection}
                    onUpdateSection={actions.handleUpdateSection}
                    onDeleteSection={actions.handleDeleteSection}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeSection && (
            <div className="opacity-75 rotate-2 scale-105">
              <SectionRenderer
                section={activeSection}
                isSelected={false}
                isPreviewMode={false}
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </div>
    );
  }
);

MobileLayout.displayName = "MobileLayout";
