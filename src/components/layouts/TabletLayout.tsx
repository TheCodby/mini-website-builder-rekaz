import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface TabletLayoutProps {
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

export const TabletLayout = memo<TabletLayoutProps>(
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
    const [showProperties, setShowProperties] = useState(false);
    const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

    const selectedSection = builderState.sections.find(
      (s: Section) => s.id === builderState.selectedSectionId
    );

    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <Header
          isPreviewMode={builderState.isPreviewMode}
          onTogglePreview={actions.handleTogglePreview}
          isTablet={true}
          onToggleLeftSidebar={() =>
            setLeftSidebarCollapsed(!leftSidebarCollapsed)
          }
          leftSidebarCollapsed={leftSidebarCollapsed}
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
          {/* Left: Collapsible Section Library */}
          <aside
            className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden ${
              leftSidebarCollapsed ? "w-16" : "w-72 min-w-0"
            }`}
          >
            <div className="flex-1 overflow-hidden">
              <SectionLibrary
                onAddSection={actions.handleAddSection}
                isTablet={true}
                collapsed={leftSidebarCollapsed}
              />
            </div>
          </aside>

          {/* Center: Builder Area (gets maximum space) */}
          <main className="flex-1 bg-white min-w-0">
            <BuilderArea
              sections={builderState.sections}
              selectedSectionId={builderState.selectedSectionId}
              isPreviewMode={builderState.isPreviewMode}
              onSelectSection={actions.handleSelectSection}
              activeId={activeId}
              overId={overId}
              isDragging={isDragging}
              isMobile={false}
              isTablet={true}
            />

            {/* Floating edit button for selected sections on tablet */}
            <AnimatePresence>
              {!builderState.isPreviewMode &&
                selectedSection &&
                !showProperties && (
                  <motion.button
                    onClick={() => setShowProperties(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors z-40 flex items-center justify-center"
                    aria-label="Edit selected section"
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      scale: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <motion.svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </motion.svg>
                  </motion.button>
                )}
            </AnimatePresence>
          </main>
        </div>

        {/* Tablet Properties Panel Overlay (when component is selected) */}
        <AnimatePresence>
          {showProperties && selectedSection && !builderState.isPreviewMode && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-end"
              onClick={() => setShowProperties(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-full md:w-96 md:h-full bg-white md:rounded-l-xl max-h-[85vh] md:max-h-full flex flex-col overflow-hidden md:shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                initial={{
                  x: "100%",
                  y: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                }}
                exit={{
                  x: "100%",
                  y: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
              >
                <motion.div
                  className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <h2 className="text-lg font-semibold">Edit Section</h2>
                  <motion.button
                    onClick={() => setShowProperties(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
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
                  </motion.button>
                </motion.div>
                <motion.div
                  className="flex-1 overflow-y-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.15,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <PropertiesPanel
                    selectedSection={selectedSection}
                    onUpdateSection={actions.handleUpdateSection}
                    onDeleteSection={(sectionId) => {
                      actions.handleDeleteSection(sectionId);
                      setShowProperties(false);
                    }}
                    isMobile={true}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

TabletLayout.displayName = "TabletLayout";
