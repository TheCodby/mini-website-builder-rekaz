import { memo, ReactNode, useState } from "react";
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
    const [touchStartTime, setTouchStartTime] = useState<number>(0);

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: template.id,
      data: {
        type: "template",
        template,
      },
      disabled: false, // Enable dragging on all devices
    });

    const handleTouchStart = () => {
      setTouchStartTime(Date.now());
    };

    const handleTouchEnd = () => {
      const touchDuration = Date.now() - touchStartTime;
      // If it's a quick tap (less than 200ms) and we're not dragging, add the section
      if (touchDuration < 200 && !isDragging && isMobile) {
        onAddSection(template);
      }
    };

    const handleClick = () => {
      // Only trigger click-to-add if we're not currently dragging
      if (!isDragging) {
        onAddSection(template);
      }
    };

    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`w-full bg-white border-2 border-gray-200 rounded-xl p-4 text-left transition-all duration-200 group ${
          isDragging
            ? "opacity-50 rotate-1 scale-105 z-50 shadow-2xl border-blue-300"
            : "hover:border-blue-300 hover:shadow-lg cursor-pointer"
        } ${
          isMobile
            ? "cursor-pointer touch-none"
            : "cursor-grab active:cursor-grabbing"
        }`}
        aria-label={`${
          isMobile ? "Tap to add or hold to drag" : "Drag or click to add"
        } ${template.name}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onAddSection(template);
          }
        }}
      >
        {children}

        {/* Drag indicator overlay for mobile */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-100/50 border-2 border-blue-400 border-dashed rounded-xl flex items-center justify-center">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {isMobile ? "Drop to add section" : "Drop to add section"}
            </div>
          </div>
        )}

        {/* Mobile usage hint */}
        {isMobile && !isDragging && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Tap or hold & drag
          </div>
        )}
      </div>
    );
  }
);

DraggableTemplate.displayName = "DraggableTemplate";
