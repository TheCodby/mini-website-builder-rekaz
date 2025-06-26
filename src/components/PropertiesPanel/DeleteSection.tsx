import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Section } from "@/types/builder";
import { modalVariants, overlayVariants } from "@/utils/animations";

interface DeleteSectionProps {
  selectedSection: Section;
  onDeleteSection: (sectionId: string) => void;
  isMobile?: boolean;
}

export const DeleteSection = memo<DeleteSectionProps>(
  ({ selectedSection, onDeleteSection, isMobile = false }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = () => {
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
      onDeleteSection(selectedSection.id);
      setShowDeleteModal(false);
    };

    const handleCancelDelete = () => {
      setShowDeleteModal(false);
    };

    return (
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
                  <strong className="capitalize">{selectedSection.type}</strong>{" "}
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
    );
  }
);

DeleteSection.displayName = "DeleteSection";
