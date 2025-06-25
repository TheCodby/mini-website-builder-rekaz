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

export type SectionWithoutOrder = Omit<Section, "order">;
export type PartialSectionProps = Partial<SectionProps>;
export type SectionUpdate = Pick<Section, "id"> & {
  props: Partial<SectionProps>;
};
