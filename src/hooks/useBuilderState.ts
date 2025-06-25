import { useState, useCallback, useMemo } from "react";
import type {
  BuilderState,
  SectionTemplate,
  Section,
  SectionProps,
  HistoryAction,
  HistoryActionType,
  HistoryableState,
  HistoryState,
} from "@/types/builder";

/**
 * Configuration constants following clean code principles
 */
const HISTORY_CONFIG = {
  MAX_HISTORY_SIZE: 50,
  DEBOUNCE_DELAY: 300, // ms for batching rapid changes
} as const;

/**
 * History management utilities
 * Following Single Responsibility Principle
 */
const createHistoryAction = (
  type: HistoryActionType,
  description: string,
  previousState: HistoryableState,
  newState: HistoryableState
): HistoryAction => ({
  id: crypto.randomUUID(),
  type,
  timestamp: Date.now(),
  description,
  previousState,
  newState,
});

const getHistoryableState = (builderState: BuilderState): HistoryableState => ({
  sections: builderState.sections,
});

export const useBuilderState = () => {
  const [builderState, setBuilderState] = useState<BuilderState>({
    sections: [],
    selectedSectionId: null,
    isPreviewMode: false,
  });

  const [historyState, setHistoryState] = useState<HistoryState>({
    actions: [],
    currentIndex: -1,
  });

  /**
   * History management functions
   */
  const addToHistory = useCallback((action: HistoryAction) => {
    setHistoryState((prev) => {
      // Remove any future history if we're not at the end (branch point)
      const newActions = prev.actions.slice(0, prev.currentIndex + 1);
      newActions.push(action);

      // Maintain history size limit to prevent memory bloat
      if (newActions.length > HISTORY_CONFIG.MAX_HISTORY_SIZE) {
        newActions.shift();
        return {
          actions: newActions,
          currentIndex: newActions.length - 1,
        };
      }

      return {
        actions: newActions,
        currentIndex: newActions.length - 1,
      };
    });
  }, []);

  const executeHistoryAction = useCallback(
    (action: HistoryAction, isUndo: boolean) => {
      const targetState = isUndo ? action.previousState : action.newState;

      setBuilderState((prev) => ({
        ...prev,
        sections: targetState.sections,
        // Preserve UI state during undo/redo
        selectedSectionId: prev.selectedSectionId,
        isPreviewMode: prev.isPreviewMode,
      }));
    },
    []
  );

  /**
   * Public API functions following Clean Code naming conventions
   */
  const handleAddSection = useCallback(
    (sectionTemplate: SectionTemplate) => {
      setBuilderState((prev) => {
        const newSection: Section = {
          id: `${sectionTemplate.type}-${Date.now()}`,
          type: sectionTemplate.type,
          props: { ...sectionTemplate.defaultProps },
          order: prev.sections.length,
        };

        const previousState = getHistoryableState(prev);
        const newState: HistoryableState = {
          sections: [...prev.sections, newSection],
        };

        // Add to history after state change
        const historyAction = createHistoryAction(
          "ADD_SECTION",
          `Added ${sectionTemplate.type} section`,
          previousState,
          newState
        );

        // Use setTimeout to ensure state update happens first
        setTimeout(() => addToHistory(historyAction), 0);

        return {
          ...prev,
          sections: newState.sections,
        };
      });
    },
    [addToHistory]
  );

  const handleSelectSection = useCallback((sectionId: string | null) => {
    // UI state changes don't go in history
    setBuilderState((prev) => ({
      ...prev,
      selectedSectionId: sectionId,
    }));
  }, []);

  const handleTogglePreview = useCallback(() => {
    // UI state changes don't go in history
    setBuilderState((prev) => ({
      ...prev,
      isPreviewMode: !prev.isPreviewMode,
    }));
  }, []);

  const handleUpdateSection = useCallback(
    (
      sectionId: string,
      props: SectionProps,
      shouldCreateHistory: boolean = true
    ) => {
      setBuilderState((prev) => {
        const previousState = getHistoryableState(prev);
        const newSections = prev.sections.map((section) =>
          section.id === sectionId ? { ...section, props } : section
        );
        const newState: HistoryableState = { sections: newSections };

        // Only create history entry if explicitly requested (for debounced updates)
        if (shouldCreateHistory) {
          const historyAction = createHistoryAction(
            "UPDATE_SECTION",
            `Updated ${
              prev.sections.find((s) => s.id === sectionId)?.type || "section"
            } properties`,
            previousState,
            newState
          );

          setTimeout(() => addToHistory(historyAction), 0);
        }

        return {
          ...prev,
          sections: newSections,
        };
      });
    },
    [addToHistory]
  );

  /**
   * Optimized update function for real-time changes (like color dragging)
   * This updates the section without creating history entries
   */
  const handleUpdateSectionOptimistic = useCallback(
    (sectionId: string, props: SectionProps) => {
      setBuilderState((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, props } : section
        ),
      }));
    },
    []
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      setBuilderState((prev) => {
        const sectionToDelete = prev.sections.find(
          (section) => section.id === sectionId
        );
        const sectionName = sectionToDelete ? sectionToDelete.type : "section";

        const previousState = getHistoryableState(prev);
        const newSections = prev.sections.filter(
          (section) => section.id !== sectionId
        );
        const newState: HistoryableState = { sections: newSections };

        const historyAction = createHistoryAction(
          "DELETE_SECTION",
          `Deleted ${sectionName} section`,
          previousState,
          newState
        );

        setTimeout(() => addToHistory(historyAction), 0);

        console.log(`Deleted ${sectionName} section successfully`);

        return {
          ...prev,
          sections: newSections,
          selectedSectionId:
            prev.selectedSectionId === sectionId
              ? null
              : prev.selectedSectionId,
        };
      });
    },
    [addToHistory]
  );

  const handleUndo = useCallback(() => {
    if (historyState.currentIndex >= 0) {
      const action = historyState.actions[historyState.currentIndex];
      executeHistoryAction(action, true);

      setHistoryState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
      }));
    }
  }, [historyState, executeHistoryAction]);

  const handleRedo = useCallback(() => {
    if (historyState.currentIndex < historyState.actions.length - 1) {
      const action = historyState.actions[historyState.currentIndex + 1];
      executeHistoryAction(action, false);

      setHistoryState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
    }
  }, [historyState, executeHistoryAction]);

  /**
   * Computed values using useMemo for performance
   */
  const historyInfo = useMemo(
    () => ({
      canUndo: historyState.currentIndex >= 0,
      canRedo: historyState.currentIndex < historyState.actions.length - 1,
      lastAction:
        historyState.currentIndex >= 0
          ? historyState.actions[historyState.currentIndex]
          : null,
      historySize: historyState.actions.length,
    }),
    [historyState]
  );

  return {
    builderState,
    historyInfo,
    actions: {
      handleAddSection,
      handleSelectSection,
      handleTogglePreview,
      handleUpdateSection,
      handleUpdateSectionOptimistic,
      handleDeleteSection,
      handleUndo,
      handleRedo,
    },
  };
};
