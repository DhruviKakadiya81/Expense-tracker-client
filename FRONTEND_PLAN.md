# 🎨 Frontend Architecture & Implementation Plan

## 1. Overview & Technology Stack
- **Framework**: Next.js 16 (Latest App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Shadcn UI
- **Icons**: Lucide React
- **Data Fetching & Cache**: TanStack Query (`@tanstack/react-query`) — used **strictly for data fetching with `useQuery`**
- **Mutations (Add / Update / Delete)**: Managed simply and cleanly using direct **Axios** async/await calls and query invalidation (`queryClient.invalidateQueries`) — **NO `useMutation`**
- **Global State Management**: **Zustand** (for Auth state, user info, active filters, and modal toggles)
- **Forms & Validation**: React Hook Form with Zod resolvers (`@hookform/resolvers/zod`)
- **Notifications**: Toast notifications (Sonner / Shadcn Toast)
- **Loading States**: Custom & Shadcn Skeleton components for all dynamic content

---

## 2. Directory Structure (`/client`)
Completely independent from the backend with its own `package.json`, environment, and dependencies.

```
client/
├── src/
│   ├── app/
│   │   ├── (auth)/                         # Authentication Route Group (Public)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                # Login Page
│   │   │   ├── register/
│   │   │   │   └── page.tsx                # Register Page
│   │   │   └── layout.tsx                  # Auth centered card layout
│   │   ├── (dashboard)/                    # Protected Route Group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx                # Dashboard: Overview, Stats, Chart, Recents
│   │   │   ├── transactions/
│   │   │   │   └── page.tsx                # Transactions Table, Filters, Search, Modals
│   │   │   ├── categories/
│   │   │   │   └── page.tsx                # Category CRUD & usage warnings
│   │   │   ├── profile/
│   │   │   │   └── page.tsx                # User Profile & Avatar Upload
│   │   │   └── layout.tsx                  # Protected Shell (Sidebar, Header, Auth Guard)
│   │   ├── layout.tsx                      # Root Layout (QueryClientProvider, Toaster)
│   │   ├── page.tsx                        # Root Redirect (checks auth -> /dashboard or /login)
│   │   └── globals.css                     # Tailwind CSS & Theme variables
│   ├── components/
│   │   ├── ui/                             # Shadcn UI primitives (Button, Dialog, Input, Table, Skeleton, Card, etc.)
│   │   ├── shared/
│   │   │   ├── sidebar.tsx                 # Navigation Sidebar
│   │   │   ├── navbar.tsx                  # Top Bar with User Avatar & Logout
│   │   │   ├── confirm-dialog.tsx          # Reusable alert modal (e.g. for deletions)
│   │   │   ├── media-preview-modal.tsx     # Fullscreen viewer for receipts and videos
│   │   │   └── page-header.tsx             # Standard page title & action button wrapper
│   │   ├── auth/
│   │   │   ├── login-view.tsx              # Client Component for Login
│   │   │   └── register-view.tsx           # Client Component for Register
│   │   ├── dashboard/
│   │   │   ├── dashboard-view.tsx          # Client Component (coordinates queries & layout)
│   │   │   ├── stats-cards.tsx             # Total Income, Expense, Balance cards
│   │   │   ├── stats-skeleton.tsx          # Skeleton loader for stat metrics
│   │   │   ├── income-expense-chart.tsx    # Visual chart (Recharts / Chart.js)
│   │   │   └── recent-transactions.tsx     # Compact list of recent transactions
│   │   ├── transactions/
│   │   │   ├── transactions-view.tsx       # Client Component (coordinates table, filters, dialogs)
│   │   │   ├── transaction-table.tsx       # Data table with sorting & actions
│   │   │   ├── transaction-filters.tsx     # Search input, Category dropdown, Date range, Type filter
│   │   │   ├── transaction-form-modal.tsx  # Add / Edit form (React Hook Form)
│   │   │   ├── transaction-skeleton.tsx    # Table skeleton loader
│   │   │   └── receipt-upload-preview.tsx  # Drag & drop / file picker with instant preview
│   │   ├── categories/
│   │   │   ├── categories-view.tsx         # Client Component (categories table & dialog)
│   │   │   ├── category-list.tsx           # Category badges & management table
│   │   │   ├── category-form-modal.tsx     # Add / Edit Category Dialog
│   │   │   └── category-skeleton.tsx       # Skeleton loader for categories
│   │   └── profile/
│   │       ├── profile-view.tsx            # Client Component (profile form & avatar upload)
│   │       ├── profile-form.tsx            # Name, Email, Phone editable form
│   │       ├── avatar-uploader.tsx         # Circular avatar preview with file upload
│   │       └── profile-skeleton.tsx        # Profile skeleton
│   ├── stores/
│   │   ├── use-auth-store.ts               # Zustand store: user, token, setAuth, logout, checkAuth
│   │   └── use-filter-store.ts             # Zustand store: search, category, type, date filters
│   ├── hooks/
│   │   ├── use-dashboard.ts                # useQuery hook for summary metrics & charts
│   │   ├── use-categories.ts               # useQuery hook for categories
│   │   └── use-transactions.ts             # useQuery hook for transactions with filters
│   ├── lib/
│   │   ├── axios.ts                        # Configured Axios instance with interceptors
│   │   ├── query-client.ts                 # React Query client initialization
│   │   └── utils.ts                        # Classnames merge (`cn`) helper
│   ├── schemas/
│   │   ├── auth.schema.ts                  # Zod validation for Login & Register forms
│   │   ├── transaction.schema.ts           # Zod validation for Add/Edit Transaction
│   │   ├── category.schema.ts              # Zod validation for Category creation/edit
│   │   └── profile.schema.ts               # Zod validation for Profile form
│   ├── services/
│   │   ├── auth.service.ts                 # Axios calls: login, register, me
│   │   ├── user.service.ts                 # Axios calls: getProfile, updateProfile, uploadAvatar
│   │   ├── category.service.ts             # Axios calls: getCategories, create, update, delete
│   │   ├── transaction.service.ts          # Axios calls: getTransactions, create, update, delete
│   │   └── dashboard.service.ts            # Axios calls: getDashboardSummary
│   └── types/
│       ├── auth.types.ts
│       ├── category.types.ts
│       ├── transaction.types.ts
│       └── dashboard.types.ts
├── public/
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── package.json
```

---

## 3. Core Modules & Implementation Details

### 3.1. Authentication & Route Protection (Zustand + Route Guard)
- **State Management**: `useAuthStore` (Zustand) with `persist` middleware storing `token` and `user`.
- **Axios Interceptor**:
  - Intercepts requests and injects `Authorization: Bearer <token>` retrieved directly from `useAuthStore.getState().token`.
  - Intercepts `401 Unauthorized` responses: executes `useAuthStore.getState().logout()` and redirects to `/login`.
- **Route Guard**:
  - Handled in `(dashboard)/layout.tsx`: Checks `isAuthenticated` from Zustand store.
  - If unauthenticated, immediately redirects to `/login`.
  - If authenticated, renders the dashboard shell (Navbar, Sidebar, and Children).

### 3.2. Data Fetching & Mutation Strategy
- **Data Fetching (`useQuery`)**:
  - Used exclusively for reading data from the backend:
    - `useQuery({ queryKey: ['dashboard-summary'], queryFn: dashboardService.getSummary })`
    - `useQuery({ queryKey: ['categories'], queryFn: categoryService.getAll })`
    - `useQuery({ queryKey: ['transactions', filters], queryFn: () => transactionService.getAll(filters) })`
- **Mutations (Add / Update / Delete) — Direct & Simple**:
  - **No `useMutation`**. Mutations are executed directly in simple `async/await` handler functions using Axios services.
  - Pattern:
    ```ts
    const handleDelete = async (id: string) => {
      try {
        setIsDeleting(true);
        await transactionService.delete(id);
        toast.success("Transaction deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete transaction");
      } finally {
        setIsDeleting(false);
      }
    };
    ```
  - This keeps the codebase lightweight, simple to follow, and directly controllable without unnecessary mutation wrappers.

### 3.3. Dashboard View (`/dashboard`)
- **Metric Cards**: Total Income, Total Expenses, and Net Balance with percentage indicators.
- **Visual Chart**: Monthly Income vs. Expenses bar/area chart using responsive SVG / Recharts.
- **Recent Transactions Widget**: Displays the latest 5 transactions with color-coded badges (`+` Green for Income, `-` Red for Expense).
- **Skeleton Loaders**: Dedicated `<StatsSkeleton />` and `<ChartSkeleton />` rendered when `isLoading` is true.

### 3.4. Transaction Management (`/transactions`)
- **Data Table**: Displays Title, Category (with color tag), Type, Amount, Date, Attachments indicator, and Actions (Edit, Delete).
- **Filter Bar**:
  - Search input with debounce (searches by title).
  - Category selector (dynamic items fetched from Category API).
  - Type toggle (`All`, `Income`, `Expense`).
  - Date Range Picker.
- **Modal Add/Edit Form** (React Hook Form + Zod):
  - Title, Amount, Type selection, Dynamic Category dropdown, Date, and Description.
  - **Receipt Image Upload**: File input with image preview modal, replace button, and remove action.
  - **Video Attachment**: Option to upload a video file or paste a video URL; includes embedded video preview.
- **Skeleton**: `<TransactionTableSkeleton />` displaying animated row placeholders while data is loading.

### 3.5. Category Management (`/categories`)
- **Category List**: Grid or table of categories with color tag, type indicator (`Income` / `Expense`), and actions.
- **Add / Edit Modal**: Simple form with Name and Type.
- **Integrity Safe Deletion**: Confirmation dialog triggered before deletion. If the backend reports active transactions, an error Toast clearly explains why deletion is blocked.

### 3.6. User Profile Management (`/profile`)
- **Profile Form**: Name, Email, Phone number with Zod schema validation.
- **Avatar Uploader**: Circular avatar preview with instant client-side preview before save, plus save to MongoDB via server upload endpoint.
- **Skeleton**: `<ProfileSkeleton />` for smooth loading states.

### 3.7. Server-Side Metadata & SEO Strategy (`generateMetadata`)
In Next.js App Router, `generateMetadata` can **only be exported from Server Components** (`page.tsx` without `'use client'`).

To achieve both **consistent full SEO metadata control** and **rich client interactivity** (TanStack Query, Zustand, React Hook Form, charts):
- **Every `page.tsx` stays a Server Component**: Every page consistently defines and exports `generateMetadata()`.
- **Client Views are rendered inside `page.tsx`**: Each page simply imports and renders a dedicated `'use client'` view component.

#### Standard Pattern with `generateMetadata` (`/dashboard/page.tsx`):
```tsx
// src/app/(dashboard)/dashboard/page.tsx (Server Component)
import { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard | Expense Tracker',
    description: 'View real-time balance, total income, expenses, and transaction analytics.',
  };
}

export default function DashboardPage() {
  return <DashboardView />;
}
```

#### Dynamic Pattern with `generateMetadata` (`/transactions/page.tsx`):
```tsx
// src/app/(dashboard)/transactions/page.tsx (Server Component)
import { Metadata } from 'next';
import { TransactionsView } from '@/components/transactions/transactions-view';

type Props = {
  searchParams: Promise<{ type?: string; category?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { type } = await searchParams;
  const filterLabel = type ? `${type.charAt(0).toUpperCase() + type.slice(1)} ` : '';
  return {
    title: `${filterLabel}Transactions | Expense Tracker`,
    description: `Track, filter, and manage your ${filterLabel.toLowerCase()}expenses and income with ease.`,
  };
}

export default function TransactionsPage() {
  return <TransactionsView />;
}
```

#### Page Metadata Mapping:
| Route | Title | Meta Description |
|---|---|---|
| `/login` | `Sign In | Expense Tracker` | Access your personal expense and budget dashboard. |
| `/register` | `Create Account | Expense Tracker` | Start tracking your personal expenses and savings today. |
| `/dashboard` | `Dashboard | Expense Tracker` | View real-time balance, total income, expenses, and transaction analytics. |
| `/transactions` | `Transactions | Expense Tracker` | Filter, search, and manage your income and expense records. |
| `/categories` | `Categories | Expense Tracker` | Organize your spending by managing custom categories. |
| `/profile` | `My Profile | Expense Tracker` | Manage your user details, email, contact info, and profile avatar. |
