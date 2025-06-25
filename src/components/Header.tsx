import { memo } from "react";

interface HeaderProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
  isMobile?: boolean;
  isTablet?: boolean;
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarCollapsed?: boolean;
  rightSidebarCollapsed?: boolean;
  // Undo/Redo functionality
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  lastAction?: string;
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
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false,
    lastAction,
  }) => {
    const handleExport = () => {
      console.log("Export functionality coming soon");
    };

    const handleImport = () => {
      console.log("Import functionality coming soon");
    };

    return (
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30">
        {/* Left: Brand + Tablet Controls */}
        <div className="flex items-center space-x-4">
          {/* Tablet sidebar toggles */}
          {isTablet && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleLeftSidebar}
                className={`p-2 rounded-lg transition-colors ${
                  leftSidebarCollapsed
                    ? "text-blue-600 bg-blue-50"
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

          <h1
            className={`font-bold text-gray-900 ${
              isMobile ? "text-lg" : "text-xl"
            }`}
          >
            {isMobile
              ? "Builder"
              : isTablet
              ? "Website Builder"
              : "Mini Website Builder"}
          </h1>
        </div>

        {/* Center: Preview Toggle + Undo/Redo Controls */}
        <div className="flex items-center space-x-4">
          {/* Undo/Redo Controls - Only show when not in preview mode */}
          {!isPreviewMode && (onUndo || onRedo) && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-gray-50 rounded-lg">
              <button
                type="button"
                onClick={onUndo}
                disabled={!canUndo}
                className={`p-2 rounded-md transition-colors ${
                  canUndo
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title={canUndo ? `Undo: ${lastAction}` : "Nothing to undo"}
                aria-label="Undo last action"
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
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </button>

              <div className="w-px h-6 bg-gray-300" />

              <button
                type="button"
                onClick={onRedo}
                disabled={!canRedo}
                className={`p-2 rounded-md transition-colors ${
                  canRedo
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                title={canRedo ? "Redo" : "Nothing to redo"}
                aria-label="Redo last undone action"
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
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isPreviewMode
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            aria-pressed={isPreviewMode}
          >
            {isPreviewMode ? (
              <>
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>{isMobile ? "Edit" : "Edit Mode"}</span>
              </>
            ) : (
              <>
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>{isMobile ? "Preview" : "Preview"}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Actions + Tablet Controls */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleImport}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
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
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
          </button>

          {/* Tablet right sidebar toggle */}
          {isTablet && (
            <button
              onClick={onToggleRightSidebar}
              className={`p-2 rounded-lg transition-colors ${
                rightSidebarCollapsed
                  ? "text-blue-600 bg-blue-50"
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
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";
