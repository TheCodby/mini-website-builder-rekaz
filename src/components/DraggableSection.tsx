import { memo, ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Section } from "@/types/builder";

interface DraggableSectionProps {
  section: Section;
  children: ReactNode;
  isSelected: boolean;
  isPreviewMode: boolean;
  isMobile: boolean;
  index: number;
}

export const DraggableSection = memo<DraggableSectionProps>(
  ({ section, children, isSelected, isPreviewMode, isMobile, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: section.id,
      data: {
        type: "section",
        section,
        index,
      },
      disabled: isPreviewMode, // Only disable in preview mode, allow mobile dragging
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    if (isPreviewMode) {
      return <div>{children}</div>;
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`relative group rounded-xl overflow-hidden ${
          isDragging ? "opacity-50 z-50 rotate-2 shadow-2xl scale-105" : ""
        } ${
          isSelected
            ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg"
            : "hover:shadow-md"
        } transition-all duration-200`}
      >
        {/* Drag Handle - Always visible on mobile, hover-based on desktop */}
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-4 left-4 z-10 transition-opacity duration-200 ${
            isMobile
              ? "opacity-100 cursor-grab active:cursor-grabbing"
              : `opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing ${
                  isDragging ? "opacity-100" : ""
                }`
          }`}
          aria-label={`${
            isMobile ? "Touch and hold to reorder" : "Drag to reorder"
          } ${section.type} section`}
        >
          <div
            className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-sm hover:bg-white hover:shadow-md transition-all duration-200 ${
              isMobile ? "touch-none" : ""
            }`}
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </div>
        </div>

        {/* Section Content */}
        <div className={isDragging ? "pointer-events-none" : ""}>
          {children}
        </div>

        {/* Section Number Indicator */}
        {!isSelected && (
          <div
            className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-200 ${
              isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            Section {index + 1}
          </div>
        )}

        {isSelected && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Section {index + 1} • Selected
          </div>
        )}

        {/* Mobile touch instruction overlay */}
        {isMobile && isDragging && (
          <div className="absolute inset-0 bg-blue-100/50 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Drag to reorder section
            </div>
          </div>
        )}
      </div>
    );
  }
);

DraggableSection.displayName = "DraggableSection";
