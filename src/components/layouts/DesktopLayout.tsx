import { memo } from "react";
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

interface DesktopLayoutProps {
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

export const DesktopLayout = memo<DesktopLayoutProps>(
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
    const selectedSection = builderState.sections.find(
      (s: Section) => s.id === builderState.selectedSectionId
    );

    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header
          isPreviewMode={builderState.isPreviewMode}
          onTogglePreview={actions.handleTogglePreview}
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

        <div className="flex-1 flex overflow-hidden">
          {/* Left: Section Library */}
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <SectionLibrary onAddSection={actions.handleAddSection} />
          </aside>

          {/* Center: Builder Area */}
          <main className="flex-1 bg-white">
            <BuilderArea
              sections={builderState.sections}
              selectedSectionId={builderState.selectedSectionId}
              isPreviewMode={builderState.isPreviewMode}
              onSelectSection={actions.handleSelectSection}
              activeId={activeId}
              overId={overId}
              isDragging={isDragging}
            />
          </main>

          {/* Right: Properties Panel */}
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <PropertiesPanel
              selectedSection={selectedSection}
              onUpdateSection={actions.handleUpdateSection}
              onDeleteSection={actions.handleDeleteSection}
            />
          </aside>
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

DesktopLayout.displayName = "DesktopLayout";
