import { useState, useEffect, useCallback, useRef } from "react";
import type { Section, AutoSaveState } from "@/types/builder";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  hasAutoSaveData,
  getAutoSaveInfo,
  clearAutoSave,
  createDebouncedSave,
} from "@/utils/autoSave";

export interface UseAutoSaveOptions {
  enabled?: boolean;
  debounceDelay?: number;
}

export interface UseAutoSaveReturn {
  autoSaveState: AutoSaveState;
  loadAutoSavedData: () => Section[] | null;
  clearAutoSavedData: () => void;
  toggleAutoSave: (enabled: boolean) => void;
  hasAutoSavedData: () => boolean;
  getAutoSavedInfo: () => { lastSaved: Date; sectionsCount: number } | null;
}

export const useAutoSave = (
  sections: Section[],
  options: UseAutoSaveOptions = {}
): UseAutoSaveReturn => {
  const { enabled = true } = options;

  const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
    lastSaved: null,
    isAutoSaving: false,
    autoSaveEnabled: enabled,
    saveError: null,
    hasUnsavedChanges: false,
  });

  const lastSavedSectionsRef = useRef<string>("");
  const debouncedSaveRef = useRef<((sections: Section[]) => void) | null>(null);

  // Initialize debounced save function
  useEffect(() => {
    const saveFn = async (sectionsToSave: Section[]) => {
      if (!autoSaveState.autoSaveEnabled) return;

      setAutoSaveState((prev) => ({
        ...prev,
        isAutoSaving: true,
        saveError: null,
      }));

      try {
        await saveToLocalStorage(sectionsToSave);
        const now = Date.now();

        setAutoSaveState((prev) => ({
          ...prev,
          lastSaved: now,
          isAutoSaving: false,
          hasUnsavedChanges: false,
          saveError: null,
        }));

        // Update the last saved sections reference
        lastSavedSectionsRef.current = JSON.stringify(sectionsToSave);

        console.log("Auto-save completed successfully");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Auto-save failed";

        setAutoSaveState((prev) => ({
          ...prev,
          isAutoSaving: false,
          saveError: errorMessage,
        }));

        console.error("Auto-save failed:", error);
      }
    };

    debouncedSaveRef.current = createDebouncedSave(saveFn);
  }, [autoSaveState.autoSaveEnabled]);

  // Auto-save sections when they change
  useEffect(() => {
    if (!autoSaveState.autoSaveEnabled || sections.length === 0) return;

    const currentSectionsString = JSON.stringify(sections);

    // Check if sections have actually changed
    if (currentSectionsString === lastSavedSectionsRef.current) return;

    // Mark as having unsaved changes
    setAutoSaveState((prev) => ({ ...prev, hasUnsavedChanges: true }));

    // Trigger debounced save
    if (debouncedSaveRef.current) {
      debouncedSaveRef.current(sections);
    }
  }, [sections, autoSaveState.autoSaveEnabled]);

  // Initialize last saved timestamp on mount
  useEffect(() => {
    const autoSaveInfo = getAutoSaveInfo();
    if (autoSaveInfo) {
      setAutoSaveState((prev) => ({
        ...prev,
        lastSaved: autoSaveInfo.lastSaved.getTime(),
      }));
    }
  }, []);

  const loadAutoSavedData = useCallback((): Section[] | null => {
    try {
      const savedSections = loadFromLocalStorage();
      if (savedSections) {
        // Update the reference to prevent immediate re-save
        lastSavedSectionsRef.current = JSON.stringify(savedSections);
        setAutoSaveState((prev) => ({ ...prev, hasUnsavedChanges: false }));
      }
      return savedSections;
    } catch (error) {
      console.error("Failed to load auto-saved data:", error);
      return null;
    }
  }, []);

  const clearAutoSavedData = useCallback(() => {
    try {
      clearAutoSave();
      lastSavedSectionsRef.current = "";
      setAutoSaveState((prev) => ({
        ...prev,
        lastSaved: null,
        hasUnsavedChanges: false,
        saveError: null,
      }));
      console.log("Auto-saved data cleared");
    } catch (error) {
      console.error("Failed to clear auto-saved data:", error);
    }
  }, []);

  const toggleAutoSave = useCallback((enabled: boolean) => {
    setAutoSaveState((prev) => ({
      ...prev,
      autoSaveEnabled: enabled,
      saveError: enabled ? null : prev.saveError, // Clear error when enabling
    }));

    if (enabled) {
      console.log("Auto-save enabled");
    } else {
      console.log("Auto-save disabled");
    }
  }, []);

  const hasAutoSavedData = useCallback((): boolean => {
    return hasAutoSaveData();
  }, []);

  const getAutoSavedInfo = useCallback(() => {
    return getAutoSaveInfo();
  }, []);

  return {
    autoSaveState,
    loadAutoSavedData,
    clearAutoSavedData,
    toggleAutoSave,
    hasAutoSavedData,
    getAutoSavedInfo,
  };
};
