import { memo } from "react";
import type { FooterLinkSection, NavLink } from "@/types/builder";

interface FooterLinkEditorProps {
  footerLinks: FooterLinkSection[];
  onChange: (footerLinks: FooterLinkSection[]) => void;
}

export const FooterLinkEditor = memo<FooterLinkEditorProps>(
  ({ footerLinks, onChange }) => {
    const handleSectionChange = (
      sectionIndex: number,
      field: keyof FooterLinkSection,
      value: string
    ) => {
      const newSections = [...footerLinks];
      if (field === "title") {
        newSections[sectionIndex] = {
          ...newSections[sectionIndex],
          title: value,
        };
      }
      onChange(newSections);
    };

    const handleLinkChange = (
      sectionIndex: number,
      linkIndex: number,
      field: keyof NavLink,
      value: string
    ) => {
      const newSections = [...footerLinks];
      newSections[sectionIndex].links[linkIndex] = {
        ...newSections[sectionIndex].links[linkIndex],
        [field]: value,
      };
      onChange(newSections);
    };

    const handleAddSection = () => {
      onChange([
        ...footerLinks,
        {
          title: "New Section",
          links: [{ name: "New Link", href: "#" }],
        },
      ]);
    };

    const handleRemoveSection = (sectionIndex: number) => {
      const newSections = footerLinks.filter((_, i) => i !== sectionIndex);
      onChange(newSections);
    };

    const handleAddLink = (sectionIndex: number) => {
      const newSections = [...footerLinks];
      newSections[sectionIndex].links.push({ name: "New Link", href: "#" });
      onChange(newSections);
    };

    const handleRemoveLink = (sectionIndex: number, linkIndex: number) => {
      const newSections = [...footerLinks];
      newSections[sectionIndex].links = newSections[sectionIndex].links.filter(
        (_, i) => i !== linkIndex
      );
      onChange(newSections);
    };

    return (
      <div className="space-y-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          🔗 Footer Link Sections
        </label>

        <div className="space-y-6">
          {footerLinks.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl p-4 space-y-4 hover:border-primary-300 transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Section {sectionIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSection(sectionIndex)}
                  className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                  aria-label={`Remove section ${sectionIndex + 1}`}
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

              <input
                type="text"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) =>
                  handleSectionChange(sectionIndex, "title", e.target.value)
                }
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 font-medium"
              />

              <div className="space-y-3">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Links
                </span>
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="bg-gray-50 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Link {linkIndex + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveLink(sectionIndex, linkIndex)
                        }
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                        aria-label={`Remove link ${linkIndex + 1}`}
                      >
                        <svg
                          className="w-3 h-3"
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
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Link Name"
                        value={link.name}
                        onChange={(e) =>
                          handleLinkChange(
                            sectionIndex,
                            linkIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Link URL"
                        value={link.href}
                        onChange={(e) =>
                          handleLinkChange(
                            sectionIndex,
                            linkIndex,
                            "href",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 font-mono text-sm"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddLink(sectionIndex)}
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 text-sm"
                >
                  + Add Link
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddSection}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
        >
          ➕ Add Footer Section
        </button>
      </div>
    );
  }
);

FooterLinkEditor.displayName = "FooterLinkEditor";
