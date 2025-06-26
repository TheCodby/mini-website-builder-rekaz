import { memo } from "react";
import type { NavLink } from "@/types/builder";

interface LinkArrayEditorProps {
  label: string;
  links: NavLink[];
  onChange: (links: NavLink[]) => void;
  addButtonText?: string;
}

export const LinkArrayEditor = memo<LinkArrayEditorProps>(
  ({ label, links, onChange, addButtonText = "Add Link" }) => {
    const handleLinkChange = (
      index: number,
      field: keyof NavLink,
      value: string
    ) => {
      const newLinks = [...links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      onChange(newLinks);
    };

    const handleAddLink = () => {
      onChange([...links, { name: "New Link", href: "#" }]);
    };

    const handleRemoveLink = (index: number) => {
      const newLinks = links.filter((_, i) => i !== index);
      onChange(newLinks);
    };

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>

        <div className="space-y-4">
          {links.map((link, index) => (
            <div
              key={index}
              className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 space-y-3 hover:border-primary-300 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Link {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(index)}
                  className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  aria-label={`Remove link ${index + 1}`}
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Link Name"
                  value={link.name}
                  onChange={(e) =>
                    handleLinkChange(index, "name", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                />
                <input
                  type="text"
                  placeholder="Link URL"
                  value={link.href}
                  onChange={(e) =>
                    handleLinkChange(index, "href", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddLink}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
        >
          ➕ {addButtonText}
        </button>
      </div>
    );
  }
);

LinkArrayEditor.displayName = "LinkArrayEditor";
