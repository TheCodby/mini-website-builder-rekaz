"use client";

import { useState } from "react";
import { Header } from "./Header";
import { SectionLibrary } from "./SectionLibrary";
import { BuilderArea } from "./BuilderArea";
import { PropertiesPanel } from "./PropertiesPanel";
import { ErrorBoundary } from "./ErrorBoundary";
import { useBuilderState } from "@/hooks/useBuilderState";
import { useResponsive } from "@/hooks/useResponsive";
import type { SectionTemplate } from "@/types/builder";

export const WebsiteBuilder = () => {
  const { builderState, actions } = useBuilderState();
  const { isMobile, isTablet, isHydrated } = useResponsive();
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  const selectedSection = builderState.sections.find(
    (s) => s.id === builderState.selectedSectionId
  );

  const handleSelectSection = (sectionId: string | null) => {
    actions.handleSelectSection(sectionId);
    if (isMobile && sectionId) {
      setShowProperties(true);
    }
  };

  const handleAddSection = (template: SectionTemplate) => {
    actions.handleAddSection(template);
    if (isMobile) {
      setShowLibrary(false);
    }
  };

  // Progressive enhancement: start with server-rendered layout
  if (!isHydrated) {
    return (
      <ErrorBoundary>
        <div className="h-screen flex flex-col bg-gray-50">
          {/* Simple header for SSR */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <h1 className="text-xl font-bold text-gray-900">
              Mini Website Builder
            </h1>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Preview
            </button>
          </header>

          {/* Simple 3-column layout for desktop */}
          <div className="flex-1 flex">
            <aside className="w-80 bg-white border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Section Library</h2>
                <div className="space-y-2">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    🎯 Hero Section
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    📄 Header Section
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    📝 Content Section
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    🔗 Footer Section
                  </div>
                </div>
              </div>
            </aside>

            <main className="flex-1 bg-white">
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">Start Building</h3>
                  <p>Add sections from the library to create your website</p>
                </div>
              </div>
            </main>

            <aside className="w-80 bg-white border-l border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Properties</h2>
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">🎨</div>
                  <p>Select a section to edit its properties</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // After hydration: Enhanced mobile/desktop experience
  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className="h-screen flex flex-col bg-gray-50">
          <Header
            isPreviewMode={builderState.isPreviewMode}
            onTogglePreview={actions.handleTogglePreview}
            isMobile={true}
          />

          {/* Mobile: Stack panels with overlays */}
          <div className="flex-1 relative overflow-hidden">
            {/* Main builder area */}
            <div className="h-full">
              <BuilderArea
                sections={builderState.sections}
                selectedSectionId={builderState.selectedSectionId}
                isPreviewMode={builderState.isPreviewMode}
                onSelectSection={handleSelectSection}
                isMobile={true}
              />
            </div>

            {/* Floating action button to open library */}
            {!builderState.isPreviewMode && (
              <button
                onClick={() => setShowLibrary(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
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
        </div>
      </ErrorBoundary>
    );
  }

  // Tablet: Optimized layout with collapsible sidebars
  if (isTablet) {
    return (
      <ErrorBoundary>
        <div className="h-screen flex flex-col bg-gray-50">
          <Header
            isPreviewMode={builderState.isPreviewMode}
            onTogglePreview={actions.handleTogglePreview}
            isTablet={true}
            onToggleLeftSidebar={() =>
              setLeftSidebarCollapsed(!leftSidebarCollapsed)
            }
            onToggleRightSidebar={() =>
              setRightSidebarCollapsed(!rightSidebarCollapsed)
            }
            leftSidebarCollapsed={leftSidebarCollapsed}
            rightSidebarCollapsed={rightSidebarCollapsed}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Left: Collapsible Section Library */}
            <aside
              className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
                leftSidebarCollapsed ? "w-16" : "w-72"
              }`}
            >
              <SectionLibrary
                onAddSection={actions.handleAddSection}
                isTablet={true}
                collapsed={leftSidebarCollapsed}
              />
            </aside>

            {/* Center: Builder Area (gets maximum space) */}
            <main className="flex-1 bg-white min-w-0">
              <BuilderArea
                sections={builderState.sections}
                selectedSectionId={builderState.selectedSectionId}
                isPreviewMode={builderState.isPreviewMode}
                onSelectSection={actions.handleSelectSection}
              />
            </main>

            {/* Right: Collapsible Properties Panel */}
            <aside
              className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
                rightSidebarCollapsed ? "w-16" : "w-72"
              }`}
            >
              <PropertiesPanel
                selectedSection={selectedSection}
                onUpdateSection={actions.handleUpdateSection}
                onDeleteSection={actions.handleDeleteSection}
                isTablet={true}
                collapsed={rightSidebarCollapsed}
              />
            </aside>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Desktop: Clean 3-panel layout
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header
          isPreviewMode={builderState.isPreviewMode}
          onTogglePreview={actions.handleTogglePreview}
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
      </div>
    </ErrorBoundary>
  );
};
