# AI Rules for GestorARP Project

This document outlines the technical stack and specific guidelines for using libraries within the GestorARP project. Adhering to these rules ensures consistency, maintainability, and optimal performance of the application.

## Tech Stack Overview

*   **Frontend Framework**: React (v18.x) for building dynamic user interfaces.
*   **Language**: TypeScript for type safety and improved code quality.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for utility-first CSS styling, ensuring responsive and consistent designs.
*   **UI Components**: shadcn/ui, a collection of re-usable components built on Radix UI and styled with Tailwind CSS.
*   **Routing**: React Router DOM (v6.x) for client-side navigation.
*   **Data Fetching/State Management**: React Query for managing server state and asynchronous data operations.
*   **Animations**: Framer Motion for declarative and performant animations.
*   **Form Management**: React Hook Form combined with Zod for robust form handling and validation.
*   **Date Utilities**: `date-fns` for efficient date manipulation.

## Library Usage Rules

1.  **React**: All UI components and page logic must be implemented using React functional components and hooks.
2.  **TypeScript**: All new and modified `.tsx` files must use TypeScript. Ensure proper typing for props, state, and functions.
3.  **Tailwind CSS**:
    *   **Exclusive Styling**: Use Tailwind CSS classes for all styling. Avoid inline styles or custom CSS files (except `src/index.css` for global directives and base styles).
    *   **Responsive Design**: Always prioritize responsive design using Tailwind's utility classes (e.g., `md:`, `lg:`).
4.  **shadcn/ui**:
    *   **Component Preference**: Utilize shadcn/ui components whenever a suitable component exists for common UI elements (e.g., Button, Input, Dialog, Card).
    *   **No Direct Modification**: Do NOT modify shadcn/ui component files directly. If a component requires significant customization beyond what props allow, create a new custom component that wraps or extends the shadcn/ui component.
5.  **React Router DOM**:
    *   **Routing**: Use `BrowserRouter`, `Routes`, and `Route` for all client-side routing.
    *   **Route Definition**: Keep all primary route definitions within `src/App.tsx`.
    *   **Navigation**: Use `NavLink` for navigation links to ensure active link styling.
6.  **React Query**:
    *   **Data Fetching**: Use React Query hooks (`useQuery`, `useMutation`) for all asynchronous data fetching and updates.
    *   **Global Provider**: The `QueryClientProvider` is already set up in `src/App.tsx`.
7.  **Framer Motion**:
    *   **Animations**: Use `motion` components and `variants` for all animations and transitions to maintain a consistent animation style.
8.  **React Hook Form & Zod**:
    *   **Form Handling**: For any forms, use `react-hook-form` for state management, validation, and submission.
    *   **Validation**: Use `zod` for schema-based form validation.
9.  **`date-fns`**: Use `date-fns` for any date formatting, parsing, or manipulation tasks.
10. **File Structure**:
    *   **Pages**: Top-level views should reside in `src/pages/`.
    *   **Components**: Reusable UI components should be placed in `src/components/`.
    *   **Landing Components**: Components specific to the landing page are in `src/components/landing/`.
    *   **Hooks**: Custom React hooks should be in `src/hooks/`.
    *   **Utilities**: General utility functions (like `cn`) should be in `src/lib/utils.ts`.
11. **Toasts**: Use the `useToast` hook from `src/hooks/use-toast.ts` (which leverages `shadcn/ui`'s `toast` and `sonner`) for all user notifications.