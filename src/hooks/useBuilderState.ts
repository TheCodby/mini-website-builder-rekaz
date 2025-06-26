import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  BuilderState,
  SectionTemplate,
  Section,
  SectionProps,
  HistoryAction,
  HistoryActionType,
  HistoryableState,
  HistoryState,
  ExportMetadata,
  ImportOptions,
} from "@/types/builder";
import {
  exportBuilderData,
  downloadJSON,
  generateFilename,
  createFileInput,
  readJSONFile,
  validateImportData,
  processImportedSections,
} from "@/utils/exportImport";
import { useAutoSave } from "./useAutoSave";

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
    showRecoveryModal: false,
    recoveryModalData: undefined,
  });

  const [historyState, setHistoryState] = useState<HistoryState>({
    actions: [],
    currentIndex: -1,
  });

  const [autoSaveRecoveryShown, setAutoSaveRecoveryShown] = useState(false);

  // Initialize auto-save hook
  const {
    autoSaveState,
    loadAutoSavedData,
    clearAutoSavedData,
    toggleAutoSave,
    hasAutoSavedData,
    getAutoSavedInfo,
  } = useAutoSave(builderState.sections);

  // Check for auto-saved data on mount
  useEffect(() => {
    if (
      hasAutoSavedData() &&
      builderState.sections.length === 0 &&
      !autoSaveRecoveryShown
    ) {
      const autoSavedInfo = getAutoSavedInfo();
      if (autoSavedInfo) {
        setBuilderState((prev) => ({
          ...prev,
          showRecoveryModal: true,
          recoveryModalData: {
            lastSaved: autoSavedInfo.lastSaved,
            sectionsCount: autoSavedInfo.sectionsCount,
          },
        }));
      }
      setAutoSaveRecoveryShown(true);
    }
  }, [
    hasAutoSavedData,
    getAutoSavedInfo,
    loadAutoSavedData,
    clearAutoSavedData,
    builderState.sections.length,
    autoSaveRecoveryShown,
  ]);

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

  const handleReorderSections = useCallback(
    (sectionIds: string[]) => {
      setBuilderState((prev) => {
        const previousState = getHistoryableState(prev);

        // Create new sections array with updated order
        const newSections = sectionIds
          .map((id, index) => {
            const section = prev.sections.find((s) => s.id === id);
            return section ? { ...section, order: index } : null;
          })
          .filter(Boolean) as Section[];

        const newState: HistoryableState = { sections: newSections };

        const historyAction = createHistoryAction(
          "REORDER_SECTIONS",
          "Reordered sections",
          previousState,
          newState
        );

        setTimeout(() => addToHistory(historyAction), 0);

        return {
          ...prev,
          sections: newSections,
        };
      });
    },
    [addToHistory]
  );

  const handleAddSectionAtPosition = useCallback(
    (sectionTemplate: SectionTemplate, position: number) => {
      setBuilderState((prev) => {
        const newSection: Section = {
          id: `${sectionTemplate.type}-${Date.now()}`,
          type: sectionTemplate.type,
          props: { ...sectionTemplate.defaultProps },
          order: position,
        };

        const previousState = getHistoryableState(prev);

        // Insert section at specific position and update order for subsequent sections
        const newSections = [...prev.sections];
        newSections.splice(position, 0, newSection);

        // Update order values for all sections
        const reorderedSections = newSections.map((section, index) => ({
          ...section,
          order: index,
        }));

        const newState: HistoryableState = { sections: reorderedSections };

        const historyAction = createHistoryAction(
          "ADD_SECTION",
          `Added ${sectionTemplate.type} section at position ${position + 1}`,
          previousState,
          newState
        );

        setTimeout(() => addToHistory(historyAction), 0);

        return {
          ...prev,
          sections: reorderedSections,
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
   * Export/Import functions
   */
  const handleExport = useCallback(
    async (metadata: Partial<ExportMetadata> = {}) => {
      try {
        const exportData = exportBuilderData(builderState.sections, metadata);
        const filename = generateFilename(exportData.metadata);
        downloadJSON(exportData, filename);

        console.log("Website exported successfully");
        return { success: true, filename };
      } catch (error) {
        console.error("Export failed:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Export failed",
        };
      }
    },
    [builderState.sections]
  );

  const handleImport = useCallback(
    async (
      options: ImportOptions = {
        replaceExisting: true,
        preserveIds: false,
        mergeMode: "replace",
      }
    ) => {
      return new Promise<{
        success: boolean;
        error?: string;
        warnings?: string[];
      }>((resolve) => {
        const input = createFileInput(async (file) => {
          try {
            const jsonData = await readJSONFile(file);
            const validation = validateImportData(jsonData);

            if (!validation.isValid) {
              resolve({
                success: false,
                error: `Invalid file format: ${validation.errors.join(", ")}`,
              });
              return;
            }

            if (!validation.data) {
              resolve({
                success: false,
                error: "No valid data found in file",
              });
              return;
            }

            // Process and apply imported sections
            const processedSections = processImportedSections(
              validation.data.sections,
              builderState.sections,
              options
            );

            // Create history entry for import
            const previousState = getHistoryableState(builderState);
            const newState: HistoryableState = { sections: processedSections };

            const historyAction = createHistoryAction(
              "ADD_SECTION", // Using ADD_SECTION as import is essentially adding sections
              `Imported ${validation.data.sections.length} sections from ${validation.data.metadata.name}`,
              previousState,
              newState
            );

            // Update builder state
            setBuilderState((prev) => ({
              ...prev,
              sections: processedSections,
              selectedSectionId: null, // Clear selection after import
            }));

            // Add to history
            setTimeout(() => addToHistory(historyAction), 0);

            console.log("Website imported successfully");
            resolve({
              success: true,
              warnings:
                validation.warnings.length > 0
                  ? validation.warnings
                  : undefined,
            });
          } catch (error) {
            resolve({
              success: false,
              error: error instanceof Error ? error.message : "Import failed",
            });
          }
        });

        document.body.appendChild(input);
        input.click();
      });
    },
    [builderState, addToHistory]
  );

  /**
   * Recovery modal handlers
   */
  const handleRecoveryAccept = useCallback(() => {
    const savedSections = loadAutoSavedData();
    if (savedSections) {
      setBuilderState((prev) => ({
        ...prev,
        sections: savedSections,
        showRecoveryModal: false,
        recoveryModalData: undefined,
      }));
      console.log("Auto-saved data recovered successfully");
    }
  }, [loadAutoSavedData]);

  const handleRecoveryDismiss = useCallback(() => {
    clearAutoSavedData();
    setBuilderState((prev) => ({
      ...prev,
      showRecoveryModal: false,
      recoveryModalData: undefined,
    }));
  }, [clearAutoSavedData]);

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
    autoSaveState,
    actions: {
      handleAddSection,
      handleSelectSection,
      handleTogglePreview,
      handleUpdateSection,
      handleUpdateSectionOptimistic,
      handleDeleteSection,
      handleReorderSections,
      handleAddSectionAtPosition,
      handleUndo,
      handleRedo,
      handleExport,
      handleImport,
      // Auto-save actions
      toggleAutoSave,
      clearAutoSavedData,
      hasAutoSavedData,
      getAutoSavedInfo,
      // Recovery modal actions
      handleRecoveryAccept,
      handleRecoveryDismiss,
    },
  };
};
