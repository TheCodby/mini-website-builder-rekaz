import type { Section, ExportData } from "@/types/builder";

export interface AutoSaveState {
  lastSaved: number;
  isAutoSaving: boolean;
  autoSaveEnabled: boolean;
  saveError: string | null;
}

export interface AutoSaveData {
  sections: Section[];
  timestamp: number;
  version: string;
  metadata: {
    name: string;
    description: string;
    url?: string;
  };
}

const AUTO_SAVE_KEY = "mini-website-builder-autosave";
const AUTO_SAVE_VERSION = "1.0.0";
const AUTO_SAVE_DEBOUNCE_DELAY = 2000; // 2 seconds

/**
 * Save sections to localStorage with error handling
 */
export const saveToLocalStorage = async (
  sections: Section[]
): Promise<void> => {
  try {
    const autoSaveData: AutoSaveData = {
      sections,
      timestamp: Date.now(),
      version: AUTO_SAVE_VERSION,
      metadata: {
        name: "Auto-saved Website",
        description: "Automatically saved website builder project",
      },
    };

    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData));
  } catch (error) {
    console.error("Auto-save failed:", error);
    throw new Error("Failed to save to localStorage");
  }
};

/**
 * Load sections from localStorage with validation
 */
export const loadFromLocalStorage = (): Section[] | null => {
  try {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData) as AutoSaveData;

    // Validate data structure
    if (!parsedData.sections || !Array.isArray(parsedData.sections)) {
      console.warn("Invalid auto-save data structure");
      return null;
    }

    // Check if data is too old (older than 30 days)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    if (parsedData.timestamp < thirtyDaysAgo) {
      console.log("Auto-save data is too old, ignoring");
      clearAutoSave();
      return null;
    }

    return parsedData.sections;
  } catch (error) {
    console.error("Failed to load auto-save data:", error);
    clearAutoSave(); // Clear corrupted data
    return null;
  }
};

/**
 * Check if auto-save data exists
 */
export const hasAutoSaveData = (): boolean => {
  try {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    return savedData !== null;
  } catch {
    return false;
  }
};

/**
 * Get auto-save metadata
 */
export const getAutoSaveInfo = (): {
  lastSaved: Date;
  sectionsCount: number;
} | null => {
  try {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData) as AutoSaveData;
    return {
      lastSaved: new Date(parsedData.timestamp),
      sectionsCount: parsedData.sections.length,
    };
  } catch {
    return null;
  }
};

/**
 * Clear auto-save data
 */
export const clearAutoSave = (): void => {
  try {
    localStorage.removeItem(AUTO_SAVE_KEY);
  } catch (error) {
    console.error("Failed to clear auto-save data:", error);
  }
};

/**
 * Debounced save function
 */
export const createDebouncedSave = (
  saveFn: (sections: Section[]) => Promise<void>
): ((sections: Section[]) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;

  return (sections: Section[]) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      try {
        await saveFn(sections);
      } catch (error) {
        console.error("Debounced save failed:", error);
      }
    }, AUTO_SAVE_DEBOUNCE_DELAY);
  };
};

/**
 * Export auto-save data in standard format
 */
export const exportAutoSaveData = (): ExportData | null => {
  try {
    const savedData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!savedData) return null;

    const parsedData = JSON.parse(savedData) as AutoSaveData;

    return {
      sections: parsedData.sections,
      metadata: {
        name: parsedData.metadata.name,
        description: parsedData.metadata.description,
        version: parsedData.version,
        createdAt: new Date(parsedData.timestamp).toISOString(),
        updatedAt: new Date(parsedData.timestamp).toISOString(),
        url: parsedData.metadata.url,
      },
    };
  } catch {
    return null;
  }
};
