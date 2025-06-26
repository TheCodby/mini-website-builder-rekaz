import { memo } from "react";

export const SSRFallbackLayout = memo(() => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Simple header for SSR */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold text-gray-900">
          Mini Website Builder
        </h1>
        <button
          className="px-4 py-2 text-white rounded-lg"
          style={{ backgroundColor: "#df625b" }}
        >
          Preview
        </button>
      </header>

      {/* Simple 3-column layout for desktop */}
      <div className="flex-1 flex">
        <aside className="w-80 bg-white border-r border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Section Library</h2>
            <div className="space-y-2">
              <div className="p-4 border border-gray-200 rounded-lg">
                🎯 Hero Section
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                📄 Header Section
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                📝 Content Section
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                🔗 Footer Section
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-white">
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Start Building</h3>
              <p>Add sections from the library to create your website</p>
            </div>
          </div>
        </main>

        <aside className="w-80 bg-white border-l border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Properties</h2>
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-4">🎨</div>
              <p>Select a section to edit its properties</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
});

SSRFallbackLayout.displayName = "SSRFallbackLayout";
