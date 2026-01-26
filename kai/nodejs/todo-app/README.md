# TODO Application

A modern, feature-rich TODO note-taking application built with React, TypeScript, and PatternFly 5.

## Features

- **Dashboard**: View statistics and quick access to overdue items
  - Total TODOs count
  - Overdue TODOs count
  - Completed today count
  - Quick create form
  - Top 5 overdue items display

- **TODO List**: Comprehensive TODO management
  - Sortable columns (Title, Target Date)
  - Filter by priority (High, Medium, Low)
  - Filter by color labels (Red, Orange, Blue, Green, Purple, Gray)
  - Show overdue items only toggle
  - Mark items as done with checkbox
  - Edit and delete functionality

- **TODO Management**:
  - Create new TODOs with optional fields
  - Edit existing TODOs
  - Delete with confirmation
  - Archive completed items
  - Color coding system
  - Priority levels
  - Tags support
  - Target date tracking

## Technology Stack

- **React 18**: UI library
- **TypeScript 5**: Type safety
- **Vite 5**: Build tool and dev server
- **React Router 6**: Client-side routing
- **PatternFly 5.2.1**: Enterprise UI component library
- **SASS**: Styling
- **Playwright**: E2E testing framework

## Project Structure

```
todo-app/
├── public/
│   └── data/
│       └── todos.json          # Initial sample data
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Dashboard.scss
│   │   ├── layout/
│   │   │   ├── AppNav.tsx
│   │   │   └── AppNav.scss
│   │   └── todos/
│   │       ├── TodoList.tsx
│   │       ├── TodoList.scss
│   │       ├── TodoModal.tsx
│   │       ├── TodoModal.scss
│   │       ├── DeleteConfirmationModal.tsx
│   │       └── DeleteConfirmationModal.scss
│   ├── types/
│   │   └── todo.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── todoStorage.ts      # localStorage + CRUD
│   │   ├── dateUtils.ts        # Date parsing/formatting
│   │   └── colorUtils.ts       # Color token mappings
│   ├── App.tsx                 # Main app with routing
│   ├── App.scss                # Global styles
│   ├── main.tsx                # Entry point
│   └── index.css               # PatternFly imports
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+ or yarn

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Testing

#### E2E Tests

The application includes comprehensive end-to-end tests using Playwright.

**Run all E2E tests:**
```bash
npm run test:e2e
```

**Run tests with UI mode (interactive):**
```bash
npm run test:e2e:ui
```

**Run tests in debug mode:**
```bash
npm run test:e2e:debug
```

**Run tests in headed mode (see browser):**
```bash
npm run test:e2e:headed
```

**Run tests for specific browser:**
```bash
npm run test:e2e:chromium
```

**View HTML test report:**
```bash
npm run test:e2e:report
```

**Test Coverage:**
- Navigation (4 tests)
- CRUD Operations (10 tests)
- Dashboard Statistics (4 tests)
- Dashboard Quick Create (3 tests)
- Dashboard Overdue List (4 tests)
- Persistence (5 tests)
- Filtering (7 tests)
- Sorting (4 tests)
- Mark as Done (3 tests)
- Modal Validation (17 tests)

**Total: 61 E2E tests** covering all critical user flows and edge cases.

## Data Management

- **Initial Load**: On first run, the app loads sample data from `public/data/todos.json`
- **Persistence**: All changes are saved to browser localStorage
- **Data Format**: TODOs are stored with the following fields:
  - `id` (string): Unique identifier
  - `title` (string, required): TODO title
  - `description` (string, optional): Detailed description
  - `targetDate` (string, optional): Target completion date (MM/DD/YYYY format)
  - `priority` (string, optional): high, medium, or low
  - `color` (string, optional): red, orange, blue, green, purple, or gray
  - `tags` (array, optional): Array of tag strings
  - `status` (string): active or archived
  - `createdAt` (string): ISO timestamp
  - `updatedAt` (string): ISO timestamp

## Usage

### Creating a TODO

1. Click "Create TODO" button in the header (opens modal)
2. OR use the "Quick Create" form on the dashboard (collapsed by default)
3. Fill in required title field
4. Optionally add: description, target date, priority, color, tags
5. Click "Create" or "Save"

### Viewing TODOs

- **Dashboard** (`/`): Shows statistics and top 5 overdue items
- **TODO List** (`/todos`): Shows all active TODOs in a sortable, filterable table

### Filtering

- Use priority dropdown to filter by High, Medium, or Low
- Use color dropdown to filter by color labels
- Toggle "Show Overdue Only" to see only overdue items
- Click "Clear" (X icon) to reset all filters

### Sorting

- Click "Title" column header to sort alphabetically
- Click "Target Date" column header to sort chronologically
- Click again to reverse sort direction

### Managing TODOs

- **Mark as Done**: Click checkbox next to TODO (archives immediately)
- **Edit**: Click pencil icon in Actions column
- **Delete**: Click trash icon in Actions column (confirmation required)

## Color Labels

The app supports the following color labels for categorizing TODOs:

- **Red**: Danger/Critical items
- **Orange**: Warning/Important items
- **Blue**: Information/Standard items
- **Green**: Success/Positive items
- **Purple**: Special/Custom items
- **Gray**: Low priority/Neutral items

## Routes

- `/` - Dashboard (landing page)
- `/todos` - TODO List (full table view)
- All other routes redirect to `/`

## Browser Support

Modern browsers with ES6+ support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is provided as-is for demonstration purposes.
