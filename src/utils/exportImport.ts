import type {
  Section,
  ExportData,
  ExportMetadata,
  ImportValidationResult,
  ImportOptions,
} from "@/types/builder";

/**
 * Export/Import utility functions for website builder
 * Following clean code principles with proper error handling
 */

const CURRENT_EXPORT_VERSION = "1.0.0";

/**
 * Export builder state to JSON format
 */
export const exportBuilderData = (
  sections: Section[],
  metadata: Partial<ExportMetadata> = {}
): ExportData => {
  const now = new Date().toISOString();
  const defaultMetadata: ExportMetadata = {
    name: metadata.name || `Website Export ${new Date().toLocaleDateString()}`,
    description: metadata.description || "Exported website configuration",
    author: metadata.author || "Website Builder User",
    tags: metadata.tags || ["website", "builder"],
    version: CURRENT_EXPORT_VERSION,
    createdAt: metadata.createdAt || now,
    updatedAt: now,
    url: metadata.url,
  };

  return {
    sections: sections.map((section) => ({
      ...section,
      // Ensure clean data export
      id: section.id,
      type: section.type,
      props: { ...section.props },
      order: section.order,
    })),
    metadata: { ...defaultMetadata, ...metadata },
  };
};

/**
 * Download JSON data as a file
 */
export const downloadJSON = (data: ExportData, filename?: string): void => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `website-export-${Date.now()}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download JSON:", error);
    throw new Error("Failed to download export file");
  }
};

/**
 * Validate imported JSON data
 */
export const validateImportData = (
  jsonData: unknown
): ImportValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Basic type checking
    if (!jsonData || typeof jsonData !== "object") {
      errors.push("Invalid JSON format");
      return { isValid: false, errors, warnings };
    }

    const data = jsonData as Record<string, unknown>;

    // Check required fields
    if (!data.version || typeof data.version !== "string") {
      errors.push("Missing or invalid version field");
    }

    if (!data.timestamp || typeof data.timestamp !== "number") {
      errors.push("Missing or invalid timestamp field");
    }

    if (!data.metadata || typeof data.metadata !== "object") {
      errors.push("Missing or invalid metadata field");
    }

    if (!data.sections || !Array.isArray(data.sections)) {
      errors.push("Missing or invalid sections field");
    }

    // Version compatibility check
    if (data.version && data.version !== CURRENT_EXPORT_VERSION) {
      warnings.push(
        `Version mismatch: expected ${CURRENT_EXPORT_VERSION}, got ${data.version}`
      );
    }

    // Validate sections
    if (Array.isArray(data.sections)) {
      data.sections.forEach((section, index) => {
        if (!section || typeof section !== "object") {
          errors.push(`Section ${index + 1}: Invalid section format`);
          return;
        }

        const sec = section as Record<string, unknown>;

        if (!sec.id || typeof sec.id !== "string") {
          errors.push(`Section ${index + 1}: Missing or invalid id`);
        }

        if (!sec.type || typeof sec.type !== "string") {
          errors.push(`Section ${index + 1}: Missing or invalid type`);
        }

        if (!sec.props || typeof sec.props !== "object") {
          errors.push(`Section ${index + 1}: Missing or invalid props`);
        }

        if (typeof sec.order !== "number") {
          errors.push(`Section ${index + 1}: Missing or invalid order`);
        }
      });
    }

    // Validate metadata
    if (data.metadata && typeof data.metadata === "object") {
      const meta = data.metadata as Record<string, unknown>;

      if (!meta.name || typeof meta.name !== "string") {
        warnings.push("Missing or invalid metadata name");
      }

      if (!meta.builderVersion || typeof meta.builderVersion !== "string") {
        warnings.push("Missing builder version in metadata");
      }
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      errors,
      warnings,
      data: isValid ? (data as unknown as ExportData) : undefined,
    };
  } catch (error) {
    errors.push(
      `JSON parsing error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return { isValid: false, errors, warnings };
  }
};

/**
 * Process imported sections with options
 */
export const processImportedSections = (
  importedSections: Section[],
  existingSections: Section[],
  options: ImportOptions
): Section[] => {
  let processedSections = [...importedSections];

  // Generate new IDs if not preserving them
  if (!options.preserveIds) {
    processedSections = processedSections.map((section) => ({
      ...section,
      id: `${section.type}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    }));
  }

  // Handle merge modes
  switch (options.mergeMode) {
    case "replace":
      return processedSections.map((section, index) => ({
        ...section,
        order: index,
      }));

    case "append":
      return [
        ...existingSections,
        ...processedSections.map((section, index) => ({
          ...section,
          order: existingSections.length + index,
        })),
      ];

    case "prepend":
      return [
        ...processedSections.map((section, index) => ({
          ...section,
          order: index,
        })),
        ...existingSections.map((section, index) => ({
          ...section,
          order: processedSections.length + index,
        })),
      ];

    default:
      return processedSections;
  }
};

/**
 * Create a file input element for importing
 */
export const createFileInput = (
  onFileSelected: (file: File) => void,
  accept: string = ".json"
): HTMLInputElement => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.style.display = "none";

  input.addEventListener("change", (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
    // Clean up
    document.body.removeChild(input);
  });

  return input;
};

/**
 * Read and parse JSON file
 */
export const readJSONFile = (file: File): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const jsonData = JSON.parse(content);
        resolve(jsonData);
      } catch (error) {
        reject(
          new Error(
            `Failed to parse JSON: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

/**
 * Generate a safe filename from metadata
 */
export const generateFilename = (metadata: ExportMetadata): string => {
  const safeName = metadata.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const timestamp = new Date().toISOString().split("T")[0];
  return `${safeName}-${timestamp}.json`;
};
