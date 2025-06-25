import { useState, useCallback } from "react";
import type {
  BuilderState,
  SectionTemplate,
  Section,
  SectionProps,
} from "@/types/builder";

export const useBuilderState = () => {
  const [builderState, setBuilderState] = useState<BuilderState>({
    sections: [],
    selectedSectionId: null,
    isPreviewMode: false,
  });

  const handleAddSection = useCallback((sectionTemplate: SectionTemplate) => {
    setBuilderState((prev) => {
      const newSection: Section = {
        id: `${sectionTemplate.type}-${Date.now()}`,
        type: sectionTemplate.type,
        props: { ...sectionTemplate.defaultProps },
        order: prev.sections.length,
      };

      return {
        ...prev,
        sections: [...prev.sections, newSection],
      };
    });
  }, []);

  const handleSelectSection = useCallback((sectionId: string | null) => {
    setBuilderState((prev) => ({
      ...prev,
      selectedSectionId: sectionId,
    }));
  }, []);

  const handleTogglePreview = useCallback(() => {
    setBuilderState((prev) => ({
      ...prev,
      isPreviewMode: !prev.isPreviewMode,
    }));
  }, []);

  const handleUpdateSection = useCallback(
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

  const handleDeleteSection = useCallback((sectionId: string) => {
    setBuilderState((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
      selectedSectionId:
        prev.selectedSectionId === sectionId ? null : prev.selectedSectionId,
    }));
  }, []);

  return {
    builderState,
    actions: {
      handleAddSection,
      handleSelectSection,
      handleTogglePreview,
      handleUpdateSection,
      handleDeleteSection,
    },
  };
};
