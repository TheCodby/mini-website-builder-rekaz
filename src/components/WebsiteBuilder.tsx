"use client";

import { Header } from "./Header";
import { SectionLibrary } from "./SectionLibrary";
import { BuilderArea } from "./BuilderArea";
import { PropertiesPanel } from "./PropertiesPanel";
import { ErrorBoundary } from "./ErrorBoundary";
import { useBuilderState } from "@/hooks/useBuilderState";

export const WebsiteBuilder = () => {
  const { builderState, actions } = useBuilderState();

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col bg-white">
        <Header
          isPreviewMode={builderState.isPreviewMode}
          onTogglePreview={actions.handleTogglePreview}
        />

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-sidebar bg-gray-50 border-r border-gray-200 flex flex-col">
            <SectionLibrary onAddSection={actions.handleAddSection} />
          </aside>

          <main className="flex-1 flex flex-col bg-gray-100">
            <BuilderArea
              sections={builderState.sections}
              selectedSectionId={builderState.selectedSectionId}
              isPreviewMode={builderState.isPreviewMode}
              onSelectSection={actions.handleSelectSection}
            />
          </main>

          <aside className="w-sidebar bg-gray-50 border-l border-gray-200 flex flex-col">
            <PropertiesPanel
              selectedSection={builderState.sections.find(
                (s) => s.id === builderState.selectedSectionId
              )}
              onUpdateSection={actions.handleUpdateSection}
              onDeleteSection={actions.handleDeleteSection}
            />
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
};
