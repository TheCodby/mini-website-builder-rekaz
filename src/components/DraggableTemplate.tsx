import { memo, ReactNode } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { SectionTemplate } from "@/types/builder";

interface DraggableTemplateProps {
  template: SectionTemplate;
  children: ReactNode;
  isMobile: boolean;
  onAddSection: (template: SectionTemplate) => void;
}

export const DraggableTemplate = memo<DraggableTemplateProps>(
  ({ template, children, isMobile, onAddSection }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: template.id,
      data: {
        type: "template",
        template,
      },
      disabled: isMobile,
    });

    const handleClick = () => {
      if (isMobile || !isDragging) {
        onAddSection(template);
      }
    };

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        className={`w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left transition-all duration-200 group ${
          isDragging
            ? "opacity-50 rotate-1 scale-105 z-50 shadow-2xl border-blue-300"
            : "hover:border-blue-300 hover:shadow-lg cursor-pointer"
        } ${
          isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
        }`}
        aria-label={`${isMobile ? "Add" : "Drag to add"} ${template.name}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onAddSection(template);
          }
        }}
      >
        {children}

        {/* Drag indicator overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-100/50 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Drop to add section
            </div>
          </div>
        )}
      </div>
    );
  }
);

DraggableTemplate.displayName = "DraggableTemplate";
