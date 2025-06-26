"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import { Header } from "./Header";
import { SectionLibrary } from "./SectionLibrary";
import { BuilderArea } from "./BuilderArea";
import { PropertiesPanel } from "./PropertiesPanel";
import { ErrorBoundary } from "./ErrorBoundary";
import { SectionRenderer } from "./SectionRenderer";
import { useBuilderState } from "@/hooks/useBuilderState";
import { useResponsive } from "@/hooks/useResponsive";
import type { SectionTemplate } from "@/types/builder";

export const WebsiteBuilder = () => {
  const { builderState, historyInfo, actions } = useBuilderState();
  const { isMobile, isTablet, isHydrated } = useResponsive();
  const [showLibrary, setShowLibrary] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);

  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Hide properties panel when entering preview mode or no section selected
  useEffect(() => {
    if (builderState.isPreviewMode || !builderState.selectedSectionId) {
      setShowProperties(false);
    }
  }, [builderState.isPreviewMode, builderState.selectedSectionId]);

  // Configure drag sensors with optimized touch support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: isMobile ? 150 : 250, // Shorter delay on mobile for better responsiveness
        tolerance: isMobile ? 8 : 5, // Higher tolerance on mobile for easier dragging
      },
    })
  );

  /**
   * Global keyboard shortcuts for undo/redo
   * Following clean code principles with proper cleanup
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in an input field
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true";

      if (isInputField) return;

      // Handle Ctrl/Cmd + Z/Y shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "z":
            if (event.shiftKey) {
              // Ctrl+Shift+Z = Redo
              event.preventDefault();
              actions.handleRedo();
            } else {
              // Ctrl+Z = Undo
              event.preventDefault();
              actions.handleUndo();
            }
            break;
          case "y":
            // Ctrl+Y = Redo (Windows standard)
            event.preventDefault();
            actions.handleRedo();
            break;
        }
      }
    };

    // Only add listeners after hydration to avoid SSR issues
    if (isHydrated) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [actions, isHydrated]);

  const selectedSection = builderState.sections.find(
    (s) => s.id === builderState.selectedSectionId
  );

  const handleSelectSection = (sectionId: string | null) => {
    actions.handleSelectSection(sectionId);

    if (isMobile) {
      if (sectionId) {
        setShowProperties(true);
      } else {
        setShowProperties(false);
      }
    }

    // On tablet, show properties as overlay when selecting a section
    if (isTablet) {
      if (sectionId) {
        setShowProperties(true); // Show as overlay instead
      } else {
        setShowProperties(false); // Hide when nothing is selected
      }
    }
  };

  const handleAddSection = (template: SectionTemplate) => {
    actions.handleAddSection(template);
    if (isMobile) {
      setShowLibrary(false);
    }
  };

  const handleAddSectionAtPosition = (
    template: SectionTemplate,
    position: number
  ) => {
    actions.handleAddSectionAtPosition(template, position);
  };

  const handleReorderSections = (sectionIds: string[]) => {
    actions.handleReorderSections(sectionIds);
  };

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle template drop from library
    if (activeData?.type === "template" && overData?.type === "drop-zone") {
      const template = activeData.template as SectionTemplate;
      const position = overData.index as number;
      handleAddSectionAtPosition(template, position);
      return;
    }

    // Handle section reordering
    if (activeData?.type === "section" && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;
      const sectionIds = builderState.sections.map((s) => s.id);

      // If dropping on another section, reorder
      if (overData?.type === "section") {
        const oldIndex = sectionIds.indexOf(activeId);
        const newIndex = sectionIds.indexOf(overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newSectionIds = [...sectionIds];
          const [removed] = newSectionIds.splice(oldIndex, 1);
          newSectionIds.splice(newIndex, 0, removed);
          handleReorderSections(newSectionIds);
        }
      }
      // If dropping on a drop zone, insert at that position
      else if (overData?.type === "drop-zone") {
        const oldIndex = sectionIds.indexOf(activeId);
        const newPosition = overData.index as number;

        if (oldIndex !== -1) {
          const newSectionIds = [...sectionIds];
          newSectionIds.splice(oldIndex, 1);

          const adjustedPosition =
            newPosition > oldIndex ? newPosition - 1 : newPosition;
          newSectionIds.splice(adjustedPosition, 0, activeId);

          handleReorderSections(newSectionIds);
        }
      }
    }
  };

  const activeSection = activeId
    ? builderState.sections.find((s) => s.id === activeId)
    : null;
  const isDragging = activeId !== null;

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
            <button
              className="px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: "#df625b" }}
            >
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
            onUndo={actions.handleUndo}
            onRedo={actions.handleRedo}
            canUndo={historyInfo.canUndo}
            canRedo={historyInfo.canRedo}
            lastAction={historyInfo.lastAction?.description}
            onExport={actions.handleExport}
            onImport={actions.handleImport}
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
        </div>
      </ErrorBoundary>
    );
  }

  // Tablet: Optimized layout with collapsible sidebars
  if (isTablet) {
    return (
      <ErrorBoundary>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
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
                  isMobile={false} // Pass tablet as desktop-like for drag behavior
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
              {showProperties &&
                selectedSection &&
                !builderState.isPreviewMode && (
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
                        y: isTablet ? 0 : "100%",
                      }}
                      animate={{
                        x: 0,
                        y: 0,
                      }}
                      exit={{
                        x: "100%",
                        y: isTablet ? 0 : "100%",
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
                            setShowProperties(false); // Close overlay after deletion
                          }}
                          isMobile={true} // Use mobile layout for the overlay
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
            </AnimatePresence>
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
        </DndContext>
      </ErrorBoundary>
    );
  }

  // Desktop: Clean 3-panel layout
  return (
    <ErrorBoundary>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
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
      </DndContext>
    </ErrorBoundary>
  );
};
