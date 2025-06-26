import { memo } from "react";
import { motion } from "framer-motion";

import type { ExportMetadata, ImportOptions } from "@/types/builder";
import {
  buttonVariants,
  staggerContainer,
  staggerItem,
} from "@/utils/animations";

interface HeaderProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarCollapsed?: boolean;
  rightSidebarCollapsed?: boolean;
  hasSelectedSection?: boolean; // Track if any section is selected
  // Undo/Redo functionality
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  lastAction?: string;
  // Export/Import functionality
  onExport?: (
    metadata?: Partial<ExportMetadata>
  ) => Promise<{ success: boolean; filename?: string; error?: string }>;
  onImport?: (
    options?: ImportOptions
  ) => Promise<{ success: boolean; error?: string; warnings?: string[] }>;
}

export const Header = memo<HeaderProps>(
  ({
    isPreviewMode,
    onTogglePreview,
    isMobile = false,
    isTablet = false,
    onToggleLeftSidebar,
    onToggleRightSidebar,
    leftSidebarCollapsed = false,
    rightSidebarCollapsed = false,
    hasSelectedSection = false,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
    lastAction,
    onExport,
    onImport,
  }) => {
    const handleExport = async () => {
      if (!onExport) {
        console.log("Export functionality not available");
        return;
      }

      try {
        const result = await onExport({
          name: `Website Export ${new Date().toLocaleDateString()}`,
          description: "Exported from Mini Website Builder",
          author: "Website Builder User",
        });

        if (result.success) {
          // You could show a success toast here
          console.log(`Exported successfully: ${result.filename}`);
        } else {
          // You could show an error toast here
          console.error("Export failed:", result.error);
          alert(`Export failed: ${result.error}`);
        }
      } catch (error) {
        console.error("Export error:", error);
        alert("Export failed due to an unexpected error");
      }
    };

    const handleImport = async () => {
      if (!onImport) {
        console.log("Import functionality not available");
        return;
      }

      try {
        const result = await onImport({
          replaceExisting: true,
          preserveIds: false,
          mergeMode: "replace",
        });

        if (result.success) {
          // You could show a success toast here
          console.log("Imported successfully");
          if (result.warnings && result.warnings.length > 0) {
            console.warn("Import warnings:", result.warnings);
            alert(
              `Import successful with warnings:\n${result.warnings.join("\n")}`
            );
          } else {
            alert("Website imported successfully!");
          }
        } else {
          // You could show an error toast here
          console.error("Import failed:", result.error);
          alert(`Import failed: ${result.error}`);
        }
      } catch (error) {
        console.error("Import error:", error);
        alert("Import failed due to an unexpected error");
      }
    };

    return (
      <motion.header
        className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-30"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Left: Brand + Tablet Controls */}
        <motion.div
          className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0"
          variants={staggerItem}
        >
          {/* Tablet sidebar toggles */}
          {isTablet && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleLeftSidebar}
                className={`p-2 rounded-lg transition-colors ${
                  leftSidebarCollapsed
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
                title={
                  leftSidebarCollapsed ? "Expand Library" : "Collapse Library"
                }
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center">
            <svg
              className={`${
                isMobile
                  ? "h-8 w-auto"
                  : isTablet
                  ? "h-10 w-auto"
                  : "h-12 w-auto"
              } max-w-[120px] sm:max-w-[200px] md:max-w-[300px]`}
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 1000 328.96"
              aria-label="Rekaz Logo"
            >
              <defs>
                <linearGradient
                  id="linear-gradient"
                  x1="975.36"
                  y1="-6.5"
                  x2="759.35"
                  y2="250.01"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#f3d39f" />
                  <stop offset="1" stopColor="#f05252" />
                </linearGradient>
              </defs>
              <path
                id="Path_952"
                data-name="Path 952"
                fill="url(#linear-gradient)"
                d="m830.71,21.87c-18.58,0-37.14.7-55.71,2.11-50.14,3.67-90.13,43.32-94.23,93.43-1.92,22.79-2.45,45.67-1.61,68.53.04,1.22.19,2.43.45,3.62.86,4.58,3.12,8.77,6.47,12.01,6.25,5.62,14.6,5.8,22.5,6.61,10,.99,20,1.48,29.96,1.92,32.05,1.16,71.16,1.47,106.19.08,45.93-2.18,85.75-7.23,98.96-15.8-10.95-20.29-38.38-19.65-64.34-19.01-5.16.13-10.26.25-15.16.21-19.68.63-39.38,1.06-59.1,1.3-18.58.22-37.67,1.43-56.25-.18-24.15-2.1-40.84-22.28-38.48-46.69.16-1.55.39-3.08.71-4.6,9.02-43.52,90.43-40.75,144.62-63.79l-23.57,47.63c-71.34,7.99-99.95,12.37-115.04,30.13,6.7,6.74,19.15,7.14,27.99,7.5,12.81.62,25.76-.13,38.57-.67l111.11-4.15s28.3-1.39,42.63,15.4c7.28,9.38,11.74,20.64,12.86,32.46,1.33,22.67-15.36,42.31-35.54,50.53-19.14,7.81-40.89,11.92-60.44,14.2-20.25,2.34-40.65,3.11-61.03,2.32-25.04-.85-52.09-1.79-76.47-8.08-2.71-.69-5.37-1.53-7.99-2.5-1.34-.54-2.68-1.02-3.97-1.61-1.65-.71-3.26-1.52-4.87-2.37-10.2-5.46-17.22-15.43-18.92-26.87.47,5.05,1.35,10.06,2.64,14.96,11.07,42.25,47.77,72.8,91.33,76.02,37.09,2.82,74.34,2.82,111.42,0,50.16-3.65,90.17-43.31,94.27-93.43,2.46-31.84,2.46-63.82,0-95.66-4.1-50.12-44.11-89.78-94.27-93.43-18.58-1.41-37.15-2.11-55.71-2.11Z"
              />
              <path
                id="Path_953"
                data-name="Path 953"
                fill="#fff"
                d="m914.74,240.43c-19.17,7.82-40.9,11.91-60.44,14.22-20.26,2.32-40.67,3.09-61.05,2.32-25.02-.86-52.09-1.81-76.44-8.11-2.72-.71-5.39-1.52-8.01-2.48-1.33-.53-2.67-1.05-3.96-1.62-1.66-.73-3.27-1.52-4.85-2.36-10.93-5.84-18.16-16.81-19.21-29.16v-.18c-.63-8.25-1.11-16.5-1.44-24.74.74,5.04,3.12,9.7,6.77,13.25,6.25,5.62,14.59,5.77,22.5,6.58,9.96,1,19.98,1.48,29.94,1.96,32.04,1.14,71.13,1.43,106.17.04,45.96-2.14,85.77-7.2,98.97-15.78-13.11-24.32-49.97-18.59-79.48-18.78-19.69.62-39.4,1.05-59.12,1.29-18.59.24-37.66,1.43-56.26-.19-24.11-2.1-40.84-22.26-38.46-46.68.15-1.55.38-3.1.71-4.62,9.01-43.52,90.44-40.76,144.65-63.78l-23.6,47.63c-71.32,8.01-99.93,12.4-115.04,30.13,6.72,6.77,19.16,7.14,27.98,7.53,12.82.62,25.79-.14,38.57-.67l111.13-4.15s28.32-1.38,42.62,15.4c7.29,9.36,11.76,20.61,12.87,32.42,1.34,22.69-15.35,42.33-35.51,50.54"
              />
              <path
                id="Path_954"
                data-name="Path 954"
                d="m104.12,131.89c6.11-6.58,12.27-13.15,18.42-19.75-5.93-8.11-13.56-14.83-22.36-19.67-5.89,7.32-11.97,14.49-17.72,21.91,8.17,4.56,15.49,10.48,21.66,17.5"
              />
              <path
                id="Path_955"
                data-name="Path 955"
                d="m507.29,175.21c-1.09-11.58-5.48-22.6-12.64-31.76-2.47-2.72-5.32-5.07-8.47-6.97-9.86-6.89-21.66-8.1-33.27-8.16-9.01,0-17.97.3-26.92.6-27.4.91-54.74,2.24-82.09,3.45-12.58.54-25.28,1.27-37.86.66-8.65-.36-20.81-.73-27.4-7.38,14.76-17.42,42.83-21.72,112.82-29.58-6.17-15.61-2.42-29.34,13.25-40.65v-2.28c-52.63,18.69-123.65,18.69-131.99,58.86-.31,1.5-.54,3.01-.66,4.54-2.36,23.95,14.03,43.67,37.69,45.72,18.27,1.57,36.96.42,55.23.18,19.29-.24,38.65-.66,57.95-1.27,28.92.18,65.09-5.38,77.91,18.45-12.95,8.41-51.96,13.37-97.03,15.43-32.45,1.48-64.89.51-97.34.6-33.73.09-67.57.88-101.18-2.54-7.74-.79-15.97-.91-22.08-6.47-5.87-5.38-7.44-13.79-7.32-21.41.36-20.56,1.13-41.18.59-61.59-.49-18.75-.04-37.68-.77-56.43-9.08,11.67-16.82,24.44-27.46,34.9,13.8,26.18,13.38,54.44,14.65,81.97,1.15,24.44,9.36,48.63,31.08,60.43,21.36,10.72,43.98,13.85,67.63,14.7,27.46,1.03,54.92,1.45,82.33,1.88,28.31.42,56.92.48,84.75-4.17,15-2.39,29.69-6.45,43.8-12.1,19.78-8.11,36.17-27.34,34.84-49.6"
              />
              <path
                id="Path_956"
                data-name="Path 956"
                d="m574.82,178.07c-1.7-6.69-4.31-13.12-7.77-19.1l-8.24-14.74c-5.72,11.82-11.43,23.7-17.25,35.81,0,0,18.83,11.48,29.18,37.84,0,0-46.87,43.65-89.4,47.74h0c-.77.11-5.15.46-9.75.84v5.95c9.11-.8,18.28.43,26.85,3.62l13.94,5.66c8.18,3.24,17.27,3.32,25.51.23,10.52-3.75,19.3-11.24,24.66-21.04,6.31-10.86,10.37-22.89,11.94-35.35,2.41-17.35,4.02-32.01.33-47.44"
              />
              <path
                id="Path_957"
                data-name="Path 957"
                d="m112.94,159l-8.25-14.77c-5.72,11.82-11.43,23.7-17.25,35.81,0,0,18.84,11.48,29.19,37.84,0,0-46.88,43.65-89.4,47.74h0c-.77.12-5.15.46-9.75.84v5.95c9.1-.8,18.27.43,26.84,3.62l13.94,5.66c8.18,3.24,17.27,3.32,25.51.23,10.52-3.76,19.3-11.25,24.66-21.05,6.31-10.86,10.37-22.88,11.94-35.35,2.56-18.4,4.21-33.78-.39-50.26-1.69-5.68-4.05-11.13-7.03-16.25"
              />
            </svg>
          </div>
        </motion.div>

        {/* Center: Preview Toggle + Undo/Redo Controls */}
        <motion.div
          className={`flex items-center ${
            isMobile ? "space-x-2" : "space-x-4"
          } flex-shrink-0`}
          variants={staggerItem}
        >
          {/* Undo/Redo Controls - Hide on mobile or show minimal version */}
          {!isPreviewMode && (onUndo || onRedo) && (
            <div
              className={`flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-lg ${
                isMobile ? "hidden sm:flex" : "flex"
              }`}
            >
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                  canUndo
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title={canUndo ? `Undo: ${lastAction}` : "Nothing to undo"}
                aria-label="Undo last action"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </button>

              <div className="w-px h-4 sm:h-6 bg-gray-300" />

              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-1.5 sm:p-2 rounded-md transition-colors ${
                  canRedo
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title={canRedo ? "Redo" : "Nothing to redo"}
                aria-label="Redo last undone action"
              >
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={onTogglePreview}
            className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isPreviewMode
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={isPreviewMode}
          >
            {isPreviewMode ? (
              <>
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="text-sm sm:text-base">
                  {isMobile ? "Edit" : "Edit Mode"}
                </span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span className="text-sm sm:text-base">Preview</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Right: Actions + Tablet Controls */}
        <motion.div
          className={`flex items-center ${
            isMobile ? "space-x-1" : "space-x-3"
          } flex-shrink-0`}
          variants={staggerItem}
        >
          {/* Import/Export buttons - More compact on mobile */}
          <motion.button
            type="button"
            onClick={handleImport}
            className={`${
              isMobile
                ? "p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                : "px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-medium"
            } transition-colors`}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            title={isMobile ? "Import" : undefined}
          >
            {isMobile ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            ) : (
              "Import"
            )}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleExport}
            className={`${
              isMobile
                ? "p-2 bg-primary-500 text-white rounded-lg"
                : "px-4 py-2 bg-primary-500 text-white rounded-lg font-medium"
            } transition-colors`}
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            title={isMobile ? "Export" : undefined}
          >
            {isMobile ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            ) : (
              "Export"
            )}
          </motion.button>

          {/* Tablet right sidebar toggle - Only show when section is selected */}
          {isTablet && hasSelectedSection && !isPreviewMode && (
            <button
              onClick={onToggleRightSidebar}
              className={`p-2 rounded-lg transition-colors ${
                rightSidebarCollapsed
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title={
                rightSidebarCollapsed
                  ? "Expand Properties"
                  : "Collapse Properties"
              }
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          )}
        </motion.div>
      </motion.header>
    );
  }
);

Header.displayName = "Header";
