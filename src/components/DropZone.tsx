import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";

interface DropZoneProps {
  id: string;
  index: number;
  isActive: boolean;
  isOver: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}

export const DropZone = memo<DropZoneProps>(
  ({ id, index, isActive, isOver, isMobile = false, isTablet = false }) => {
    const { setNodeRef } = useDroppable({
      id,
      data: {
        type: "drop-zone",
        index,
      },
    });

    if (!isActive) return null;

    return (
      <div
        ref={setNodeRef}
        className={`transition-all duration-200 ease-in-out ${
          isOver
            ? "h-32 opacity-100"
            : isMobile
            ? "h-20 opacity-90"
            : isTablet
            ? "h-16 opacity-80"
            : "h-12 opacity-60"
        }`}
      >
        <div
          className={`h-full border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-200 ${
            isOver
              ? "border-primary-400 bg-primary-50 drop-zone-active shadow-md"
              : "border-gray-300 bg-gray-50"
          } ${isMobile || isTablet ? "touch-target" : ""}`}
        >
          <div
            className={`flex items-center space-x-2 font-medium transition-colors duration-200 ${
              isOver ? "text-primary-600" : "text-gray-500"
            } ${isMobile ? "text-base" : isTablet ? "text-sm" : "text-sm"}`}
          >
            <svg
              className={`${
                isMobile ? "w-6 h-6" : isTablet ? "w-5 h-5" : "w-4 h-4"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>
              {isOver
                ? isMobile
                  ? "🎯 Release to drop here"
                  : isTablet
                  ? "🎯 Release to drop here"
                  : "Drop section here"
                : `${isMobile ? "📍 " : isTablet ? "📍 " : ""}Position ${
                    index + 1
                  }`}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

DropZone.displayName = "DropZone";
