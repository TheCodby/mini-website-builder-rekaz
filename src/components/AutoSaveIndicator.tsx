import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AutoSaveState } from "@/types/builder";
import { Switch } from "@/components/ui/switch";

interface AutoSaveIndicatorProps {
  autoSaveState: AutoSaveState;
  onToggleAutoSave: (enabled: boolean) => void;
  onClearAutoSave: () => void;
  className?: string;
}

export const AutoSaveIndicator = memo<AutoSaveIndicatorProps>(
  ({ autoSaveState, onToggleAutoSave, onClearAutoSave, className = "" }) => {
    const {
      lastSaved,
      isAutoSaving,
      autoSaveEnabled,
      saveError,
      hasUnsavedChanges,
    } = autoSaveState;
    const [showPopup, setShowPopup] = useState(false);

    const getStatusInfo = () => {
      if (!autoSaveEnabled) {
        return {
          icon: "❌",
          text: "Auto-save disabled",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          triggerColor: "bg-gray-100 text-gray-600",
        };
      }

      if (saveError) {
        return {
          icon: "⚠️",
          text: `Save failed: ${saveError}`,
          color: "text-red-600",
          bgColor: "bg-red-50",
          triggerColor: "bg-red-100 text-red-600",
        };
      }

      if (isAutoSaving) {
        return {
          icon: "💾",
          text: "Saving...",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          triggerColor: "bg-blue-100 text-blue-600",
        };
      }

      if (hasUnsavedChanges) {
        return {
          icon: "⏳",
          text: "Unsaved changes",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          triggerColor: "bg-yellow-100 text-yellow-600",
        };
      }

      if (lastSaved) {
        const lastSavedDate = new Date(lastSaved);
        const now = new Date();
        const diffMinutes = Math.floor(
          (now.getTime() - lastSavedDate.getTime()) / (1000 * 60)
        );

        let timeText;
        if (diffMinutes < 1) {
          timeText = "just now";
        } else if (diffMinutes === 1) {
          timeText = "1 minute ago";
        } else if (diffMinutes < 60) {
          timeText = `${diffMinutes} minutes ago`;
        } else {
          timeText = lastSavedDate.toLocaleTimeString();
        }

        return {
          icon: "✅",
          text: `Saved ${timeText}`,
          color: "text-green-600",
          bgColor: "bg-green-50",
          triggerColor: "bg-green-100 text-green-600",
        };
      }

      return {
        icon: "📝",
        text: "Ready to save",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        triggerColor: "bg-gray-100 text-gray-600",
      };
    };

    const statusInfo = getStatusInfo();

    return (
      <div className={`relative ${className}`}>
        {/* Trigger Button */}
        <motion.button
          onClick={() => setShowPopup(true)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all duration-200 hover:scale-105 ${statusInfo.triggerColor} border border-opacity-20 border-current shadow-sm hover:shadow-md`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open auto-save settings"
        >
          <span className="text-sm">{statusInfo.icon}</span>

          {/* Spinning indicator when saving */}
          {isAutoSaving && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
            />
          )}
        </motion.button>

        {/* Beautiful Popup Modal */}
        <AnimatePresence>
          {showPopup && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-50"
                onClick={() => setShowPopup(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Popup Content */}
              <motion.div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-sm w-full mx-4">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
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
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Auto-Save Settings
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowPopup(false)}
                        className="p-1 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="px-6 py-4">
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-xl ${statusInfo.bgColor} border border-opacity-20 border-current`}
                    >
                      <div className="flex-shrink-0">
                        <span className="text-2xl">{statusInfo.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${statusInfo.color}`}>
                          {statusInfo.text}
                        </p>
                        {lastSaved && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last saved: {new Date(lastSaved).toLocaleString()}
                          </p>
                        )}
                      </div>
                      {isAutoSaving && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className={`w-5 h-5 border-2 border-current border-t-transparent rounded-full ${statusInfo.color}`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Controls Section */}
                  <div className="px-6 py-4 space-y-4">
                    {/* Auto-save Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {autoSaveEnabled ? (
                            <svg
                              className="w-6 h-6 text-green-500"
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
                          ) : (
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Auto-Save</p>
                          <p className="text-xs text-gray-500">
                            {autoSaveEnabled
                              ? "Automatically saves your work every few seconds"
                              : "Manual save only - changes won't be automatically saved"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auto-save"
                          checked={autoSaveEnabled}
                          onCheckedChange={onToggleAutoSave}
                          className="bg-white shadow-sm hover:bg-gray-50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Clear Data Button */}
                    {lastSaved && (
                      <motion.button
                        onClick={() => {
                          onClearAutoSave();
                          setShowPopup(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                        <span className="font-medium">
                          Clear Auto-Saved Data
                        </span>
                      </motion.button>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Data is saved locally in your browser
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AutoSaveIndicator.displayName = "AutoSaveIndicator";
