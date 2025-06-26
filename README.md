# 🎨 Mini Website Builder

A modern, responsive website builder built with Next.js 15, React 19, and TypeScript. Create beautiful websites with an intuitive drag-and-drop interface, complete with export/import functionality and comprehensive undo/redo system.

## ✨ Features

### 🎯 **Core Functionality**

- **Section Library**: Pre-built components (Hero, Header, Content, Footer) ready to use
- **Live Preview**: Real-time preview of your website as you build
- **Visual Editor**: Click-to-edit section properties with intuitive forms
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices

### 🚀 **Advanced Features**

- **Drag & Drop**: Reorder sections and drag templates from library to specific positions
- **Export/Import**: Save and load website configurations as JSON files
- **Undo/Redo**: Comprehensive history system with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Performance Optimized**: React.memo, useCallback, and efficient re-rendering
- **Accessibility**: Full ARIA support, keyboard navigation, and screen reader compatibility

### 📱 **Device Support**

- **Desktop**: Full 3-panel layout with drag-and-drop functionality
- **Tablet**: Collapsible sidebars with optimized touch interactions
- **Mobile**: Overlay panels with touch-friendly interface

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit
- **State Management**: Custom React hooks
- **Architecture**: Clean Code principles with SOLID design patterns

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheCodby/mini-website-builder-rekaz.git
   cd mini-website-builder-rekaz
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### Building Your First Website

1. **Add Sections**: Click or drag section templates from the library
2. **Customize Content**: Click on sections to edit properties in the right panel
3. **Reorder Sections**: Drag sections to reorder them
4. **Preview**: Toggle preview mode to see the final result
5. **Export**: Save your website configuration as JSON
6. **Import**: Load previously saved configurations

### Keyboard Shortcuts

- `Ctrl + Z` / `Cmd + Z`: Undo last action
- `Ctrl + Y` / `Cmd + Shift + Z`: Redo last action
- `Enter` / `Space`: Activate buttons and links
- `Tab`: Navigate between interactive elements

### Export/Import

**Export Features:**

- Download website configuration as JSON
- Include metadata (name, description, author, tags)
- Automatic filename generation with timestamps
- Complete section data preservation

**Import Options:**

- **Replace**: Replace all existing sections
- **Append**: Add to end of existing sections
- **Prepend**: Add to beginning of existing sections
- **ID Management**: Preserve or regenerate section IDs
- **Validation**: Comprehensive error checking and warnings

## 🏗️ Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── sections/          # Section components
│   │   ├── HeroSection.tsx
│   │   ├── HeaderSection.tsx
│   │   ├── ContentSection.tsx
│   │   └── FooterSection.tsx
│   ├── BuilderArea.tsx    # Main building interface
│   ├── SectionLibrary.tsx # Template library
│   ├── PropertiesPanel.tsx # Section editor
│   ├── Header.tsx         # App header
│   ├── DraggableSection.tsx # Drag wrapper
│   ├── DraggableTemplate.tsx # Draggable templates
│   ├── DropZone.tsx       # Drop targets
│   └── WebsiteBuilder.tsx # Main container
├── hooks/                 # Custom React hooks
│   ├── useBuilderState.ts # State management
│   └── useResponsive.ts   # Responsive utilities
├── types/                 # TypeScript definitions
│   └── builder.ts         # Core types
└── utils/                 # Utility functions
    └── exportImport.ts    # Export/import logic
```

### State Management

The application uses a custom state management solution built with React hooks:

- **useBuilderState**: Manages sections, selection, preview mode, and history
- **History System**: Tracks all actions for undo/redo functionality
- **Performance**: Optimized with React.memo and useCallback

### Component Architecture

- **Container Components**: Handle state and business logic
- **Presentation Components**: Focus on UI rendering
- **Custom Hooks**: Encapsulate reusable logic
- **Type Safety**: Comprehensive TypeScript coverage

## 🎨 Customization

### Adding New Section Types

1. **Create Section Component**

   ```typescript
   // src/components/sections/CustomSection.tsx
   export const CustomSection = memo<SectionProps>(
     ({ section, isSelected, isPreviewMode, onClick }) => {
       // Your section implementation
     }
   );
   ```

2. **Add to Section Types**

   ```typescript
   // src/types/builder.ts
   export type SectionType =
     | "hero"
     | "header"
     | "footer"
     | "content"
     | "custom";
   ```

3. **Update Section Renderer**

   ```typescript
   // src/components/SectionRenderer.tsx
   case "custom":
     return <CustomSection {...props} />;
   ```

4. **Add Template to Library**
   ```typescript
   // src/components/SectionLibrary.tsx
   const customTemplate: SectionTemplate = {
     id: "custom-1",
     name: "Custom Section",
     type: "custom",
     // ... template configuration
   };
   ```

### Styling Customization

The project uses Tailwind CSS 4 with design tokens:

```css
/* src/app/globals.css */
@theme {
  --sidebar-width: 20rem;
  --header-height: 4rem;
  /* Add your custom design tokens */
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add sections from library
- [ ] Edit section properties
- [ ] Drag and drop reordering
- [ ] Drag templates to specific positions
- [ ] Undo/redo operations
- [ ] Export website configuration
- [ ] Import website configuration
- [ ] Responsive behavior on different devices
- [ ] Keyboard navigation
- [ ] Preview mode functionality

### Performance Testing

- [ ] No unnecessary re-renders
- [ ] Smooth drag and drop animations
- [ ] Fast section property updates
- [ ] Efficient history management

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Deploy automatically** - Vercel will detect Next.js and configure everything
3. **Custom domain** (optional) - Add your domain in Vercel dashboard

### Other Platforms

- **Netlify**: Works with static export (`npm run build && npm run export`)
- **Railway**: Direct deployment from GitHub
- **Self-hosted**: Use `npm run build && npm start`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript strict mode
- Use React.memo for performance optimization
- Implement proper error handling
- Add comprehensive type definitions
- Follow clean code principles
- Test across different devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **@dnd-kit** for drag and drop functionality
- **Tailwind CSS** for utility-first styling
- **React Team** for the powerful UI library

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/TheCodby/mini-website-builder-rekaz/issues)
- **Discussions**: [GitHub Discussions](https://github.com/TheCodby/mini-website-builder-rekaz/discussions)
- **Email**: ahmed.m.kotby@gmail.com

---

<div align="center">
  <p>Built with ❤️ using Next.js, React, and TypeScript</p>
</div>
