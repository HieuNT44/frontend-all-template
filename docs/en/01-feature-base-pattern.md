# Feature-Driven Architecture for Next.js / React.js: AI-Friendly, Maintainable, and Scalable Code Organization

## Introduction

This article shares the folder architecture for NextJS applications that our team has adopted to solve accumulated issues over years of development.

If you're working on a NextJS project that's gradually expanding, with an unstable team size and struggling with code organization, we hope this article will be helpful.

> **Note:** This article focuses on folder architecture and code organization, without diving deep into State Management or specific libraries.

---

## Table of Contents

1. [Project Context](#project-context)
2. [Technology Stack](#technology-stack)
3. [Problems We Encountered](#problems-we-encountered)
4. [Why Choose Feature-Based Pattern?](#why-choose-feature-based-pattern)
5. [Detailed Architecture](#detailed-architecture)
   - [Overall Structure](#-overall-structure)
   - [Directory Details](#directory-details)
6. [Golden Rules (MUST FOLLOW)](#golden-rules-must-follow)
7. [Code Example: Feature "Post List"](#code-example-feature-post-list)
8. [AI-Friendly Best Practices](#ai-friendly-best-practices)
9. [Responsive Design: PC vs SP variants](#responsive-design-pc-vs-sp-variants)
10. [Testing Strategy](#testing-strategy)
11. [Important Considerations](#important-considerations)
12. [Results After Implementation](#results-after-implementation)
13. [Drawbacks and Trade-offs](#drawbacks-and-trade-offs)
14. [Checklist for Implementing New Features](#checklist-for-implementing-new-features)
15. [Conclusion](#conclusion)

---

## Project Context

Our project is an **outsourcing system for multiple clients** with the following characteristics:

- **Scale:** 80+ screens, 800+ files
- **Team Characteristics:** Outsourcing team with frequently changing personnel
- **Requirements:** Must comply with company templates and strict acceptance processes
- **New Goal:** Optimize for working effectively with AI Coding Assistant (Cursor AI)

When the project first started, everything was compact and easy to manage. But after 4 years of continuous development, we faced a "mountain of technical debt" that needed to be resolved.

---

## Technology Stack

The project uses the following technologies and libraries:

### Core Framework

- **Next.js 15.5.4** - React framework with App Router and Turbopack
- **React 19.1.0** - UI library
- **TypeScript 5.9.3** - Type safety

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **SASS 1.93.2** - CSS preprocessor
- **Shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Unstyled, accessible component primitives

### State Management & Data Fetching

- **TanStack Query (React Query) 5.90.2** - Server state management
- **Zustand 5.0.8** - Client state management
- **Axios 1.12.2** - HTTP client

### Forms

- **React Hook Form 7.63.0** - Form state management

### Code Quality Management

- **ESLint 9.36.0** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Lefthook 1.11.1** - Git hooks manager
- **Conventional Commits** - Commit message convention
- **Knip** - Find unused files, dependencies and exports

### Testing & Documentation

- **Vitest 3.2.4** - Unit testing framework
- **Storybook 9.1.10** - Component documentation and testing
- **Playwright 1.55.1** - E2E testing

---

## Problems We Encountered

### 1. **Inconsistent Code Between Developers**

Some typical examples:

- Developer A places API calls in components
- Developer B creates separate services
- Developer C uses custom hooks
- Developer D mixes all three approaches

**Consequence:** When fixing bugs or adding features, we had to spend time understanding each person's "way of doing things."

### 2. **"Giant" Components**

Some component files contained everything:

- UI rendering
- Business logic
- API calls
- State management
- Validation logic

A single component could reach **3000-5000 lines of code**. Fixing a small part was like playing **Jenga** - "pull one block, the whole building collapses" 🏚️

### 3. **Difficult Onboarding**

When a new developer joins:

- Takes 2-3 weeks to get familiar with the codebase
- Doesn't know where to place code
- Copy-pastes old code without understanding why it was done that way
- Creates more inconsistency

### 4. **Messy Dependencies**

```typescript
// Component A imports Component B
// Component B imports Component A
import { PostItem } from "@/features/post/components/PostItem";
import { UserCard } from "@/features/user/components/UserCard";

// 🔥 Circular dependency hell
```

### 5. **Testing and Review Difficulties**

- Don't know where to write tests
- Code review takes a long time because you have to read and understand the entire flow
- Refactoring one place affects everywhere

---

## Why Choose Feature-Based Pattern?

After many meetings and experiments, we decided to choose **Feature-Based Pattern** because:

### ✅ **Reason 1: Clear Separation**

Each feature is an independent "mini-application." Modifying feature A doesn't affect feature B.

### ✅ **Reason 2: Parallel Development**

The team can work in parallel on multiple features without code conflicts.

### ✅ **Reason 3: Easy Onboarding**

New developers only need to understand the structure of 1 feature, then apply it to all.

### ✅ **Reason 4: Good Scalability**

Easy to split into monorepo or micro-frontends later.

### ✅ **Reason 5: AI-Friendly**

Consistent structure helps AI (GitHub Copilot, Cursor, Claude) provide more accurate code assistance.

---

## Detailed Architecture

### 📁 Overall Structure

**Principle:** Each page (route) in `app/` corresponds to 1 feature in `features/`

```
src/
├── app/                    # Next.js App Router (Routing layer)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx     # Page: /login
│   ├── dashboard/
│   │   └── page.tsx         # Page: /dashboard
│   └── settings/
│       └── profile/
│           └── page.tsx      # Page: /settings/profile
│
├── features/               # 🎯 Core of architecture (Each feature = 1 page)
│   ├── auth-login/         # ← Feature for page /login
│   ├── dashboard/          # ← Feature for page /dashboard
│   └── settings-profile/   # ← Feature for page /settings/profile
│
├── components/             # 🎨 Shared UI Components
│   ├── ui/                # Base components (Shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── dialog.tsx
│   ├── composite/         # Composed components
│   │   ├── data-table/
│   │   └── confirmation-dialog/
│   └── layouts/           # Layout components
│       ├── main-layout.tsx
│       └── auth-layout.tsx
│
└── shared/                 # 🔧 Shared resources
    ├── utils/             # Pure utilities
    ├── hooks/             # Global hooks
    ├── services/          # API client, config
    ├── types/             # Global types
    ├── constants/         # App constants
    ├── config/            # Configurations
    ├── stores/            # Global state
    └── providers/         # React providers
```

---

## Directory Details

### 1. `app/` - Routing Layer

Contains only routing and composition. **DOES NOT** contain business logic.

```typescript
// app/dashboard/posts/page.tsx
import { PostList } from '@/features/dashboard-posts'

export default function PostsPage() {
  return <PostList />
}
```

**Rules:**

- ✅ Import from `features/` and compose
- ✅ Handle layout, metadata, error boundary
- ❌ Do not contain business logic
- ❌ Do not call API directly

---

### 2. `features/` - Core of Architecture

This is the **most important part**. Each feature corresponds to one page (route). Each feature is an independent unit containing all logic and UI for that page.

#### **Feature Naming Convention**

Each feature is designed to match the page name (route). Feature name = Routing path (replace `/` with `-`, `[param]` with descriptive name)

```
app/dashboard/posts/              → features/dashboard-posts/
app/dashboard/posts/[id]/        → features/dashboard-posts-detail/
app/dashboard/posts/[id]/edit/   → features/dashboard-posts-edit/
app/settings/profile/             → features/settings-profile/
app/admin/users/                  → features/admin-users/
app/users/[userId]/posts/         → features/users-posts/
```

**For features without routes (modals, sidebars):**

```
features/modal-confirm-delete/
features/dialog-user-invite/
features/sidebar-navigation/
```

#### **Internal Feature Structure**

```typescript
features/dashboard-posts/
├── index.ts              # 📦 Public API (REQUIRED)
│
├── components/           # 🎨 UI Components
│   ├── PostList/
│   │   ├── PostList.tsx      # Main component
│   │   ├── PostList.pc.tsx   # Desktop variant (optional)
│   │   └── PostList.sp.tsx   # Mobile variant (optional)
│   ├── PostItem/
│   │   └── PostItem.tsx
│   └── PostFilters/
│       └── PostFilters.tsx
│
├── hooks/                # 🎮 Custom Hooks (Controller layer)
│   ├── usePostList.ts        # React Query hook
│   ├── usePostCreate.ts      # Mutation hook
│   ├── usePostFilters.ts     # Client state hook
│   └── usePostController.ts  # Main orchestrator
│
├── services/             # 🌐 API Layer
│   └── post.service.ts       # HTTP calls
│
├── types/                # 📘 TypeScript Types
│   └── post.types.ts
│
├── constants/            # 🔢 Constants
│   └── post.constants.ts
│
└── stores/               # 💾 Local State (optional)
    └── post.store.ts         # Zustand/Context
```

**When to use `stores/` in a feature?**

- ✅ When complex state needs to be shared between multiple components in the feature
- ✅ When state needs to persist (localStorage, sessionStorage)
- ✅ When state logic is too complex, not suitable for React state or Context
- ❌ Don't use if state is simple → Use `useState` or `useReducer` in component/hook
- ❌ Don't use if state is only used in 1 component → Use local `useState`

**Example:**

```typescript
// ✅ Should use store: Complex state, shared between multiple components
// features/dashboard-posts/stores/post.store.ts
export const usePostStore = create((set) => ({
  selectedPosts: [],
  filters: { status: "all", search: "" },
  toggleSelect: (id) =>
    set((state) => ({
      selectedPosts: state.selectedPosts.includes(id)
        ? state.selectedPosts.filter((x) => x !== id)
        : [...state.selectedPosts, id],
    })),
}));

// ❌ Don't need store: Simple state, only used in 1 component
// features/dashboard-posts/components/PostItem.tsx
const [isExpanded, setIsExpanded] = useState(false); // ✅ Enough
```

#### **`_shared/` folder - Shared resources within a feature**

**When is `_shared/` needed in a feature?**

Only when a feature has ≥ 3 sub-features and has shared code between sub-features.

Example: Feature "Account Management" has multiple screens:

- Account List
- Account Detail
- Account Settings
- Account Permissions

→ All use shared `accountService`, `Account` type, `AccountCard` component
→ Should create `_shared/` to avoid duplicate code

```
features/account/
├── _shared/                    # Shared between sub-features
│   ├── components/
│   │   └── AccountCard/        # Used in multiple sub-features
│   ├── hooks/
│   ├── services/
│   │   ├── account.service.ts  # Shared API calls
│   │   └── accountApi.ts
│   ├── types/
│   │   └── account.types.ts    # Shared types
│   └── constants/
│
├── account-list/               # Sub-feature 1
│   ├── components/
│   ├── hooks/
│   └── index.ts
│
├── account-detail/             # Sub-feature 2
│   ├── components/
│   ├── hooks/
│   └── index.ts
│
└── account-settings/           # Sub-feature 3
    ├── components/
    ├── hooks/
    └── index.ts
```

**Note:** If there are only 1-2 sub-features, `_shared/` is not needed. Just duplicate code or move shared code to a higher level.

---

### 3. `components/` - Shared UI Components

```
components/
├── ui/                    # Base components (from Shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── composite/             # Composed components
│   ├── data-table/
│   │   ├── data-table.tsx
│   │   ├── data-table-header.tsx
│   │   └── data-table-pagination.tsx
│   ├── confirmation-dialog/
│   └── empty-state/
│
└── layouts/               # Layout components
    ├── main-layout.tsx
    ├── auth-layout.tsx
    └── dashboard-layout.tsx
```

**Rules:**

- Only contains UI components used by ≥ 2 features
- Does not contain business logic
- Use Container/Presentation pattern if needed

**When to move a component from `features/` to `components/`?**

- ✅ When the component is used by ≥ 2 features
- ✅ When the component has no business logic (pure UI)
- ✅ When the component can be reused in many different contexts
- ❌ Don't move if the component has logic specific to that feature
- ❌ Don't move if only used in 1 feature (even if it could be reused later)

**Example:**

```typescript
// ✅ Should move to components/
// features/dashboard-posts/components/PostCard.tsx
// → components/composite/post-card/PostCard.tsx
// Because: PostCard is used in dashboard-posts, user-posts, search-posts

// ❌ Should not move
// features/dashboard-posts/components/PostListWithFilters.tsx
// Because: Has filter logic specific to dashboard-posts
```

---

### 4. `shared/` - Global Utilities

```
shared/
├── utils/                 # Pure utilities
│   ├── format.ts         # formatCurrency, formatDate
│   ├── validation.ts     # Validation helpers
│   └── array.ts          # Array utilities
│
├── hooks/                 # Global custom hooks
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useLocalStorage.ts
│
├── services/              # API Configuration
│   ├── api-client.ts     # Axios/Fetch config
│   ├── auth.service.ts   # Global auth
│   └── upload.service.ts
│
├── types/                 # Global types
│   ├── api.types.ts
│   ├── common.types.ts
│   └── env.d.ts
│
├── constants/             # App-wide constants
│   ├── routes.ts
│   ├── config.ts
│   └── regex.ts
│
├── stores/                # Global state
│   ├── auth.store.ts     # Zustand store
│   └── theme.store.ts
│
└── providers/             # React providers
    ├── query-provider.tsx
    ├── theme-provider.tsx
    └── auth-provider.tsx
```

**Rules for `shared/services/`:**

- ✅ Only contains API client configuration (axios instance, interceptors, base config)
- ✅ Contains global services that don't depend on business domain (auth, upload, notification)
- ❌ DOES NOT contain business logic specific to any feature
- ❌ DOES NOT contain API calls for specific domains (e.g., `postService`, `userService`)

**Example:**

```typescript
// ✅ Correct: API client config
// shared/services/api-client.ts
export const apiClient = axios.create({ baseURL: "/api" });

// ✅ Correct: Global service not dependent on domain
// shared/services/auth.service.ts
export const authService = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
};

// ❌ Wrong: Business logic specific
// shared/services/post.service.ts  ← Should be in features/dashboard-posts/services/
```

**Rules for `shared/stores/`:**

- ✅ Only contains global state (auth, theme, app config)
- ❌ DOES NOT contain state specific to any feature
- If state is only used in 1 feature → Place in `features/[feature]/stores/`

---

## Golden Rules (MUST FOLLOW)

### 🚨 **Rule 0: Each Feature = 1 Page**

**The most fundamental principle:** Each feature corresponds to one page (route) in the application.

```
app/dashboard/posts/page.tsx          → features/dashboard-posts/
app/settings/profile/page.tsx         → features/settings-profile/
app/admin/users/page.tsx              → features/admin-users/
```

**Rules:**

- ✅ Each new page = Create new feature
- ✅ Feature name = Routing path (replace `/` with `-`)
- ❌ DO NOT create multiple features for the same page
- ❌ DO NOT create features without corresponding pages (except complex modals/dialogs)

**Benefits:**

- Easy to find code: Know the page → know the feature
- Clear organization: 1 page = 1 feature = 1 independent unit
- Avoid confusion: Don't have to think "which page does this feature belong to?"

### 🚨 **Rule 1: Import Hierarchy**

```
┌─────────────────┐
│   app/pages     │ ← Composition layer
└────────┬────────┘
         ↓ ✅ allowed
┌─────────────────┐
│   features/     │ ← Business features
└────────┬────────┘
         ↓ ✅ allowed
┌─────────────────┐
│   shared/       │ ← Utilities
│   components/  │
└─────────────────┘
```

**Rules:**

- ❌ `shared/` and `components/` CANNOT import from `features/`
- ❌ `features/` CANNOT import from other `features/`
- ✅ `app/` can import everything
- ✅ `features/` can only import from `shared/` and `components/`
- ✅ `shared/` can only import from external libraries (React, axios, etc.), CANNOT import from `features/` or `components/`

### 🚨 **Rule 2: Public API Pattern**

Each feature **MUST** have an `index.ts` to export the public API:

```typescript
// features/dashboard-posts/index.ts

// ✅ Export what's necessary
export { PostList } from "./components/PostList/PostList";
export { PostDetail } from "./components/PostDetail/PostDetail";
export { usePostController } from "./hooks/usePostController";

// ✅ Export types if needed externally
export type { Post, CreatePostDto, PostFilters } from "./types/post.types";

// ❌ DO NOT export implementation details
// export { PostItem } from './components/PostItem'
// export { postService } from './services/post.service'
// export { usePostList } from './hooks/usePostList'  // Internal hook
```

**Benefits:**

- Control what's used externally
- Easy to refactor internal code
- Avoid circular dependencies

### 🚨 **Rule 3: No Direct Imports Between Features**

**ABSOLUTELY NO direct imports between features. No exceptions.**

```typescript
// ❌ NEVER DO THIS - ABSOLUTELY FORBIDDEN
// features/dashboard-posts/hooks/usePostList.ts
import { useUserProfile } from '@/features/settings-profile/hooks/useUserProfile'
import { UserCard } from '@/features/settings-profile/components/UserCard'
import { userService } from '@/features/settings-profile/services/user.service'

// ✅ DO THIS: Move to shared if ≥ 2 features use it
// shared/hooks/useUserProfile.ts
export function useUserProfile() { ... }

// Both features import from shared
import { useUserProfile } from '@/hooks/useUserProfile'
```

**Rule of thumb:**

- ❌ **NEVER** import directly between features
- ✅ If ≥ 2 features use it → Move to `shared/`
- ✅ If only 1 feature uses it → Keep it in that feature
- ✅ If you need to use logic from another feature → Refactor to move that logic to `shared/`

**Benefits:**

- Avoid circular dependencies
- Keep features completely independent
- Easy to refactor and maintain

### 🚨 **Rule 4: Separate UI and Logic**

```typescript
// ❌ BAD: Logic mixed in component
export function PostList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return <div>...</div>
}

// ✅ GOOD: Clear separation
// hooks/usePostList.ts
export function usePostList() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: postService.getAll
  })
}

// components/PostList.tsx
export function PostList() {
  const { data: posts, isLoading } = usePostList()

  if (isLoading) return <Skeleton />
  return <div>...</div>
}
```

### 🚨 **Rule 5: Required Feature Structure**

Each feature **MUST** have the following structure:

```
features/dashboard-posts/
├── index.ts              # 📦 REQUIRED - Public API
├── components/           # 🎨 UI Components
├── hooks/                # 🎮 Custom Hooks (Controller layer)
├── services/             # 🌐 API Layer
├── types/                # 📘 TypeScript Types
└── constants/            # 🔢 Constants (optional)
```

**Rules:**

- ✅ **REQUIRED:** `index.ts` - Export public API
- ✅ **REQUIRED:** `components/` - UI components of the feature
- ✅ **REQUIRED:** `hooks/` - Logic and state management
- ✅ **REQUIRED:** `services/` - API calls
- ✅ **REQUIRED:** `types/` - TypeScript types
- ⚪ **Optional:** `constants/` - Only when needed
- ⚪ **Optional:** `stores/` - Only when complex state is needed

**Minimum structure example:**

```
features/dashboard-posts/
├── index.ts
├── components/
│   └── PostList/
│       └── PostList.tsx
├── hooks/
│   └── usePostController.ts
├── services/
│   └── post.service.ts
└── types/
    └── post.types.ts
```

**Benefits:**

- Consistent structure across features
- Easy to find code: Know what you need → know where it is
- Easy onboarding: New developers understand the structure immediately

---

## Code Example: Feature "Post List"

A complete example of a full feature:

### 1. **Types**

```typescript
// features/dashboard-posts/types/post.types.ts

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  status: "draft" | "published";
}

export interface CreatePostDto {
  title: string;
  content: string;
}

export interface PostFilters {
  status?: Post["status"];
  search?: string;
  page?: number;
}
```

### 2. **Service Layer**

```typescript
// features/dashboard-posts/services/post.service.ts
import { apiClient } from "@/services/api-client";

import type { CreatePostDto, Post, PostFilters } from "../types/post.types";

export const postService = {
  async getAll(filters?: PostFilters) {
    const { data } = await apiClient.get<Post[]>("/posts", {
      params: filters,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await apiClient.get<Post>(`/posts/${id}`);
    return data;
  },

  async create(dto: CreatePostDto) {
    const { data } = await apiClient.post<Post>("/posts", dto);
    return data;
  },

  async delete(id: string) {
    await apiClient.delete(`/posts/${id}`);
  },
};
```

### 3. **Hooks Layer**

```typescript
// features/dashboard-posts/hooks/usePostList.ts

import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/post.service";
import type { PostFilters } from "../types/post.types";

export function usePostList(filters?: PostFilters) {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => postService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// features/dashboard-posts/hooks/usePostCreate.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "../services/post.service";

export function usePostCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

// features/dashboard-posts/hooks/usePostController.ts

import { useState } from "react";
import { usePostList } from "./usePostList";
import { usePostCreate } from "./usePostCreate";
import type { PostFilters } from "../types/post.types";

export function usePostController() {
  const [filters, setFilters] = useState<PostFilters>({
    page: 1,
    status: undefined,
  });

  const { data: posts, isLoading } = usePostList(filters);
  const { mutate: createPost, isPending: isCreating } = usePostCreate();

  const handleFilterChange = (newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    posts,
    isLoading,
    filters,
    setFilters: handleFilterChange,
    createPost,
    isCreating,
  };
}
```

### 4. **Component Layer**

```typescript
// features/dashboard-posts/components/PostList/PostList.tsx

import { usePostController } from '../../hooks/usePostController'
import { PostItem } from '../PostItem/PostItem'
import { PostFilters } from '../PostFilters/PostFilters'
import { Button } from '@/components/ui/button'

export function PostList() {
  const {
    posts,
    isLoading,
    filters,
    setFilters,
    createPost
  } = usePostController()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <PostFilters
        filters={filters}
        onChange={setFilters}
      />

      <div className="grid gap-4">
        {posts?.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      <Button onClick={() => createPost({ title: 'New', content: '' })}>
        Create Post
      </Button>
    </div>
  )
}
```

### 5. **Public API**

```typescript
// features/dashboard-posts/index.ts

export { PostList } from "./components/PostList/PostList";
export { usePostController } from "./hooks/usePostController";

export type { Post, CreatePostDto, PostFilters } from "./types/post.types";
```

### 6. **Usage in Page**

```typescript
// app/dashboard/posts/page.tsx

import { PostList } from '@/features/dashboard-posts'

export default function PostsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <PostList />
    </div>
  )
}
```

---

## AI-Friendly Best Practices

To optimize this structure for AI Coding Assistant (Cursor, GitHub Copilot, Claude), follow these best practices:

### 🤖 **1. Naming Conventions - Clear and Consistent Naming**

AI relies on names to understand context. Clear naming helps AI suggest code more accurately.

```typescript
// ✅ GOOD: Clear names that accurately describe functionality
export function usePostListController() { ... }
export function PostListFilters() { ... }
export const postService = { ... }

// ❌ BAD: Vague names, AI has difficulty understanding
export function useController() { ... }
export function Filters() { ... }
export const service = { ... }
```

**Rules:**

- ✅ Prefix hooks with `use` (React convention)
- ✅ Prefix services with domain name (`postService`, `userService`)
- ✅ Components: PascalCase, clearly describe functionality
- ✅ Files: kebab-case, file name = main export name (if applicable)

### 🤖 **2. Type Definitions - Complete Type Definitions**

AI understands code better when there's complete type information.

```typescript
// ✅ GOOD: Clear, complete types
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  status: "draft" | "published";
  tags?: string[];
}

export function usePostList(filters?: PostFilters): UseQueryResult<Post[], Error> {
  // ...
}

// ❌ BAD: Missing types, AI has to guess
export function usePostList(filters?: any) {
  // ...
}
```

**Rules:**

- ✅ Always define types for props, params, return values
- ✅ Export types in `index.ts` if needed externally
- ✅ Use `interface` for objects, `type` for unions/intersections
- ❌ Avoid `any`, use `unknown` if really needed

### 🤖 **3. File Structure - Predictable Structure**

AI relies on folder structure to find code. Consistent structure helps AI suggest the correct file.

```
✅ GOOD: Consistent structure
features/dashboard-posts/
├── index.ts
├── components/
│   └── PostList/
│       └── PostList.tsx
├── hooks/
│   └── usePostList.ts
├── services/
│   └── post.service.ts
└── types/
    └── post.types.ts

❌ BAD: Inconsistent structure
features/dashboard-posts/
├── PostList.tsx          # Component at root
├── hooks.ts              # All hooks in one file
└── api.ts                # Unclear service
```

**Rules:**

- ✅ Each feature has the same structure
- ✅ Each component has its own folder (easy to find and extend)
- ✅ File name = Export name (if there's one main export)

### 🤖 **4. Public API Pattern - Clear Exports**

AI needs to know what's exported to suggest correct imports.

```typescript
// ✅ GOOD: Clear public API
// features/dashboard-posts/index.ts
export { PostList } from "./components/PostList/PostList";
export { usePostController } from "./hooks/usePostController";
export type { Post, CreatePostDto } from "./types/post.types";

// ❌ BAD: Export everything, AI doesn't know what to use
export * from "./components";
export * from "./hooks";
export * from "./services";
```

**Rules:**

- ✅ Only export what's necessary
- ✅ Export types separately with `export type`
- ✅ Comment for internal exports (if needed)

### 🤖 **5. Comments & Documentation - Clear Descriptions**

AI reads comments to understand context and suggest appropriate code.

```typescript
// ✅ GOOD: Clear comments
/**
 * Fetches list of posts with optional filters
 * @param filters - Filter options (status, search, page)
 * @returns Query result with posts array
 */
export function usePostList(filters?: PostFilters) {
  // ...
}

// ❌ BAD: No comment or unclear comment
export function usePostList(filters?: any) {
  // Gets posts
}
```

**Rules:**

- ✅ JSDoc for complex functions
- ✅ Inline comments for unclear logic
- ✅ Describe "why" not just "what"

### 🤖 **6. Consistent Patterns - Consistent Patterns**

AI learns from patterns. Consistent patterns help AI suggest code in the correct style.

```typescript
// ✅ GOOD: Consistent pattern across features
// features/dashboard-posts/hooks/usePostController.ts
export function usePostController() {
  const [filters, setFilters] = useState<PostFilters>({});
  const { data, isLoading } = usePostList(filters);
  const { mutate: create } = usePostCreate();

  return { data, isLoading, filters, setFilters, create };
}

// features/admin-users/hooks/useUserController.ts
export function useUserController() {
  const [filters, setFilters] = useState<UserFilters>({});
  const { data, isLoading } = useUserList(filters);
  const { mutate: create } = useUserCreate();

  return { data, isLoading, filters, setFilters, create };
}

// ❌ BAD: Each feature has different pattern
// Feature A: return object
// Feature B: return array
// Feature C: return nothing, mutate global state
```

**Rules:**

- ✅ Controller hooks have the same structure
- ✅ Service methods have the same naming convention
- ✅ Components have similar props structure

### 🤖 **7. Import Paths - Clear Paths**

AI needs to know where to import from. Clear path aliases help AI suggest correctly.

```typescript
// ✅ GOOD: Clear import paths with aliases
import { PostList } from "@/features/dashboard-posts";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/services/api-client";

// ❌ BAD: Complex relative paths
import { PostList } from "../../../features/dashboard-posts";
import { Button } from "../../../../components/ui/button";
```

**Rules:**

- ✅ Use path aliases (`@/features`, `@/components`, `@/shared`)
- ✅ Import from feature's `index.ts` (public API)
- ✅ Avoid overly deep relative paths (`../../../`)

### 🤖 **8. Good Prompt Examples for AI**

When working with AI, use clear and specific prompts:

**✅ GOOD Prompts:**

```
"Create a new feature for page /admin/users with:
- UserList component to display list of users
- useUserController hook to manage state
- userService with getAll and create methods
- Types User, CreateUserDto, UserFilters"
```

```
"Add status filter to dashboard-posts feature:
- Update PostFilters type to add status field
- Update usePostController to handle status filter
- Update PostFilters component to display status dropdown"
```

**❌ BAD Prompts:**

```
"Create user list"  // Too vague
```

```
"Add filter"    // Unclear what filter, where
```

**Rules for prompts:**

- ✅ Specify feature name (by route)
- ✅ Specify component/hook/service to create/modify
- ✅ Specify necessary types
- ✅ Reference existing patterns if available

### 🤖 **9. Code Organization - Logical Code Organization**

AI understands code better when code is organized logically.

```typescript
// ✅ GOOD: Code organized logically
export function usePostController() {
  // 1. State declarations
  const [filters, setFilters] = useState<PostFilters>({});

  // 2. Data fetching hooks
  const { data: posts, isLoading } = usePostList(filters);

  // 3. Mutation hooks
  const { mutate: createPost } = usePostCreate();

  // 4. Handlers
  const handleFilterChange = (newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 5. Return
  return {
    posts,
    isLoading,
    filters,
    setFilters: handleFilterChange,
    createPost,
  };
}

// ❌ BAD: Messy code, hard to follow
export function usePostController() {
  const { mutate: createPost } = usePostCreate();
  const [filters, setFilters] = useState<PostFilters>({});
  const handleFilterChange = (newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };
  const { data: posts, isLoading } = usePostList(filters);
  return { posts, isLoading, filters, setFilters: handleFilterChange, createPost };
}
```

**Rules:**

- ✅ Group related code together
- ✅ Order: imports → types → state → effects → handlers → return
- ✅ Blank lines between sections

### 🤖 **10. Testing - Tests Help AI Understand Expected Behavior**

Tests are good documentation for AI about expected behavior.

```typescript
// ✅ GOOD: Tests clearly describe behavior
describe("usePostController", () => {
  it("should filter posts by status", () => {
    // Test clearly describes: when filtering by status, only return posts with that status
  });

  it("should create post and refresh list", () => {
    // Test clearly describes: when creating post, list will be refreshed
  });
});
```

**Benefits:**

- AI understands expected behavior from tests
- AI can suggest code that fits with tests
- Tests are living documentation

---

## Checklist: Optimize Feature for AI

When creating a new feature, ensure:

- [ ] ✅ Feature name = route path (easy to find)
- [ ] ✅ Complete types, don't use `any`
- [ ] ✅ Clear public API in `index.ts`
- [ ] ✅ Consistent naming conventions
- [ ] ✅ Comments for complex logic
- [ ] ✅ Follow patterns from other features
- [ ] ✅ Import from path aliases, don't use deep relative paths
- [ ] ✅ Code organized logically (state → hooks → handlers → return)

---

## Responsive Design: PC vs SP variants

Sometimes PC and Mobile UI are too different to use responsive CSS:

```typescript
features/dashboard-posts/
└── components/
    └── PostList/
        ├── PostList.tsx      # Main component (logic)
        ├── PostList.pc.tsx   # Desktop UI
        └── PostList.sp.tsx   # Mobile UI

// PostList.tsx
'use client'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { PostListPC } from './PostList.pc'
import { PostListSP } from './PostList.sp'
import { usePostController } from '../../hooks/usePostController'

export function PostList() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const controller = usePostController()

  return isDesktop
    ? <PostListPC {...controller} />
    : <PostListSP {...controller} />
}
```

---

## Testing Strategy

```
features/dashboard-posts/
├── components/
│   └── PostList/
│       ├── PostList.tsx
│       └── PostList.test.tsx      # Component test
├── hooks/
│   └── usePostController.ts
│       └── usePostController.test.ts  # Hook test
└── services/
    └── post.service.ts
        └── post.service.test.ts    # Service test
```

**Rules:**

- Test file in the same folder as implementation
- Name: `*.test.ts` or `*.test.tsx`
- Tests are independent, don't depend on other features

---

## Important Considerations

### ✅ **When to create a new feature?**

- ✅ **When there's a new page (route)** - Each new page = 1 new feature
- ✅ When there's a complex modal/dialog (>200 lines of code) that doesn't belong to any specific page
- ❌ Don't create a new feature just because logic can be reused → Should move that logic to `shared/` or `components/`

### ✅ **When to move to shared?**

- When ≥ 2 features use it together
- When it's a pure utility (doesn't depend on business)
- When it's a base UI component

### ⚠️ **Avoid shared becoming a "dumping ground"**

```typescript
// ❌ BAD: Too specific, shouldn't be in shared
shared / utils / formatPostTitle.ts;

// ✅ GOOD: Generic utility
shared / utils / formatText.ts;

// ✅ BETTER: Keep in feature
features / dashboard - posts / utils / formatPostTitle.ts;
```

### ⚠️ **When is `_shared/` needed in a feature?**

Only when a feature has ≥ 3 sub-features and has shared code:

```
features/account/
├── _shared/              # ✅ Has ≥ 3 sub-features
│   └── services/
├── account-list/
├── account-detail/
└── account-settings/

features/simple-feature/
└── components/           # ❌ No need for _shared
```

---

## Results After Implementation

### 📊 Improved Metrics

**Before implementation:**

- ⏱️ Onboarding: 2-3 weeks
- 🐛 Bug fix time: 4-8 hours
- 🔍 Code review: 2-3 hours
- 😰 Developer happiness: 3/10

**After implementation:**

- ⏱️ Onboarding: 3-5 days
- 🐛 Bug fix time: 1-2 hours
- 🔍 Code review: 30 minutes - 1 hour
- 😊 Developer happiness: 8/10

### 💬 Team Feedback

> "Now I don't have to think much about where to place code. Just follow the pattern!" - Junior Dev

> "Code review is much faster. Just need to check if the structure is followed." - Tech Lead

> "Onboarding new people is much easier. Just show 1 feature example and they understand immediately." - Team Manager

### 🎯 Problems Solved

✅ **Consistent code:** Everyone codes following the same pattern
✅ **Avoid conflicts:** Team works in parallel without code conflicts
✅ **Easy testing:** Test each feature independently
✅ **Easy refactoring:** Modifying 1 feature doesn't affect others
✅ **AI-friendly:** GitHub Copilot suggests code with 80%+ accuracy

---

## Drawbacks and Trade-offs

No architecture is perfect. Here are points to consider:

### ❌ **Over-engineering for small projects**

If the project has ≤ 10 screens, this architecture might be too complex. Stick with classic structure.

### ❌ **"Shared or not?" decisions take time initially**

At the start of the project, the team will spend time debating whether a utility should be in shared. But after 2-3 weeks, it becomes natural.

### ❌ **Deep folder depth**

```
features/dashboard-posts/components/PostList/PostItem/PostItemActions.tsx
```

Long paths, but a trade-off for clear organization.

### ⚠️ **Requires high discipline**

If the team doesn't follow the rules, this architecture will be useless. Need:

- ESLint rules to enforce import hierarchy
- Strict code review
- Clear documentation

---

## Checklist for Implementing New Features

```markdown
- [ ] Create feature folder with correct naming convention (each feature = 1 page/route)
- [ ] Create index.ts and export public API (only export what's necessary)
- [ ] Separate UI (components) and Logic (hooks/services)
- [ ] Service only contains API calls, no business logic
- [ ] Types clearly defined in types/
- [ ] Constants separated if needed
- [ ] Do not import directly from other features
- [ ] Test files placed in the same folder as implementation
```

---

## Conclusion

Feature-Based Architecture is an effective solution for organizing code in large-scale NextJS projects. After 4 years of implementation, we've clearly seen the benefits:

### ✅ **What We Achieved:**

- **Consistent code:** All developers follow the same pattern, easy to maintain and review
- **Parallel Development:** Team can work in parallel without conflicts
- **Easy Onboarding:** New developers only need to understand 1 feature, apply to all
- **AI-Friendly:** Consistent structure helps AI Coding Assistant suggest code with 80%+ accuracy
- **Good Scalability:** Easy to expand and refactor each feature independently

### 🎯 **When to Apply:**

- ✅ Projects with ≥ 20 screens
- ✅ Teams with ≥ 3 developers
- ✅ Long-term projects requiring long-term maintenance
- ✅ Need to work effectively with AI Coding Assistant

### ⚠️ **When Not to Apply:**

- ❌ Small projects (≤ 10 screens) - May be too complex
- ❌ Prototype/MVP - Need speed over organization
- ❌ Teams without discipline - Need strict rule enforcement

### 💡 **Advice:**

This architecture is not a "silver bullet" but a powerful tool when applied correctly. Most importantly:

1. **Follow the principles:** Follow the rules strictly
2. **Consistency:** Maintain consistent structure across features
3. **Code Review:** Review to ensure pattern is followed
4. **Documentation:** Keep documentation updated

### 🚀 **Next Steps:**

If you decide to apply this architecture:

1. Start with 1-2 new features to get the team familiar
2. Refactor old features gradually (don't need to refactor everything at once)
3. Setup ESLint rules to enforce import hierarchy
4. Create template/boilerplate for new features
5. Document patterns and best practices for the team

---

**We hope this article is helpful to you!** If you have questions or feedback, please don't hesitate to share. We wish you success in building a clean, maintainable, and AI-friendly codebase! 🎉

---

## Get the Project Repository

If you're interested in exploring the complete implementation of this architecture, **please leave your GitHub username in the comments below**. We'll share the repository link with you so you can study the codebase, contribute, or use it as a reference for your own projects.

**Note:** The repository includes a fully configured Next.js project with this Feature-Based Architecture, complete examples, and all the best practices mentioned in this article.
