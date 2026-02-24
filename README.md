# 🎯 Trello Clone - Next.js

A fully functional Trello-like board management application built with Next.js, TypeScript, and modern web technologies.

## 🚀 Demo

**Live Demo:** [https://firouzzadeh99.github.io/trello-clone-nextjs/](https://firouzzadeh99.github.io/trello-clone-nextjs/)

**Reference Demo:** [https://deluxe-llama-c34f7a.netlify.app](https://deluxe-llama-c34f7a.netlify.app)

## ✨ Features

### Core Functionality
- **Board Management**: View and edit board title with inline editing
- **List Management**: 
  - Create, delete, and rename lists
  - Horizontal drag & drop reordering
  - Smooth animations and transitions
- **Card Management**:
  - Create and edit cards within lists
  - Drag & drop cards between lists
  - Vertical reordering within lists
  - Modal view for card details
- **Comments System**: 
  - Add comments to cards via modal
  - View all card comments
  - Persistent comment storage
- **Data Persistence**: All data saved to localStorage
- **Responsive Design**: Fully responsive layout for desktop and mobile

## 🛠️ Tech Stack

### Core Technologies
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library with latest features
- **React DOM 19.2.3** - React rendering
- **TypeScript 5.x** - Type-safe development

### State Management & Data
- **Zustand 5.0.11** - Lightweight state management
- **localStorage** - Client-side data persistence

### UI & Interactions
- **@dnd-kit/core 6.3.1** - Modern drag & drop core
- **@dnd-kit/sortable 9.0.0** - Sortable lists functionality
- **@dnd-kit/utilities 3.2.2** - Utility helpers for dnd-kit

### Styling
- **SCSS (Sass 1.97.3)** - Advanced CSS with variables, mixins, and nesting
- **Custom Scrollbar** - Styled horizontal scrollbar with blue gradient theme

### Development Tools
- **ESLint 9.x** - Code linting with Next.js config
- **Babel React Compiler 1.0.0** - React optimization
- **TypeScript** - Static type checking

## 📁 Project Structure
```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/             # Shared components
│   │   ├── icons/              # Icon components
│   │   └── ui/                 # Reusable UI components
│   │       ├── TextInput.tsx
│   │       └── Modal.tsx
│   ├── features/               # Feature-based modules
│   │   ├── board/              # Board feature
│   │   │   ├── components/
│   │   │   │   ├── BoardContent.tsx
│   │   │   │   ├── BoardContent.scss
│   │   │   │   └── SortableListColumn.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useBoardLists.ts
│   │   │   └── types/
│   │   ├── list/               # List feature
│   │   │   ├── components/
│   │   │   │   ├── ListColumn.tsx
│   │   │   │   ├── ListColumn.scss
│   │   │   │   └── ListHeader.tsx
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   └── card/               # Card feature
│   │       ├── components/
│   │       │   ├── CardItem.tsx
│   │       │   ├── CardItem.scss
│   │       │   ├── CardModal.tsx
│   │       │   └── SortableCardItem.tsx
│   │       ├── hooks/
│   │       │   └── useCardModal.ts
│   │       └── types/
│   ├── store/                  # Zustand store
│   │   └── boardStore.ts
│   ├── styles/                 # Global styles
│   │   ├── _variables.scss     # SCSS variables
│   │   ├── _mixins.scss        # SCSS mixins
│   │   ├── _index.scss         # SCSS exports
│   │   └── globals.scss
│   └── types/                  # TypeScript types
│       ├── board.ts
└── public/                     # Static assets
```

## 🏗️ Architecture & Design Patterns

### Feature-Based Structure
- **Modular Design**: Each feature (board, list, card) is self-contained
- **Separation of Concerns**: Components, hooks, and types are separated
- **Single Responsibility**: Each file has one clear purpose
- **Colocation**: Related files grouped together

### SOLID Principles
- **Single Responsibility**: Components handle one specific task
- **Open/Closed**: Extensible without modifying existing code
- **Liskov Substitution**: Components are interchangeable
- **Interface Segregation**: Small, focused interfaces
- **Dependency Inversion**: Components depend on abstractions (hooks, store)

### State Management
- **Zustand Store**: Centralized state for boards, lists, and cards
- **Custom Hooks**: Abstracted business logic
  - `useBoardLists` - Lists with cards aggregation

### Type Safety
- **Strict TypeScript**: Full type coverage
