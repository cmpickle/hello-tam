# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tamagui + Solito + Next.js + Expo monorepo starter. It's a cross-platform app that shares UI components and business logic between native (Expo) and web (Next.js) platforms.

## Architecture

### Monorepo Structure
- `apps/expo/` - Native React Native app using Expo
- `apps/next/` - Next.js web app
- `packages/app/` - Shared app logic and features
- `packages/ui/` - Custom UI components using Tamagui
- `packages/config/` - Tamagui configuration

### Key Architectural Patterns
- **Solito** for cross-platform navigation between Expo and Next.js
- **Tamagui** for universal UI components and styling
- **Feature-based organization** in `packages/app/features/` (avoid `screens` folder)
- **Shared providers** in `packages/app/provider/` with platform-specific implementations

## Development Commands

### Running the apps
```bash
yarn web          # Next.js dev server
yarn native       # Expo dev server
yarn ios          # Run on iOS simulator
yarn android      # Run on Android emulator
```

### Build commands
```bash
yarn build            # Build all packages
yarn web:prod         # Build Next.js for production
yarn web:prod:serve   # Serve production Next.js build
```

### Testing and linting
```bash
yarn test         # Run tests with Vitest
yarn test:watch   # Run tests in watch mode
biome check       # Run Biome linter/formatter
```

## Dependencies

### Adding dependencies
- **Pure JS dependencies**: Add to `packages/app/` for cross-platform use
- **Native dependencies**: Add to `apps/expo/` only
- **Web-only dependencies**: Add to `apps/next/`

### Dependency management
- Uses Yarn workspaces with version resolutions for React/React Native
- Tamagui packages are managed centrally with upgrade commands:
  - `yarn upgrade:tamagui` - latest stable
  - `yarn upgrade:tamagui:canary` - canary builds

## Code Standards

### Formatting (Biome)
- 2-space indentation
- Single quotes for JS, double quotes for JSX
- 100-character line width
- Trailing commas in ES5 style
- Semicolons only when needed

### Linting rules
- `noConsoleLog: error` - remove console.log statements
- `useImportType: error` - use type imports when possible
- Most strict rules are disabled for rapid development

## Platform Considerations

### Router switching
The app supports both App Router and Pages Router for Next.js. To switch from App to Pages router, follow the instructions in the README.

### Navigation
- Use Solito's `Link` component for cross-platform navigation
- Native navigation handled by Expo Router
- Web navigation handled by Next.js routing

### Styling
- Tamagui provides universal styling across platforms
- Platform-specific styles use `.web.tsx` extensions
- Safe area handling is abstracted in `packages/app/provider/safe-area/`