# Extension Icons

This extension requires the following icon files in the icons/ folder:

- icon16.png (16x16 pixels) - Small icon for extension list
- icon48.png (48x48 pixels) - Medium icon for extension management
- icon128.png (128x128 pixels) - Large icon for Chrome Web Store

## Icon Design Guidelines

### Design Concept
- Use a productivity or focus-themed icon
- Consider symbols like: clock, timer, focus target, eye, brain, etc.
- Colors should match the extension theme (blue #3498db primary)

### Technical Requirements
- PNG format with transparency
- Square dimensions (16x16, 48x48, 128x128)
- Clean, simple design that works at small sizes
- Consistent styling across all sizes

### Suggested Icon Ideas
1. **Clock/Timer Icon**: Simple clock face with focus indicator
2. **Target/Focus Icon**: Bullseye or target symbol
3. **Shield Icon**: Protection from distractions
4. **Eye Icon**: Focused attention symbol
5. **Brain Icon**: Mental focus representation

### Tools for Creation
- Canva (online, easy to use)
- Figma (professional design tool)
- GIMP (free image editor)
- Adobe Illustrator/Photoshop (professional tools)
- Icon generators online

### Quick Creation Steps
1. Choose a simple, recognizable symbol
2. Use the primary color (#3498db) with white background
3. Ensure the icon is clear at 16x16 pixels
4. Save as PNG with transparency
5. Create all three sizes (16, 48, 128)

### Example Icon Code (SVG to PNG)
```svg
<svg width="128" height="128" viewBox="0 0 128 128">
  <circle cx="64" cy="64" r="60" fill="#3498db" stroke="#2980b9" stroke-width="4"/>
  <circle cx="64" cy="64" r="30" fill="white"/>
  <circle cx="64" cy="64" r="10" fill="#3498db"/>
</svg>
```

This creates a simple target/focus icon that represents concentration and focus.

## Installation Note
Place the created icon files in the icons/ folder before loading the extension.
