"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Section, SectionProps } from "@/types/builder";
import {
  modalVariants,
  overlayVariants,
  animationPresets,
} from "@/utils/animations";

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

export const PropertiesPanel = ({
  selectedSection,
  onUpdateSection,
  onDeleteSection,
  isMobile = false,
  isTablet = false,
  collapsed = false,
}: PropertiesPanelProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    if (selectedSection && Object.keys(pendingUpdatesRef.current).length > 0) {
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
            (selectedSection.props[property as keyof SectionProps] as string) ||
            "";
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

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSection && onDeleteSection) {
      onDeleteSection(selectedSection.id);
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (!selectedSection) {
    return (
      <motion.div
        className="h-full flex flex-col bg-white"
        {...animationPresets.fadeIn}
      >
        <div
          className={`${
            isTablet && collapsed ? "p-3" : "p-6"
          } border-b border-gray-200`}
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
            <h2 className="text-xl font-semibold text-gray-900">Properties</h2>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Select a Section
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {isMobile
                ? "Tap any section in the builder to edit its properties here."
                : "Click any section in the builder to customize its content and styling."}
            </p>
          </div>
        </div>
      </motion.div>
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
            <div className="flex items-center justify-between min-w-0">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  Properties
                </h2>
                <p className="text-sm text-gray-500 mt-1 capitalize truncate">
                  {selectedSection.type} Section
                </p>
              </div>
              <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize flex-shrink-0">
                {selectedSection.type}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Content */}
      <div
        className={`${isMobile ? "" : "flex-1 overflow-y-auto"} ${
          isTablet && collapsed ? "p-2" : "p-6"
        } space-y-8 min-w-0`}
      >
        {/* Content Section */}
        <div className="space-y-8 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate">
            Content
          </h3>

          {selectedSection.props.title !== undefined && (
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="text"
                  id="title-input"
                  value={localProps.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                  placeholder="Enter title..."
                />
                <label
                  htmlFor="title-input"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                >
                  ✨ Title
                </label>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          )}

          {selectedSection.props.subtitle !== undefined && (
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="text"
                  id="subtitle-input"
                  value={localProps.subtitle || ""}
                  onChange={(e) =>
                    handleInputChange("subtitle", e.target.value)
                  }
                  className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                  placeholder="Enter subtitle..."
                />
                <label
                  htmlFor="subtitle-input"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                >
                  📝 Subtitle
                </label>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          )}

          {selectedSection.props.description !== undefined && (
            <div className="space-y-2">
              <div className="relative group">
                <textarea
                  id="description-input"
                  value={localProps.description || ""}
                  onChange={(e) => {
                    handleInputChange("description", e.target.value);
                  }}
                  rows={4}
                  className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent resize-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                  placeholder="Enter description..."
                />
                <label
                  htmlFor="description-input"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                >
                  📄 Description
                </label>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          )}

          {/* Footer Description */}
          {selectedSection.props.footerDescription !== undefined && (
            <div className="space-y-2">
              <div className="relative group">
                <textarea
                  id="footer-description-input"
                  value={localProps.footerDescription || ""}
                  onChange={(e) => {
                    handleInputChange("footerDescription", e.target.value);
                  }}
                  rows={3}
                  className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent resize-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                  placeholder="Enter footer description..."
                />
                <label
                  htmlFor="footer-description-input"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                >
                  🏢 Footer Description
                </label>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          )}

          {/* Copyright */}
          {selectedSection.props.copyright !== undefined && (
            <div className="space-y-2">
              <div className="relative group">
                <input
                  type="text"
                  id="copyright-input"
                  value={localProps.copyright || ""}
                  onChange={(e) =>
                    handleInputChange("copyright", e.target.value)
                  }
                  className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                  placeholder="Enter copyright..."
                />
                <label
                  htmlFor="copyright-input"
                  className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                >
                  ©️ Copyright
                </label>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>
          )}

          {(selectedSection.props.buttonText !== undefined ||
            selectedSection.props.buttonUrl !== undefined) && (
            <div className="space-y-6">
              <h4 className="text-md font-medium text-gray-800 flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Button Settings
              </h4>

              <div className="space-y-6 min-w-0">
                {selectedSection.props.buttonText !== undefined && (
                  <div className="min-w-0">
                    <div className="relative group">
                      <input
                        type="text"
                        id="button-text-input"
                        value={localProps.buttonText || ""}
                        onChange={(e) =>
                          handleInputChange("buttonText", e.target.value)
                        }
                        className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300 min-w-0"
                        placeholder="Button text..."
                      />
                      <label
                        htmlFor="button-text-input"
                        className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                      >
                        🔘 Button Text
                      </label>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </div>
                )}

                {selectedSection.props.buttonUrl !== undefined && (
                  <div className="min-w-0">
                    <div className="relative group">
                      <input
                        type="url"
                        id="button-url-input"
                        value={localProps.buttonUrl || ""}
                        onChange={(e) =>
                          handleInputChange("buttonUrl", e.target.value)
                        }
                        className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300 min-w-0"
                        placeholder="https://..."
                      />
                      <label
                        htmlFor="button-url-input"
                        className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                      >
                        🔗 Button URL
                      </label>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links Section */}
        {selectedSection.props.navLinks !== undefined && (
          <div className="space-y-6 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
              Navigation Links
            </h3>

            <div className="space-y-4">
              {(localProps.navLinks || []).map((link, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 p-4 rounded-xl space-y-4 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                      Link {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = [...(localProps.navLinks || [])];
                        newLinks.splice(index, 1);
                        handleArrayUpdate("navLinks", newLinks);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        🏷️ Link Name
                      </label>
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => {
                          const newLinks = [...(localProps.navLinks || [])];
                          newLinks[index] = {
                            ...newLinks[index],
                            name: e.target.value,
                          };
                          handleArrayUpdate("navLinks", newLinks);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                        placeholder="e.g., Home, About, Services"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        🔗 Link URL
                      </label>
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => {
                          const newLinks = [...(localProps.navLinks || [])];
                          newLinks[index] = {
                            ...newLinks[index],
                            href: e.target.value,
                          };
                          handleArrayUpdate("navLinks", newLinks);
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 font-mono text-sm"
                        placeholder="e.g., /, /about, /services"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newLinks = [
                    ...(localProps.navLinks || []),
                    { name: "New Link", href: "#" },
                  ];
                  handleArrayUpdate("navLinks", newLinks);
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
              >
                ➕ Add Navigation Link
              </button>
            </div>
          </div>
        )}

        {/* Footer Links Section */}
        {selectedSection.props.footerLinks !== undefined && (
          <div className="space-y-6 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
              Footer Links
            </h3>

            <div className="space-y-6">
              {(localProps.footerLinks || []).map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className="bg-white border-2 border-gray-200 p-5 rounded-xl space-y-5 hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                      Section {sectionIndex + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newSections = [...(localProps.footerLinks || [])];
                        newSections.splice(sectionIndex, 1);
                        handleArrayUpdate("footerLinks", newSections);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      Remove Section
                    </button>
                  </div>

                  {/* Section Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      📂 Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...(localProps.footerLinks || [])];
                        newSections[sectionIndex] = {
                          ...newSections[sectionIndex],
                          title: e.target.value,
                        };
                        handleArrayUpdate("footerLinks", newSections);
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 font-medium"
                      placeholder="e.g., Company, Support, Resources"
                    />
                  </div>

                  {/* Links in this section */}
                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Links in this section
                    </h5>
                    <div className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <div
                          key={linkIndex}
                          className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">
                              Link {linkIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newSections = [
                                  ...(localProps.footerLinks || []),
                                ];
                                newSections[sectionIndex].links.splice(
                                  linkIndex,
                                  1
                                );
                                handleArrayUpdate("footerLinks", newSections);
                              }}
                              className="text-red-500 hover:text-red-700 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                🏷️ Link Name
                              </label>
                              <input
                                type="text"
                                value={link.name}
                                onChange={(e) => {
                                  const newSections = [
                                    ...(localProps.footerLinks || []),
                                  ];
                                  newSections[sectionIndex].links[linkIndex] = {
                                    ...newSections[sectionIndex].links[
                                      linkIndex
                                    ],
                                    name: e.target.value,
                                  };
                                  handleArrayUpdate("footerLinks", newSections);
                                }}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                                placeholder="e.g., About, Privacy, Terms"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                🔗 Link URL
                              </label>
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) => {
                                  const newSections = [
                                    ...(localProps.footerLinks || []),
                                  ];
                                  newSections[sectionIndex].links[linkIndex] = {
                                    ...newSections[sectionIndex].links[
                                      linkIndex
                                    ],
                                    href: e.target.value,
                                  };
                                  handleArrayUpdate("footerLinks", newSections);
                                }}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 font-mono text-sm"
                                placeholder="e.g., /about, /privacy, /terms"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newSections = [...(localProps.footerLinks || [])];
                        newSections[sectionIndex].links.push({
                          name: "New Link",
                          href: "#",
                        });
                        handleArrayUpdate("footerLinks", newSections);
                      }}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
                    >
                      ➕ Add Link to Section
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newSections = [
                    ...(localProps.footerLinks || []),
                    {
                      title: "New Section",
                      links: [{ name: "New Link", href: "#" }],
                    },
                  ];
                  handleArrayUpdate("footerLinks", newSections);
                }}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
              >
                ➕ Add Footer Section
              </button>
            </div>
          </div>
        )}

        {/* Styling Section */}
        <div className="space-y-8 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 truncate flex items-center">
            <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-primary-400 rounded-full mr-3"></span>
            Styling
          </h3>

          {selectedSection.props.backgroundColor !== undefined && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🎨 Background Color
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <input
                    type="color"
                    value={localProps.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handleColorChange("backgroundColor", e.target.value, true)
                    }
                    className="w-16 h-16 border-3 border-gray-300 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary-400 focus:border-primary-500 shadow-lg hover:shadow-xl hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/30 to-primary-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    id="bg-color-input"
                    value={localProps.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handleInputChange("backgroundColor", e.target.value)
                    }
                    className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent font-mono text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                    placeholder="#ffffff"
                  />
                  <label
                    htmlFor="bg-color-input"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                  >
                    Hex Code
                  </label>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            </div>
          )}

          {selectedSection.props.textColor !== undefined && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                ✒️ Text Color
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <input
                    type="color"
                    value={localProps.textColor || "#000000"}
                    onChange={(e) =>
                      handleColorChange("textColor", e.target.value, true)
                    }
                    className="w-16 h-16 border-3 border-gray-300 rounded-2xl cursor-pointer transition-all duration-300 hover:border-primary-400 focus:border-primary-500 shadow-lg hover:shadow-xl hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/30 to-primary-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
                <div className="flex-1 relative group">
                  <input
                    type="text"
                    id="text-color-input"
                    value={localProps.textColor || "#000000"}
                    onChange={(e) =>
                      handleInputChange("textColor", e.target.value)
                    }
                    className="peer w-full px-4 py-4 bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:bg-white placeholder-transparent font-mono text-sm transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg hover:border-primary-300"
                    placeholder="#000000"
                  />
                  <label
                    htmlFor="text-color-input"
                    className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-primary-600 transition-all duration-300 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2.5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary-600"
                  >
                    Hex Code
                  </label>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {onDeleteSection && (
        <>
          <div
            className={`p-6 border-t border-gray-200 ${
              isMobile ? "bg-white" : "bg-gray-50"
            }`}
          >
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 active:bg-red-200 transition-colors font-medium border border-red-200 flex items-center justify-center space-x-2"
              aria-label={`Delete ${selectedSection.type} section`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete Section</span>
            </button>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                onClick={handleCancelDelete}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Delete Section
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this{" "}
                    <strong className="capitalize">
                      {selectedSection?.type}
                    </strong>{" "}
                    section? This action cannot be undone.
                  </p>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelDelete}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};
