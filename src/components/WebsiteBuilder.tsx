"use client";

import { useState, useEffect } from "react";
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
  closestCenter,
} from "@dnd-kit/core";
import { ErrorBoundary } from "./ErrorBoundary";
import { AutoSaveRecoveryModal } from "./AutoSaveRecoveryModal";
import { useBuilderState } from "@/hooks/useBuilderState";
import { useResponsive } from "@/hooks/useResponsive";
import {
  MobileLayout,
  TabletLayout,
  DesktopLayout,
  SSRFallbackLayout,
} from "./layouts";
import type { SectionTemplate } from "@/types/builder";

export const WebsiteBuilder = () => {
  const { builderState, historyInfo, autoSaveState, actions } =
    useBuilderState();
  const { isMobile, isTablet, isHydrated } = useResponsive();

  // Drag and drop state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Configure drag sensors with optimized touch support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: isMobile ? 5 : 8, // Shorter distance on mobile for better responsiveness
      },
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: isMobile ? 100 : 250, // Much shorter delay on mobile for better responsiveness
        tolerance: isMobile ? 15 : 8, // Higher tolerance on mobile for easier dragging
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
    ? builderState.sections.find((s) => s.id === activeId) || null
    : null;
  const isDragging = activeId !== null;

  // Progressive enhancement: start with SSR-optimized layout
  if (!isHydrated) {
    return (
      <ErrorBoundary>
        <SSRFallbackLayout />
      </ErrorBoundary>
    );
  }

  // Common layout props
  const layoutProps = {
    builderState,
    historyInfo,
    autoSaveState,
    actions,
    activeId,
    overId,
    isDragging,
    activeSection,
  };

  // Render appropriate layout based on device
  const renderLayout = () => {
    if (isMobile) {
      return <MobileLayout {...layoutProps} />;
    }

    if (isTablet) {
      return <TabletLayout {...layoutProps} />;
    }

    return <DesktopLayout {...layoutProps} />;
  };

  return (
    <ErrorBoundary>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {renderLayout()}
      </DndContext>

      {/* Recovery Modal */}
      <AutoSaveRecoveryModal
        isOpen={builderState.showRecoveryModal || false}
        lastSaved={builderState.recoveryModalData?.lastSaved || new Date()}
        sectionsCount={builderState.recoveryModalData?.sectionsCount || 0}
        onRecover={actions.handleRecoveryAccept}
        onDismiss={actions.handleRecoveryDismiss}
      />
    </ErrorBoundary>
  );
};
