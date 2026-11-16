# Changelog

Every version of halt.ae Workspace, newest first. The app reads this file to fill its **Updates** screen, and every new version listed here is published as a GitHub release.

How to write an entry:

- Start it with `## [x.y.z] - YYYY-MM-DD - Short title`, then one line of summary.
- Group the changes under `### Added`, `### Changed`, `### Fixed` or `### Removed`.
- Pick the version number by how big the change is: the last number for fixes (1.0.1), the middle one for new features (1.1.0), the first one for big changes that aren't backward compatible (2.0.0).

## [1.0.1] - 2026-11-16 - Steady notes

A quick fix for notes that shook when you scrolled to the bottom.

### Fixed
- Long notes no longer shake when you scroll to the very end. The reading-progress bar could grow a hair past 100%, which made a horizontal scrollbar flicker on and off.

## [1.0.0] - 2026-11-16 - Haltspace for Windows

The first public release, now called **Haltspace**. Install it on Windows and it updates itself whenever a new version is published.

### Added
- **Windows app:** a real installer with a Start menu entry, its own window and one-click updates
- **Updates** screen: shows your version, the full version history and the roadmap, and checks GitHub for new versions
- Automatic update checks when the app opens, then every 6 hours; can be turned off in Updates
- Can be installed as an app from the web version: its own window and icon, works offline, updates itself
- Downloadable single-file version, attached to every GitHub release
- Version number in the status bar; it turns lime when an update is ready

### Changed
- New name: **Haltspace** by halt.ae
- PDFs and backups now save straight to your Downloads folder instead of opening in a new tab

### Fixed
- Home page: the status bar no longer gets cut off, the side panel no longer slides under the top bar when you scroll, and the extra gap at the top is gone
- Runs on its own outside claude.ai and saves everything in your browser on this device

## [0.9.0] - 2026-11-16 - Workspace layout

A tidier, more professional layout built around the notes.

### Added
- Icon rail on the left with labeled buttons for Home, Today, Search, Calendar, Graph, Templates, Trash, Profile and theme
- "Tell me what you want to do" command search in the title bar (`Ctrl K`)
- Status bar with save state, page counts, and the current page's word and sheet count
- Start screen with a quick-note box, START tiles, your notes, a recent files table and a side panel

### Changed
- Note toolbar groups now have labels: Undo, Clipboard, Style, Font, Paragraph, Lists, Insert, Page
- Square corners, thin borders, IBM Plex Sans and Mono everywhere
- Dotted desk behind note pages; decorative background art removed

## [0.8.0] - 2026-11-16 - halt.ae identity

### Added
- halt.ae logo, wordmark and forest-and-lime colors
- Note cards on the home screen with previews

### Changed
- Notes are the focus: less decoration, cleaner reading
- Signature color palette: amber `#b85e00`, yellow `#ffe600`, green `#00d973`, blue `#0024cc`

## [0.7.0] - 2026-11-15 - Folders, search and safe saving

### Added
- Folders and subfolders
- Global search across every note, canvas and board (`Ctrl Shift F`)
- User profile with name, avatar and accent color
- Second copy of every page saved on your device, with automatic retries
- Export and restore a full backup
- Drawings inside notes can be dragged to a new spot

### Changed
- Autosave on every change, plus a final save when you close the tab

## [0.6.0] - 2026-11-15 - Templates, frames and history

### Added
- Slash menu (`/`) for headings, lists, tables, drawings and more, plus page templates
- Live drawings inside notes, editable in place
- Frames on the canvas and a presentation mode
- Daily notes, a calendar, and table and calendar views for boards
- Trash with 30-day restore, and version history for every page
- Note pages laid out as real A4 sheets with page breaks
- Smoother scrollbars and small animations

## [0.5.0] - 2026-11-05 - Word-style toolbar and PDF

### Added
- Toolbar buttons with an icon and a name
- Headers and footers, with saved templates
- Export to PDF
- Cut, copy and paste buttons
- Pasted pictures can be resized
- Free font size on the canvas
- Paste pictures onto the canvas, resize them, and draw or type on them

### Changed
- Light theme by default, with warmer colors

## [0.4.0] - 2026-11-05 - Write like Word

### Changed
- Removed the separate read and edit modes: just click and type
- Paste rich text from other apps and keep its formatting

## [0.3.0] - 2026-11-05 - Quick connect

### Added
- Drag from any shape's edge to connect it, or to create a connected shape
- Type straight onto the canvas to make a note
- Smooth copy and paste between the canvas, notes and other apps
- Motion when things are added, moved and connected

## [0.2.0] - 2026-11-05 - Font library

### Added
- The full Google Fonts library, with search and previews, for notes and the canvas

## [0.1.0] - 2026-11-05 - First version

### Added
- Notes with formatting, checklists, tags and `[[links]]` between pages
- An infinite canvas with shapes, arrows, sticky notes and freehand drawing
- Project boards with cards and due dates
- A graph view that shows how your pages connect
