# AGENTS.md - Development Guidelines for Agentic Coding

## Build & Development Commands

```bash
# Start development server (port 3000)
npm run dev

# Build production bundle (TypeScript + Vite)
npm run build

# Preview production build
npm run preview

# Lint TypeScript/TSX files
npm run lint
```

**Note**: No test suite configured in this project.

## Project Structure

```
src/
├── components/    # React components (organized by feature)
│   ├── common/    # Shared UI components (Button, Card, Modal, etc.)
│   ├── lottery/   # Lottery-specific components
│   ├── layout/    # Layout components (Header, TabBar)
│   └── ...
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── constants/     # Constant values and enums
├── config/        # Configuration files
└── pages/         # Page-level components
```

## Code Style Guidelines

### Formatting (Prettier)
- **Semicolons**: No semicolons
- **Quotes**: Single quotes
- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Trailing commas**: ES5
- **Line endings**: LF

### TypeScript Configuration
- Strict mode enabled
- No unused locals/parameters
- No fallthrough cases in switch
- JSX: `react-jsx` (no need to import React)
- Path aliases: `@/*` maps to `./src/*`

### Naming Conventions
- **Components**: PascalCase (`NumberBall`, `Button`)
- **Functions/Variables**: camelCase (`calculateLuckyColor`, `lotteryType`)
- **Constants/Enums**: SCREAMING_SNAKE_CASE (`LOTTERY_CONFIGS`, `LotteryType`)
- **Interfaces/Types**: PascalCase, descriptive (`LuckyColorResult`, `LotteryConfig`)
- **Files**: PascalCase for components, camelCase for utilities/types

### Import Style
- Use named exports (not default exports)
- Group imports: external libraries → internal modules
- Use `@/*` path alias for src imports
- React imports not required (jsx-runtime)

```typescript
// External imports
import { useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom'

// Internal imports with @ alias
import { Button } from '@/components/common/Button'
import { LotteryType } from '@/types/lottery'
import { calculateLuckyColor } from '@/utils/luckyColor'
```

### Component Patterns
- Functional components with hooks
- Extract interfaces for props (extend HTML attributes when appropriate)
- Destructure props with reasonable defaults
- Use TypeScript for all props
- Event handlers: `onXxx` pattern

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  // Component logic
}
```

### Type Definitions
- Use `interface` for object shapes
- Use `type` for unions, primitives, and complex types
- Export types from `types/` directory
- Define enums for constants with string values

```typescript
export enum LotteryType {
  SHUANGSEQIU = '双色球',
  DALETOU = '大乐透'
}

export interface LotteryConfig {
  type: LotteryType
  redBalls: { min: number; max: number; count: number }
}
```

### Hooks
- Custom hooks in `hooks/` directory
- Prefixed with `use`
- Return consistent type/interface
- Use `useMemo` for expensive computations
- Dependency arrays should be complete

```typescript
export function useLotteryConfig(date?: Date): {
  lotteryType: LotteryType
  config: LotteryConfig
} {
  const targetDate = date || getLocalDateFromBeijing()
  const lotteryType = useMemo(() => getLotteryTypeByDate(targetDate), [targetDate])
  return { lotteryType, config: LOTTERY_CONFIGS[lotteryType] }
}
```

### Error Handling
- Handle errors with try/catch in async operations
- Use toast notifications for user-facing errors (via `useToast` hook)
- Log errors appropriately
- Never suppress errors silently

### State Management
- Use React hooks (useState, useContext, useReducer)
- For complex state, consider context + custom hooks
- Use localStorage via `useLocalStorage` hook for persistence

### Styling
- TailwindCSS for all styling
- Component variants via conditional classes
- Use utility classes for responsive design
- Theme colors via CSS variables/Tailwind config

### Linting Rules (ESLint)
- TypeScript ESLint recommended rules
- React Hooks recommended rules
- Unused variables: warn (prefix with `_` to ignore)
- `react-refresh/only-export-components` enforced

### PWA Specifics
- Service worker configured with auto-update
- API caching: 7 days for lottery data
- Offline-first approach
- Icons in `public/icons/` (72x72 to 512x512)

## Key Dependencies
- React 18.2
- TypeScript 5.3
- Vite 5.1 (build tool)
- TailwindCSS 3.4 (styling)
- React Router DOM 6.22 (routing)
- vite-plugin-pwa 0.19.6 (PWA)

## Development Notes
- Dev server runs on http://localhost:3000
- Build output: `dist/` directory
- API integration: 极速数据彩票开奖 API
- Chinese language UI (彩票选号助手)
- Focus: Lucky color-based lottery number selection
