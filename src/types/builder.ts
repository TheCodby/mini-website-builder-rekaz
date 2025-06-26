/**
 * Core types for the website builder application
 */

export interface Section {
  id: string;
  type: SectionType;
  props: SectionProps;
  order: number;
}

export type SectionType =
  | "hero"
  | "header"
  | "footer"
  | "content"
  | "gallery"
  | "contact"
  | "testimonial";

export interface SectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  content?: string;
  images?: string[];
}

export interface BuilderState {
  sections: Section[];
  selectedSectionId: string | null;
  isPreviewMode: boolean;
}

export interface SectionTemplate {
  id: string;
  name: string;
  type: SectionType;
  description: string;
  defaultProps: SectionProps;
  preview: string; // svg or image path
}

/**
 * Undo/Redo System Types
 * Following Command Pattern for clean separation of concerns
 */
export type HistoryActionType =
  | "ADD_SECTION"
  | "UPDATE_SECTION"
  | "DELETE_SECTION"
  | "REORDER_SECTIONS";

export interface HistoryAction {
  readonly id: string;
  readonly type: HistoryActionType;
  readonly timestamp: number;
  readonly description: string;
  readonly previousState: HistoryableState;
  readonly newState: HistoryableState;
}

/**
 * Only content that affects the actual website should be in history
 * UI state like selectedSectionId and isPreviewMode are excluded
 */
export interface HistoryableState {
  readonly sections: Section[];
}

export interface HistoryState {
  readonly actions: HistoryAction[];
  readonly currentIndex: number;
}

/**
 * Export/Import System Types
 * For saving and loading website configurations
 */
export interface ExportData {
  readonly version: string;
  readonly timestamp: number;
  readonly metadata: ExportMetadata;
  readonly sections: Section[];
}

export interface ExportMetadata {
  readonly name: string;
  readonly description?: string;
  readonly author?: string;
  readonly tags?: string[];
  readonly builderVersion: string;
}

export interface ImportValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly data?: ExportData;
}

export interface ImportOptions {
  readonly replaceExisting: boolean;
  readonly preserveIds: boolean;
  readonly mergeMode: "replace" | "append" | "prepend";
}

export type SectionWithoutOrder = Omit<Section, "order">;
export type PartialSectionProps = Partial<SectionProps>;
export type SectionUpdate = Pick<Section, "id"> & {
  props: Partial<SectionProps>;
};
