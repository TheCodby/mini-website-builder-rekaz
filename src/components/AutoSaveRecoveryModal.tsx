import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AutoSaveRecoveryModalProps {
  isOpen: boolean;
  lastSaved: Date;
  sectionsCount: number;
  onRecover: () => void;
  onDismiss: () => void;
}

export const AutoSaveRecoveryModal = memo<AutoSaveRecoveryModalProps>(
  ({ isOpen, lastSaved, sectionsCount, onRecover, onDismiss }) => {
    const formatDateTime = (date: Date) => {
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffHours < 1) {
        const diffMinutes = Math.floor(
          (now.getTime() - date.getTime()) / (1000 * 60)
        );
        if (diffMinutes < 1) {
          return "just now";
        }
        return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
      }

      if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
      }

      return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
              onClick={onDismiss}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Modal Content */}
              <motion.div
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <motion.svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </motion.svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Recovery Available
                      </h3>
                      <p className="text-sm text-gray-600">
                        We found previously saved work
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  <div className="space-y-4">
                    {/* Recovery Info Card */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-900 mb-1">
                            Auto-saved content found
                          </h4>
                          <div className="space-y-1 text-sm text-green-700">
                            <p className="flex items-center space-x-2">
                              <span>📅</span>
                              <span>
                                Last saved: {formatDateTime(lastSaved)}
                              </span>
                            </p>
                            <p className="flex items-center space-x-2">
                              <span>📄</span>
                              <span>
                                {sectionsCount} section
                                {sectionsCount !== 1 ? "s" : ""} ready to
                                restore
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="text-center space-y-2">
                      <p className="text-gray-600">
                        Would you like to restore your previous work? This will
                        replace any current content.
                      </p>
                      <p className="text-xs text-gray-500">
                        Don&apos;t worry - you can always start fresh if you
                        prefer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex space-x-3">
                  <motion.button
                    onClick={onDismiss}
                    className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Fresh
                  </motion.button>
                  <motion.button
                    onClick={onRecover}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    🔄 Recover Work
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    Your data is stored locally and never leaves your device
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

AutoSaveRecoveryModal.displayName = "AutoSaveRecoveryModal";
