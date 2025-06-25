import type { Section, SectionProps } from "@/types/builder";

interface PropertiesPanelProps {
  selectedSection: Section | undefined;
  onUpdateSection: (sectionId: string, props: SectionProps) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export const PropertiesPanel = ({
  selectedSection,
  onUpdateSection,
  onDeleteSection,
}: PropertiesPanelProps) => {
  if (!selectedSection) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">🎨</div>
            <p className="text-sm">Select a section to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (key: string, value: string) => {
    onUpdateSection(selectedSection.id, {
      ...selectedSection.props,
      [key]: value,
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <p className="text-sm text-gray-500 mt-1 capitalize">
          {selectedSection.type} Section
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedSection.props.title !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={selectedSection.props.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Enter title..."
            />
          </div>
        )}

        {selectedSection.props.subtitle !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={selectedSection.props.subtitle || ""}
              onChange={(e) => handleInputChange("subtitle", e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Enter subtitle..."
            />
          </div>
        )}

        {selectedSection.props.description !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={selectedSection.props.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 resize-none"
              placeholder="Enter description..."
            />
          </div>
        )}

        {selectedSection.props.buttonText !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={selectedSection.props.buttonText || ""}
              onChange={(e) => handleInputChange("buttonText", e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="Enter button text..."
            />
          </div>
        )}

        {selectedSection.props.buttonUrl !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button URL
            </label>
            <input
              type="url"
              value={selectedSection.props.buttonUrl || ""}
              onChange={(e) => handleInputChange("buttonUrl", e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              placeholder="https://example.com"
            />
          </div>
        )}

        <div className="space-y-3">
          {selectedSection.props.backgroundColor !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={selectedSection.props.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleInputChange("backgroundColor", e.target.value)
                  }
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedSection.props.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    handleInputChange("backgroundColor", e.target.value)
                  }
                  className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          )}

          {selectedSection.props.textColor !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={selectedSection.props.textColor || "#000000"}
                  onChange={(e) =>
                    handleInputChange("textColor", e.target.value)
                  }
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedSection.props.textColor || "#000000"}
                  onChange={(e) =>
                    handleInputChange("textColor", e.target.value)
                  }
                  className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {onDeleteSection && (
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => onDeleteSection(selectedSection.id)}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
          >
            Delete Section
          </button>
        </div>
      )}
    </div>
  );
};
