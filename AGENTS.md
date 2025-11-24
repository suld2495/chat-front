# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React 19 + TypeScript + Vite chat application with a custom design system built on Tailwind CSS 4.

**Tech Stack:**
- React 19.2.0 with React DOM
- TypeScript 5.9.3 (strict mode enabled)
- Vite 7.2.4 (build tool with HMR)
- Tailwind CSS 4.1.17 (utility-first CSS framework)
- ESLint 9.39.1 with TypeScript plugin

## Development Commands

```bash
# Development server with HMR
pnpm dev

# Type-check and build for production
pnpm build

# Lint all files
pnpm lint

# Preview production build
pnpm preview
```

## Path Aliases

The project uses `@/` as an alias for `./src/`:

```tsx
import { Button } from '@/components/ui/Button/Button'
import { cn } from '@/lib/utils'
```

Configured in both `vite.config.ts` and `tsconfig.app.json`.

## Design System Architecture

This project has a **comprehensive design system** documented in `guides/DESIGN_SYSTEM_GUIDE.md`. **CRITICAL: Always reference and follow the design system when creating or modifying UI components.**

### ⚠️ MANDATORY DESIGN SYSTEM USAGE

**All components MUST use the design system components from `src/components/ui/` when creating or modifying UI elements.** This is a strict requirement except when implementing components that don't exist in the design system.

- ✅ **DO**: Compose new features using existing Button, Input, Typography, Toast, Toggle, IconButton components
- ✅ **DO**: Extend existing components with composition or wrapper components
- ❌ **DON'T**: Create custom buttons, inputs, or text elements when design system components exist
- ❌ **DON'T**: Use raw HTML elements (`<button>`, `<input>`, `<h1>`, etc.) for UI - use design system components instead

**Example:**
```tsx
// ❌ WRONG - Creating custom button
<button className="bg-blue-600 text-white px-4 py-2">Click me</button>

// ✅ CORRECT - Using design system Button
import { Button } from '@/components/ui/Button/Button'
<Button variant="primary" size="md">Click me</Button>

// ❌ WRONG - Custom heading
<h1 className="text-4xl font-bold">Title</h1>

// ✅ CORRECT - Using Typography component
import { Typography } from '@/components/ui/Typography/Typography'
<Typography variant="title">Title</Typography>
```

### Design System Principles

1. **3-Layer Token Structure:**
   - Tailwind Raw (base colors, spacing) → Semantic Tokens (brand, action, surface) → Component Tokens

2. **Token Encapsulation:**
   - Tokens are defined in `src/styles/theme/semantic.css`
   - Components use Tailwind utilities that map to semantic tokens
   - External code uses component props, never raw tokens

3. **Semantic Token Categories:**
   - **Action Colors**: `action-primary`, `action-secondary`, `action-destructive`, `action-ghost`
   - **Content Colors**: `heading`, `body`, `muted`, `disabled`, `link`, `inverse`
   - **Surface Colors**: `surface`, `surface-raised`, `surface-sunken`, `hover`, `overlay`
   - **Border Colors**: `border-default`, `border-hover`, `border-focus`, `border-disabled`
   - **State Colors**: `success`, `error`, `warning`, `info`

4. **Dark Mode Support:**
   - Custom variant: `@custom-variant dark (&:where(.dark, .dark *))`
   - Toggle by adding/removing `.dark` class on `document.documentElement`
   - Dark mode tokens defined in `semantic.css` under `.dark` selector

### Existing UI Components

Located in `src/components/ui/`:

- **Button** (`Button/Button.tsx`):
  - Sizes: `sm` (32px), `md` (40px), `lg` (48px)
  - Variants: `primary`, `secondary`, `ghost`, `outline`, `danger`
  - Props: `size`, `variant`, `fullWidth`, `disabled`

- **Input** (`Input/Input.tsx`):
  - Sizes: `xs`, `sm`, `md`, `lg`
  - Variants: `outlined`, `filled`, `underlined`, `ghost`
  - States: `error`, `success`, `disabled`
  - Props: `size`, `variant`, `error`, `success`, `fullWidth`, `label`, `helperText`

- **Typography** (`Typography/Typography.tsx`):
  - Variants: `display`, `hero`, `title`, `subtitle`, `body`, `caption`, `label`
  - Supports size override and HTML tag customization

- **Toast** (`Toast/Toast.tsx`): Notification component
- **Toggle** (`Toggle/Toggle.tsx`): Toggle switch component
- **IconButton** (`IconButton/IconButton.tsx`): Button for icon-only actions

### 🚨 CRITICAL: UI Folder Usage Rules

**The `src/components/ui/` folder is EXCLUSIVELY for design system components.**

- ✅ **DO**: Add components to `ui/` ONLY when explicitly requested to create a design system component
- ✅ **DO**: Place domain/business components in appropriate domain folders (e.g., `components/chat/`, `components/auth/`)
- ❌ **DON'T**: Place domain-specific or business logic components in `ui/` folder
- ❌ **DON'T**: Create components in `ui/` unless the user explicitly asks for a design system component

**Examples:**
```tsx
// ✅ CORRECT - Design system component
src/components/ui/Button/Button.tsx

// ✅ CORRECT - Domain-specific component
src/components/chat/BottomTabs/BottomTabs.tsx
src/components/auth/LoginForm/LoginForm.tsx

// ❌ WRONG - Business component in ui folder
src/components/ui/BottomTabs/BottomTabs.tsx  // This is chat-specific!
src/components/ui/LoginForm/LoginForm.tsx    // This is domain-specific!
```

**Rule of thumb:** If the component is specific to a feature or domain (chat, auth, dashboard, etc.), it does NOT belong in `ui/`. Only generic, reusable design system components belong in `ui/`.

### Creating New Components

**IMPORTANT:** When creating or modifying components:

1. **MANDATORY: Respect UI folder boundaries** - Never add domain/business components to `src/components/ui/`. This folder is strictly for design system components.
2. **MANDATORY: Use existing design system components** - All UI elements must use components from `src/components/ui/` (Button, Input, Typography, etc.). Only create new low-level components if the design system doesn't provide the needed functionality.
3. **Check existing design system first** - Before creating any UI element, verify if a design system component exists
4. **Use semantic tokens** - Reference `src/styles/theme/semantic.css` for available tokens
5. **Follow component patterns** - Match the structure of existing components (Button, Input, Typography)
6. **Use the `cn()` utility** - Import from `@/lib/utils` for merging Tailwind classes
7. **Support dark mode** - Use semantic tokens that have dark mode variants defined

Example component structure:
```tsx
import { cn } from '@/lib/utils'

interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'special'
  size?: 'sm' | 'md' | 'lg'
}

export const Component = ({ variant = 'default', size = 'md', className, ...props }: ComponentProps) => {
  const variantClasses = {
    default: "bg-surface text-body",
    special: "bg-action-primary text-inverse",
  }

  return (
    <div
      className={cn(
        "base-classes",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
```

## File Structure

```
src/
├── components/
│   ├── ui/              # Design system components ONLY
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Typography/
│   │   ├── Toast/
│   │   ├── Toggle/
│   │   └── IconButton/
│   └── chat/            # Chat domain components
│       ├── ChatWidget/
│       └── BottomTabs/
├── lib/
│   └── utils.ts         # cn() utility for class merging
├── styles/
│   ├── index.css        # Entry point (imports Tailwind + tokens)
│   └── theme/
│       └── semantic.css # Semantic color tokens + dark mode
├── assets/              # Static assets
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## TypeScript Configuration

- **Strict mode enabled** with additional checks:
  - `noUnusedLocals`, `noUnusedParameters`
  - `noFallthroughCasesInSwitch`
  - `noUncheckedSideEffectImports`
- **Module resolution**: `bundler` mode for Vite
- **JSX**: `react-jsx` (React 19 automatic runtime)

## Styling Guidelines

1. **Use Tailwind utilities** that map to semantic tokens (e.g., `bg-action-primary`, `text-body`)
2. **Never use arbitrary values** like `bg-[#3B82F6]` - use semantic tokens instead
3. **Use the `cn()` utility** from `@/lib/utils` to merge classes and handle conditionals
4. **Follow spacing conventions**: Tailwind's default spacing scale (1-12, plus larger increments)
5. **Responsive design**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)

## Code Quality Standards

- Components should extend appropriate HTML element props (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`)
- Use TypeScript interfaces for component props
- Provide sensible defaults for optional props
- Support `className` override for customization
- Use proper semantic HTML elements
- Ensure accessibility (ARIA attributes where needed)

## Design System Integration Checklist

When working on UI tasks:

- [ ] **MANDATORY**: Verify design system components (Button, Input, Typography, etc.) are used - do NOT create custom UI elements
- [ ] Check if an existing component can be reused or extended
- [ ] Review `guides/DESIGN_SYSTEM_GUIDE.md` for token usage and patterns
- [ ] Use semantic tokens from `src/styles/theme/semantic.css`
- [ ] Ensure component works in both light and dark modes
- [ ] Follow the established component structure and prop patterns
- [ ] Use the `cn()` utility for class composition
- [ ] Test component with different size/variant combinations
