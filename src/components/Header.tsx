import { memo } from "react";

interface HeaderProps {
  isPreviewMode: boolean;
  onTogglePreview: () => void;
}

export const Header = memo<HeaderProps>(
  ({ isPreviewMode, onTogglePreview }) => {
    const handleExport = () => {
      console.log("Export functionality coming soon");
    };

    const handleImport = () => {
      console.log("Import functionality coming soon");
    };

    return (
      <header className="h-header bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">
            Mini Website Builder
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onTogglePreview}
            aria-pressed={isPreviewMode}
            aria-label={
              isPreviewMode ? "Switch to edit mode" : "Switch to preview mode"
            }
            className={`px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isPreviewMode
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isPreviewMode ? "Edit Mode" : "Preview"}
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleImport}
            aria-label="Import website configuration"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Import
          </button>
          <button
            type="button"
            onClick={handleExport}
            aria-label="Export website configuration"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Export
          </button>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";
