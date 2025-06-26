import { memo } from "react";
import { motion } from "framer-motion";
import { animationPresets } from "@/utils/animations";

interface EmptyStateProps {
  isMobile?: boolean;
  isTablet?: boolean;
  collapsed?: boolean;
}

export const EmptyState = memo<EmptyStateProps>(
  ({ isMobile = false, isTablet = false, collapsed = false }) => {
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
);

EmptyState.displayName = "EmptyState";
