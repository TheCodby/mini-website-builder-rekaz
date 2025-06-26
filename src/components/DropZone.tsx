import { memo } from "react";
import { useDroppable } from "@dnd-kit/core";

interface DropZoneProps {
  id: string;
  index: number;
  isActive: boolean;
  isOver: boolean;
  isMobile?: boolean;
}

export const DropZone = memo<DropZoneProps>(
  ({ id, index, isActive, isOver, isMobile = false }) => {
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
            ? "h-24 opacity-100"
            : isMobile
            ? "h-16 opacity-80"
            : "h-12 opacity-60"
        }`}
      >
        <div
          className={`h-full border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-200 ${
            isOver
              ? "border-blue-400 bg-blue-50 drop-zone-active"
              : "border-gray-300 bg-gray-50"
          } ${isMobile ? "touch-target" : ""}`}
        >
          <div
            className={`flex items-center space-x-2 font-medium transition-colors duration-200 ${
              isOver ? "text-blue-600" : "text-gray-500"
            } ${isMobile ? "text-sm" : "text-sm"}`}
          >
            <svg
              className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`}
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
                  ? "Release to drop here"
                  : "Drop section here"
                : `Position ${index + 1}`}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

DropZone.displayName = "DropZone";
