import type { Section } from "@/types/builder";

interface BuilderAreaProps {
  sections: Section[];
  selectedSectionId: string | null;
  isPreviewMode: boolean;
  onSelectSection: (sectionId: string | null) => void;
}

export const BuilderArea = ({
  sections,
  selectedSectionId,
  isPreviewMode,
  onSelectSection,
}: BuilderAreaProps) => {
  if (sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 max-w-md">
          <div className="text-6xl mb-6">🎨</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Start Building Your Website
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Add sections from the library on the left to start creating your
            website. Click on any section template to add it to your page.
          </p>
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <span>💡</span>
            <span>
              Pro tip: Use the preview mode to see how your site looks
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="p-8">
        <div className="text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">
            Builder Area (Coming Soon)
          </h3>
          <p className="text-sm">
            This will show your website sections when you add them.
          </p>
          <div className="mt-4 text-xs text-gray-400">
            Sections added: {sections.length}
          </div>
        </div>
      </div>
    </div>
  );
};
