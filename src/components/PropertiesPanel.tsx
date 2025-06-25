"use client";

import { useState } from "react";
import type { Section, SectionProps } from "@/types/builder";

interface PropertiesPanelProps {
  selectedSection: Section | undefined;
  onUpdateSection: (sectionId: string, props: SectionProps) => void;
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

  const handleInputChange = (key: string, value: string) => {
    if (!selectedSection) return;
    onUpdateSection(selectedSection.id, {
      ...selectedSection.props,
      [key]: value,
    });
  };

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
      <div className="h-full flex flex-col bg-white">
        <div
          className={`${
            isTablet && collapsed ? "p-3" : "p-6"
          } border-b border-gray-200`}
        >
          {isTablet && collapsed ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
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
      </div>
    );
  }

  return (
    <div className={`${isMobile ? "" : "h-full flex flex-col"} bg-white`}>
      {/* Header - only show when not in mobile overlay */}
      {!isMobile && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Properties
              </h2>
              <p className="text-sm text-gray-500 mt-1 capitalize">
                {selectedSection.type} Section
              </p>
            </div>
            <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium capitalize">
              {selectedSection.type}
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div
        className={`${isMobile ? "" : "flex-1 overflow-y-auto"} p-6 space-y-8`}
      >
        {/* Content Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Content
          </h3>

          {selectedSection.props.title !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Title
              </label>
              <input
                type="text"
                value={selectedSection.props.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
                placeholder="Enter title..."
              />
            </div>
          )}

          {selectedSection.props.subtitle !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Subtitle
              </label>
              <input
                type="text"
                value={selectedSection.props.subtitle || ""}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
                placeholder="Enter subtitle..."
              />
            </div>
          )}

          {selectedSection.props.description !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Description
              </label>
              <textarea
                value={selectedSection.props.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none transition-colors"
                placeholder="Enter description..."
              />
            </div>
          )}

          {selectedSection.props.buttonText !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Button Text
                </label>
                <input
                  type="text"
                  value={selectedSection.props.buttonText || ""}
                  onChange={(e) =>
                    handleInputChange("buttonText", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
                  placeholder="Button text..."
                />
              </div>

              {selectedSection.props.buttonUrl !== undefined && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Button URL
                  </label>
                  <input
                    type="url"
                    value={selectedSection.props.buttonUrl || ""}
                    onChange={(e) =>
                      handleInputChange("buttonUrl", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Styling Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Styling
          </h3>

          {selectedSection.props.backgroundColor !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Background Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={selectedSection.props.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleInputChange("backgroundColor", e.target.value)
                  }
                  className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedSection.props.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleInputChange("backgroundColor", e.target.value)
                  }
                  className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 font-mono text-sm transition-colors"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          )}

          {selectedSection.props.textColor !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Text Color
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={selectedSection.props.textColor || "#000000"}
                  onChange={(e) =>
                    handleInputChange("textColor", e.target.value)
                  }
                  className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedSection.props.textColor || "#000000"}
                  onChange={(e) =>
                    handleInputChange("textColor", e.target.value)
                  }
                  className="flex-1 px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 font-mono text-sm transition-colors"
                  placeholder="#000000"
                />
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
          {showDeleteModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={handleCancelDelete}
            >
              <div
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
                onClick={(e) => e.stopPropagation()}
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
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
