"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import type { Section, SectionProps } from "@/types/builder";
import { animationPresets } from "@/utils/animations";
import { PropertyFormRenderer } from "./PropertyFormRenderer";
import { StylingControls } from "./StylingControls";
import { DeleteSection } from "./DeleteSection";
import { EmptyState } from "./EmptyState";

interface PropertiesPanelProps {
  selectedSection: Section | undefined;
  onUpdateSection: (
    sectionId: string,
    props: SectionProps,
    shouldCreateHistory?: boolean
  ) => void;
  onDeleteSection?: (sectionId: string) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  collapsed?: boolean;
}

export const PropertiesPanel = memo<PropertiesPanelProps>(
  ({
    selectedSection,
    onUpdateSection,
    onDeleteSection,
    isMobile = false,
    isTablet = false,
    collapsed = false,
  }) => {
    // Local state for immediate UI updates (optimistic updates)
    const [localProps, setLocalProps] = useState<SectionProps>({});
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pendingUpdatesRef = useRef<SectionProps>({});

    // High-performance color dragging state
    const colorDragStateRef = useRef({
      isDragging: false,
      dragStartValue: "",
      currentProperty: "",
      sectionElement: null as HTMLElement | null,
      originalValue: "",
    });
    const colorCommitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update local state when selected section changes
    useEffect(() => {
      if (selectedSection) {
        setLocalProps(selectedSection.props);
        pendingUpdatesRef.current = {};

        // Find the section element for direct DOM manipulation
        const sectionElement = document.querySelector(
          `[data-section-id="${selectedSection.id}"]`
        ) as HTMLElement;
        colorDragStateRef.current.sectionElement = sectionElement;
      }
    }, [selectedSection]);

    /**
     * Debounced update function that batches rapid changes
     * This prevents every keystroke from creating history entries
     */
    const debouncedUpdate = useCallback(() => {
      if (
        selectedSection &&
        Object.keys(pendingUpdatesRef.current).length > 0
      ) {
        const finalProps = {
          ...selectedSection.props,
          ...pendingUpdatesRef.current,
        };
        onUpdateSection(selectedSection.id, finalProps);
        pendingUpdatesRef.current = {};
      }
    }, [selectedSection, onUpdateSection]);

    /**
     * Ultra-high-performance color change handler
     * Uses direct DOM manipulation to avoid React re-renders entirely
     */
    const handleColorChange = useCallback(
      (property: string, value: string, isFromColorPicker: boolean = false) => {
        if (!selectedSection) return;

        // Always update local state for form inputs
        const newLocalProps = { ...localProps, [property]: value };
        setLocalProps(newLocalProps);

        // Track pending changes for final commit
        pendingUpdatesRef.current = {
          ...pendingUpdatesRef.current,
          [property]: value,
        };

        if (isFromColorPicker) {
          const dragState = colorDragStateRef.current;

          // Start drag tracking
          if (!dragState.isDragging) {
            dragState.isDragging = true;
            dragState.dragStartValue =
              (selectedSection.props[
                property as keyof SectionProps
              ] as string) || "";
            dragState.currentProperty = property;
            dragState.originalValue = dragState.dragStartValue;
          }

          // Direct DOM manipulation for instant visual feedback (ZERO React re-renders)
          if (dragState.sectionElement) {
            if (property === "backgroundColor") {
              dragState.sectionElement.style.backgroundColor = value;
            } else if (property === "textColor") {
              // Update text color for all text elements within the section
              const textElements = dragState.sectionElement.querySelectorAll(
                'h1, h2, h3, h4, h5, h6, p, span, div[style*="color"]'
              );
              textElements.forEach((el) => {
                (el as HTMLElement).style.color = value;
              });
            }
          }

          // Clear existing commit timeout
          if (colorCommitTimeoutRef.current) {
            clearTimeout(colorCommitTimeoutRef.current);
          }

          // Set timeout to commit changes when dragging stops
          colorCommitTimeoutRef.current = setTimeout(() => {
            // Dragging has stopped - commit to history
            if (dragState.isDragging) {
              dragState.isDragging = false;

              // Only create history if value actually changed
              if (dragState.originalValue !== value) {
                debouncedUpdate();
              }

              // Reset drag state
              dragState.dragStartValue = "";
              dragState.currentProperty = "";
              dragState.originalValue = "";
            }
          }, 300); // Short timeout to detect end of dragging
        } else {
          // For text input changes, use normal debouncing
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }

          debounceTimeoutRef.current = setTimeout(() => {
            debouncedUpdate();
          }, 300);
        }
      },
      [selectedSection, localProps, debouncedUpdate]
    );

    /**
     * Handle regular input changes with normal debouncing
     */
    const handleInputChange = useCallback(
      (key: string, value: string | unknown[]) => {
        if (!selectedSection) return;

        // Parse JSON strings back to objects/arrays for complex properties
        let parsedValue: unknown = value;
        if (
          typeof value === "string" &&
          (key === "navLinks" || key === "footerLinks")
        ) {
          try {
            parsedValue = JSON.parse(value);
          } catch {
            // If parsing fails, keep as string
            parsedValue = value;
          }
        }

        // Immediate UI update for responsive feel
        const newLocalProps = { ...localProps, [key]: parsedValue };
        setLocalProps(newLocalProps);

        // Track pending changes
        pendingUpdatesRef.current = {
          ...pendingUpdatesRef.current,
          [key]: parsedValue,
        };

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Normal debouncing for text inputs
        debounceTimeoutRef.current = setTimeout(() => {
          debouncedUpdate();
        }, 300);
      },
      [selectedSection, localProps, debouncedUpdate]
    );

    /**
     * Handle array property updates directly
     */
    const handleArrayUpdate = useCallback(
      (key: string, value: unknown[]) => {
        handleInputChange(key, value);
      },
      [handleInputChange]
    );

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        if (colorCommitTimeoutRef.current) {
          clearTimeout(colorCommitTimeoutRef.current);
        }
      };
    }, []);

    if (!selectedSection) {
      return (
        <EmptyState
          isMobile={isMobile}
          isTablet={isTablet}
          collapsed={collapsed}
        />
      );
    }

    return (
      <motion.div
        className={`${isMobile ? "" : "h-full flex flex-col"} bg-white`}
        {...animationPresets.slideUp}
      >
        {/* Header - only show when not in mobile overlay */}
        {!isMobile && (
          <div
            className={`${
              isTablet && collapsed ? "p-3" : "p-6"
            } border-b border-gray-200 flex-shrink-0`}
          >
            {isTablet && collapsed ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <svg
                    className="w-4 h-4 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-500 text-center">
                  Properties
                </span>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Properties
                </h2>
                <p className="text-sm text-gray-500">
                  Edit the selected {selectedSection.type} section
                </p>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div
          className={`${
            isMobile ? "" : "flex-1 overflow-y-auto"
          } space-y-8 p-6`}
        >
          {/* Property Form based on section type */}
          <PropertyFormRenderer
            selectedSection={selectedSection}
            localProps={localProps}
            onInputChange={handleInputChange}
            onArrayUpdate={handleArrayUpdate}
          />

          {/* Styling Controls */}
          <StylingControls
            selectedSection={selectedSection}
            localProps={localProps}
            onColorChange={handleColorChange}
            onInputChange={handleInputChange}
          />
        </div>

        {/* Delete Section */}
        {onDeleteSection && (
          <DeleteSection
            selectedSection={selectedSection}
            onDeleteSection={onDeleteSection}
            isMobile={isMobile}
          />
        )}
      </motion.div>
    );
  }
);

PropertiesPanel.displayName = "PropertiesPanel";
