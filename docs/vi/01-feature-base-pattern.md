# Feature-Driven Architecture cho Next.js / React.js: Tổ chức code thân thiện với AI, dễ bảo trì và mở rộng

## Giới thiệu

Bài viết này chia sẻ về **Feature-Driven Architecture** - một kiến trúc thư mục thân thiện với AI cho ứng dụng Next.js/React.js mà team chúng tôi đã áp dụng để giải quyết các vấn đề tích lũy qua nhiều năm phát triển.

Nếu bạn đang làm việc với một dự án Next.js/React.js đang phình to dần, số lượng thành viên tham gia không ổn định, đau đầu về cách tổ chức code, và muốn tối ưu hóa để làm việc hiệu quả với AI Coding Assistant (Cursor AI, GitHub Copilot, Claude), hi vọng bài viết này sẽ hữu ích cho bạn.

Kiến trúc này được thiết kế đặc biệt để:

- **Tổ chức code rõ ràng:** Mỗi feature tương ứng với một page, dễ tìm và maintain
- **Thân thiện với AI:** Cấu trúc nhất quán giúp AI Coding Assistant hiểu và suggest code chính xác hơn 80%
- **Scale tốt:** Phù hợp cho dự án từ vài màn hình đến 80+ màn hình, 800+ files
- **Dễ onboarding:** Developer mới chỉ cần hiểu 1 feature, apply cho tất cả

> **Lưu ý:** Bài viết tập trung vào kiến trúc thư mục và tổ chức code, không đi sâu vào State Management hay các thư viện cụ thể.

---

## Mục lục

1. [Bối cảnh dự án](#bối-cảnh-dự-án)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Các vấn đề chúng tôi gặp phải](#các-vấn-đề-chúng-tôi-gặp-phải)
4. [Tại sao chọn Feature-Based Pattern?](#tại-sao-chọn-feature-based-pattern)
5. [Kiến trúc chi tiết](#kiến-trúc-chi-tiết)
   - [Cấu trúc tổng quan](#-cấu-trúc-tổng-quan)
   - [Chi tiết từng thư mục](#chi-tiết-từng-thư-mục)
6. [Nguyên tắc vàng (MUST FOLLOW)](#nguyên-tắc-vàng-must-follow)
7. [Code Example: Feature "Post List"](#code-example-feature-post-list)
8. [AI-Friendly Best Practices](#ai-friendly-best-practices)
9. [Responsive Design: PC vs SP variants](#responsive-design-pc-vs-sp-variants)
10. [Testing Strategy](#testing-strategy)
11. [Những lưu ý quan trọng](#những-lưu-ý-quan-trọng)
12. [Kết quả sau khi áp dụng](#kết-quả-sau-khi-áp-dụng)
13. [Nhược điểm và Trade-offs](#nhược-điểm-và-trade-offs)
14. [Checklist khi implement feature mới](#checklist-khi-implement-feature-mới)
15. [Kết luận](#kết-luận)

---

## Bối cảnh dự án

Dự án của chúng tôi là một **hệ thống outsource cho nhiều khách hàng**, với các đặc điểm:

- **Quy mô:** 80+ màn hình, 800+ files
- **Đặc thù team:** Team outsource với số lượng nhân sự thường xuyên thay đổi
- **Yêu cầu:** Phải tuân thủ template và quy trình nghiệm thu chặt chẽ của công ty
- **Mục tiêu mới:** Tối ưu hóa để làm việc tốt với AI Coding Assistant ( Cursor AI )

Khi dự án mới bắt đầu, mọi thứ còn nhỏ gọn và dễ quản lý. Nhưng sau 2 năm phát triển liên tục, chúng tôi đối mặt với một "núi nợ kỹ thuật" cần giải quyết.

---

## Công nghệ sử dụng

Dự án sử dụng các công nghệ và thư viện sau:

### Core Framework

- **Next.js 15.5.4** - React framework với App Router và Turbopack
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

## Các vấn đề chúng tôi gặp phải

### 1. **Code không nhất quán giữa các developer**

Một số ví dụ điển hình:

- Developer A đặt API call trong component
- Developer B tạo service riêng
- Developer C dùng custom hook
- Developer D lại mix cả 3 cách trên

**Hậu quả:** Khi sửa bug hoặc thêm tính năng, phải mất thời gian tìm hiểu "cách làm" của từng người.

### 2. **Component "siêu to khổng lồ"**

Có những file component chứa tất cả:

- UI rendering
- Business logic
- API calls
- State management
- Validation logic

Một component có thể lên đến **3000-5000 dòng code**. Sửa một chỗ nhỏ như chơi **Jenga** - "rút một viên gạch, sập cả tòa nhà" 🏚️

### 3. **Onboarding khó khăn**

Khi có developer mới join:

- Mất 2-3 tuần mới quen với codebase
- Không biết đặt code ở đâu
- Copy-paste code cũ mà không hiểu tại sao lại làm như vậy
- Tạo thêm inconsistency

### 4. **Dependencies lộn xộn**

```typescript
// Component A import Component B
// Component B lại import Component A
import { PostItem } from "@/features/post/components/PostItem";
import { UserCard } from "@/features/user/components/UserCard";

// 🔥 Circular dependency hell
```

### 5. **Testing và Review khó khăn**

- Không biết test ở đâu
- Code review mất nhiều thời gian vì phải đọc hiểu toàn bộ flow
- Refactor một chỗ, ảnh hưởng khắp nơi

---

## Tại sao chọn Feature-Based Pattern?

Sau nhiều cuộc họp và thử nghiệm, chúng tôi quyết định chọn **Feature-Based Pattern** vì:

### ✅ **Lý do 1: Tách biệt rõ ràng**

Mỗi feature là một "mini-application" độc lập. Sửa feature A không ảnh hưởng feature B.

### ✅ **Lý do 2: Parallel Development**

Team có thể làm việc song song trên nhiều feature mà không conflict code.

### ✅ **Lý do 3: Dễ Onboarding**

Developer mới chỉ cần hiểu cấu trúc của 1 feature, apply cho tất cả.

### ✅ **Lý do 4: Scale tốt**

Dễ dàng split thành monorepo hoặc micro-frontends sau này.

### ✅ **Lý do 5: AI-Friendly**

Cấu trúc nhất quán giúp AI (GitHub Copilot, Cursor, Claude) code assist chính xác hơn.

---

## Kiến trúc chi tiết

### 📁 Cấu trúc tổng quan

**Nguyên tắc:** Mỗi page (route) trong `app/` tương ứng với 1 feature trong `features/`

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
├── features/               # 🎯 Core của architecture (Mỗi feature = 1 page)
│   ├── auth-login/         # ← Feature cho page /login
│   ├── dashboard/          # ← Feature cho page /dashboard
│   └── settings-profile/   # ← Feature cho page /settings/profile
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

## Chi tiết từng thư mục

### 1. `app/` - Routing Layer

Chỉ chứa routing và composition. **KHÔNG** chứa business logic.

```typescript
// app/dashboard/posts/page.tsx
import { PostList } from '@/features/dashboard-posts'

export default function PostsPage() {
  return <PostList />
}
```

**Quy tắc:**

- ✅ Import từ `features/` và compose lại
- ✅ Handle layout, metadata, error boundary
- ❌ Không chứa business logic
- ❌ Không gọi API trực tiếp

---

### 2. `features/` - Core của Architecture

Đây là phần **quan trọng nhất**. Mỗi feature tương ứng với một page (route). Mỗi feature là một đơn vị độc lập chứa toàn bộ logic và UI cho page đó.

#### **Cách đặt tên feature**

Mỗi feature được thiết kế ứng với tên page (route). Feature name = Routing path (replace `/` với `-`, `[param]` với tên mô tả)

```
app/dashboard/posts/              → features/dashboard-posts/
app/dashboard/posts/[id]/        → features/dashboard-posts-detail/
app/dashboard/posts/[id]/edit/   → features/dashboard-posts-edit/
app/settings/profile/             → features/settings-profile/
app/admin/users/                  → features/admin-users/
app/users/[userId]/posts/         → features/users-posts/
```

**Với feature không có route (modal, sidebar):**

```
features/modal-confirm-delete/
features/dialog-user-invite/
features/sidebar-navigation/
```

#### **Cấu trúc bên trong một feature**

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

**Khi nào dùng `stores/` trong feature?**

- ✅ Khi cần state phức tạp được share giữa nhiều components trong feature
- ✅ Khi state cần persist (localStorage, sessionStorage)
- ✅ Khi state logic quá phức tạp, không phù hợp với React state hoặc Context
- ❌ Không dùng nếu state đơn giản → Dùng `useState` hoặc `useReducer` trong component/hook
- ❌ Không dùng nếu state chỉ dùng trong 1 component → Dùng `useState` local

**Ví dụ:**

```typescript
// ✅ Nên dùng store: State phức tạp, share giữa nhiều components
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

// ❌ Không cần store: State đơn giản, chỉ dùng trong 1 component
// features/dashboard-posts/components/PostItem.tsx
const [isExpanded, setIsExpanded] = useState(false); // ✅ Đủ rồi
```

#### **`_shared/` folder - Shared resources trong feature**

**Khi nào cần `_shared/` trong feature?**

Chỉ khi feature có ≥ 3 sub-features và có code dùng chung giữa các sub-features.

Ví dụ: Feature "Account Management" có nhiều màn hình:

- Account List
- Account Detail
- Account Settings
- Account Permissions

→ Tất cả đều dùng chung `accountService`, `Account` type, `AccountCard` component
→ Nên tạo `_shared/` để tránh duplicate code

```
features/account/
├── _shared/                    # Shared giữa các sub-feature
│   ├── components/
│   │   └── AccountCard/        # Dùng chung ở nhiều sub-feature
│   ├── hooks/
│   ├── services/
│   │   ├── account.service.ts  # API calls chung
│   │   └── accountApi.ts
│   ├── types/
│   │   └── account.types.ts    # Types chung
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

**Lưu ý:** Nếu chỉ có 1-2 sub-features, không cần `_shared/`. Chỉ cần duplicate code hoặc move shared code lên level cao hơn.

---

### 3. `components/` - Shared UI Components

```
components/
├── ui/                    # Base components (từ Shadcn/ui)
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

**Quy tắc:**

- Chỉ chứa UI components dùng chung ≥ 2 features
- Không chứa business logic
- Dùng Container/Presentation pattern nếu cần

**Khi nào move component từ `features/` sang `components/`?**

- ✅ Khi component được dùng bởi ≥ 2 features
- ✅ Khi component không chứa business logic (pure UI)
- ✅ Khi component có thể reuse ở nhiều context khác nhau
- ❌ Không move nếu component có logic specific cho feature đó
- ❌ Không move nếu chỉ dùng trong 1 feature (dù có thể reuse sau)

**Ví dụ:**

```typescript
// ✅ Nên move sang components/
// features/dashboard-posts/components/PostCard.tsx
// → components/composite/post-card/PostCard.tsx
// Vì: PostCard được dùng ở dashboard-posts, user-posts, search-posts

// ❌ Không nên move
// features/dashboard-posts/components/PostListWithFilters.tsx
// Vì: Có logic filter specific cho dashboard-posts
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

**Quy tắc cho `shared/services/`:**

- ✅ Chỉ chứa API client configuration (axios instance, interceptors, base config)
- ✅ Chứa services global không phụ thuộc business domain (auth, upload, notification)
- ❌ KHÔNG chứa business logic specific cho feature nào
- ❌ KHÔNG chứa API calls cho domain cụ thể (ví dụ: `postService`, `userService`)

**Ví dụ:**

```typescript
// ✅ Đúng: API client config
// shared/services/api-client.ts
export const apiClient = axios.create({ baseURL: "/api" });

// ✅ Đúng: Global service không phụ thuộc domain
// shared/services/auth.service.ts
export const authService = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
};

// ❌ Sai: Business logic specific
// shared/services/post.service.ts  ← Nên ở features/dashboard-posts/services/
```

**Quy tắc cho `shared/stores/`:**

- ✅ Chỉ chứa global state (auth, theme, app config)
- ❌ KHÔNG chứa state specific cho feature nào
- Nếu state chỉ dùng trong 1 feature → Đặt trong `features/[feature]/stores/`

---

## Nguyên tắc vàng (MUST FOLLOW)

### 🚨 **Rule 0: Mỗi Feature = 1 Page**

**Nguyên tắc cơ bản nhất:** Mỗi feature tương ứng với một page (route) trong ứng dụng.

```
app/dashboard/posts/page.tsx          → features/dashboard-posts/
app/settings/profile/page.tsx         → features/settings-profile/
app/admin/users/page.tsx              → features/admin-users/
```

**Quy tắc:**

- ✅ Mỗi page mới = Tạo feature mới
- ✅ Feature name = Routing path (replace `/` với `-`)
- ❌ KHÔNG tạo nhiều features cho cùng 1 page
- ❌ KHÔNG tạo feature không có page tương ứng (trừ modal/dialog phức tạp)

**Lợi ích:**

- Dễ tìm code: Biết page → biết feature
- Tổ chức rõ ràng: 1 page = 1 feature = 1 đơn vị độc lập
- Tránh confusion: Không phải suy nghĩ "feature này thuộc page nào?"

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

**Quy tắc:**

- ❌ `shared/` và `components/` KHÔNG được import `features/`
- ❌ `features/` KHÔNG được import `features/` khác
- ✅ `app/` có thể import tất cả
- ✅ `features/` chỉ import `shared/` và `components/`
- ✅ `shared/` chỉ import từ external libraries (React, axios, etc.), KHÔNG import từ `features/` hoặc `components/`

### 🚨 **Rule 2: Public API Pattern**

Mỗi feature **BẮT BUỘC** có `index.ts` để export public API:

```typescript
// features/dashboard-posts/index.ts

// ✅ Export những gì cần thiết
export { PostList } from "./components/PostList/PostList";
export { PostDetail } from "./components/PostDetail/PostDetail";
export { usePostController } from "./hooks/usePostController";

// ✅ Export types nếu cần dùng bên ngoài
export type { Post, CreatePostDto, PostFilters } from "./types/post.types";

// ❌ KHÔNG export implementation details
// export { PostItem } from './components/PostItem'
// export { postService } from './services/post.service'
// export { usePostList } from './hooks/usePostList'  // Internal hook
```

**Lợi ích:**

- Kiểm soát được gì được dùng bên ngoài
- Dễ refactor internal code
- Tránh circular dependencies

### 🚨 **Rule 3: Không Import trực tiếp giữa Features**

**TUYỆT ĐỐI KHÔNG được import trực tiếp giữa các features. Không có exception.**

```typescript
// ❌ NEVER DO THIS - TUYỆT ĐỐI CẤM
// features/dashboard-posts/hooks/usePostList.ts
import { useUserProfile } from '@/features/settings-profile/hooks/useUserProfile'
import { UserCard } from '@/features/settings-profile/components/UserCard'
import { userService } from '@/features/settings-profile/services/user.service'

// ✅ DO THIS: Move to shared nếu ≥ 2 features dùng
// shared/hooks/useUserProfile.ts
export function useUserProfile() { ... }

// Cả 2 features import từ shared
import { useUserProfile } from '@/shared/hooks/useUserProfile'
```

**Quy tắc thumb:**

- ❌ **KHÔNG BAO GIỜ** import trực tiếp giữa features
- ✅ Nếu ≥ 2 features dùng → Move to `shared/`
- ✅ Nếu chỉ 1 feature dùng → Giữ trong feature đó
- ✅ Nếu cần dùng logic từ feature khác → Refactor để move logic đó sang `shared/`

**Lợi ích:**

- Tránh circular dependencies
- Giữ features độc lập hoàn toàn
- Dễ refactor và maintain

### 🚨 **Rule 4: Tách biệt UI và Logic**

```typescript
// ❌ BAD: Logic lẫn trong component
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

// ✅ GOOD: Tách rõ ràng
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

### 🚨 **Rule 5: Cấu trúc Feature Bắt buộc**

Mỗi feature **BẮT BUỘC** có cấu trúc sau:

```
features/dashboard-posts/
├── index.ts              # 📦 REQUIRED - Public API
├── components/           # 🎨 UI Components
├── hooks/                # 🎮 Custom Hooks (Controller layer)
├── services/             # 🌐 API Layer
├── types/                # 📘 TypeScript Types
└── constants/            # 🔢 Constants (optional)
```

**Quy tắc:**

- ✅ **BẮT BUỘC:** `index.ts` - Export public API
- ✅ **BẮT BUỘC:** `components/` - UI components của feature
- ✅ **BẮT BUỘC:** `hooks/` - Logic và state management
- ✅ **BẮT BUỘC:** `services/` - API calls
- ✅ **BẮT BUỘC:** `types/` - TypeScript types
- ⚪ **Optional:** `constants/` - Chỉ khi cần
- ⚪ **Optional:** `stores/` - Chỉ khi cần state phức tạp

**Ví dụ cấu trúc tối thiểu:**

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

**Lợi ích:**

- Cấu trúc nhất quán giữa các features
- Dễ tìm code: Biết cần gì → biết ở đâu
- Dễ onboarding: Developer mới hiểu ngay cấu trúc

---

## Code Example: Feature "Post List"

Ví dụ đầy đủ về một feature hoàn chỉnh:

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
import { apiClient } from "@/shared/services/api-client";

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

### 6. **Usage trong Page**

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

Để tối ưu hóa cấu trúc này cho AI Coding Assistant (Cursor, GitHub Copilot, Claude), hãy tuân thủ các best practices sau:

### 🤖 **1. Naming Conventions - Đặt tên rõ ràng và nhất quán**

AI dựa vào tên để hiểu context. Đặt tên rõ ràng giúp AI suggest code chính xác hơn.

```typescript
// ✅ GOOD: Tên rõ ràng, mô tả đúng chức năng
export function usePostListController() { ... }
export function PostListFilters() { ... }
export const postService = { ... }

// ❌ BAD: Tên mơ hồ, AI khó hiểu
export function useController() { ... }
export function Filters() { ... }
export const service = { ... }
```

**Quy tắc:**

- ✅ Prefix hooks với `use` (React convention)
- ✅ Prefix services với domain name (`postService`, `userService`)
- ✅ Components: PascalCase, mô tả rõ chức năng
- ✅ Files: kebab-case, tên file = tên export chính (nếu có)

### 🤖 **2. Type Definitions - Định nghĩa types đầy đủ**

AI hiểu code tốt hơn khi có type information đầy đủ.

```typescript
// ✅ GOOD: Types rõ ràng, đầy đủ
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

// ❌ BAD: Thiếu types, AI phải đoán
export function usePostList(filters?: any) {
  // ...
}
```

**Quy tắc:**

- ✅ Luôn định nghĩa types cho props, params, return values
- ✅ Export types trong `index.ts` nếu cần dùng bên ngoài
- ✅ Dùng `interface` cho objects, `type` cho unions/intersections
- ❌ Tránh `any`, dùng `unknown` nếu thực sự cần

### 🤖 **3. File Structure - Cấu trúc dễ dự đoán**

AI dựa vào cấu trúc folder để tìm code. Cấu trúc nhất quán giúp AI suggest đúng file.

```
✅ GOOD: Cấu trúc nhất quán
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

❌ BAD: Cấu trúc không nhất quán
features/dashboard-posts/
├── PostList.tsx          # Component ở root
├── hooks.ts              # Tất cả hooks trong 1 file
└── api.ts                # Service không rõ ràng
```

**Quy tắc:**

- ✅ Mỗi feature có cấu trúc giống nhau
- ✅ Mỗi component có folder riêng (dễ tìm và mở rộng)
- ✅ File name = Export name (nếu có 1 export chính)

### 🤖 **4. Public API Pattern - Export rõ ràng**

AI cần biết gì được export để suggest import đúng.

```typescript
// ✅ GOOD: Public API rõ ràng
// features/dashboard-posts/index.ts
export { PostList } from "./components/PostList/PostList";
export { usePostController } from "./hooks/usePostController";
export type { Post, CreatePostDto } from "./types/post.types";

// ❌ BAD: Export mọi thứ, AI không biết dùng gì
export * from "./components";
export * from "./hooks";
export * from "./services";
```

**Quy tắc:**

- ✅ Chỉ export những gì cần thiết
- ✅ Export types riêng với `export type`
- ✅ Comment cho internal exports (nếu cần)

### 🤖 **5. Comments & Documentation - Mô tả rõ ràng**

AI đọc comments để hiểu context và suggest code phù hợp.

```typescript
// ✅ GOOD: Comments mô tả rõ ràng
/**
 * Fetches list of posts with optional filters
 * @param filters - Filter options (status, search, page)
 * @returns Query result with posts array
 */
export function usePostList(filters?: PostFilters) {
  // ...
}

// ❌ BAD: Không có comment hoặc comment không rõ
export function usePostList(filters?: any) {
  // Gets posts
}
```

**Quy tắc:**

- ✅ JSDoc cho functions phức tạp
- ✅ Inline comments cho logic không rõ ràng
- ✅ Mô tả "why" chứ không chỉ "what"

### 🤖 **6. Consistent Patterns - Patterns nhất quán**

AI học từ patterns. Patterns nhất quán giúp AI suggest code đúng style.

```typescript
// ✅ GOOD: Pattern nhất quán giữa các features
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

// ❌ BAD: Mỗi feature một pattern khác nhau
// Feature A: return object
// Feature B: return array
// Feature C: return nothing, mutate global state
```

**Quy tắc:**

- ✅ Controller hooks có structure giống nhau
- ✅ Service methods có naming convention giống nhau
- ✅ Components có props structure tương tự

### 🤖 **7. Import Paths - Đường dẫn rõ ràng**

AI cần biết import từ đâu. Path aliases rõ ràng giúp AI suggest đúng.

```typescript
// ✅ GOOD: Import paths rõ ràng với aliases
import { PostList } from "@/features/dashboard-posts";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/shared/services/api-client";

// ❌ BAD: Relative paths phức tạp
import { PostList } from "../../../features/dashboard-posts";
import { Button } from "../../../../components/ui/button";
```

**Quy tắc:**

- ✅ Dùng path aliases (`@/features`, `@/components`, `@/shared`)
- ✅ Import từ `index.ts` của feature (public API)
- ✅ Tránh relative paths quá sâu (`../../../`)

### 🤖 **8. Ví dụ Prompts tốt cho AI**

Khi làm việc với AI, sử dụng prompts rõ ràng và cụ thể:

**✅ GOOD Prompts:**

```
"Tạo feature mới cho page /admin/users với:
- Component UserList hiển thị danh sách users
- Hook useUserController để quản lý state
- Service userService với method getAll và create
- Types User, CreateUserDto, UserFilters"
```

```
"Thêm filter theo status vào feature dashboard-posts:
- Update PostFilters type để thêm status field
- Update usePostController để handle status filter
- Update PostFilters component để hiển thị status dropdown"
```

**❌ BAD Prompts:**

```
"Tạo user list"  // Quá mơ hồ
```

```
"Thêm filter"    // Không rõ filter gì, ở đâu
```

**Quy tắc cho prompts:**

- ✅ Specify feature name (theo route)
- ✅ Specify component/hook/service cần tạo/sửa
- ✅ Specify types cần thiết
- ✅ Reference existing patterns nếu có

### 🤖 **9. Code Organization - Tổ chức code logic**

AI hiểu code tốt hơn khi code được tổ chức logic.

```typescript
// ✅ GOOD: Code được tổ chức logic
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

// ❌ BAD: Code lộn xộn, khó follow
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

**Quy tắc:**

- ✅ Group related code together
- ✅ Order: imports → types → state → effects → handlers → return
- ✅ Blank lines giữa các sections

### 🤖 **10. Testing - Tests giúp AI hiểu expected behavior**

Tests là documentation tốt cho AI về expected behavior.

```typescript
// ✅ GOOD: Tests mô tả rõ behavior
describe("usePostController", () => {
  it("should filter posts by status", () => {
    // Test mô tả rõ: khi filter by status, chỉ return posts có status đó
  });

  it("should create post and refresh list", () => {
    // Test mô tả rõ: khi create post, list sẽ được refresh
  });
});
```

**Lợi ích:**

- AI hiểu expected behavior từ tests
- AI có thể suggest code phù hợp với tests
- Tests là documentation sống

---

## Checklist: Tối ưu Feature cho AI

Khi tạo feature mới, đảm bảo:

- [ ] ✅ Tên feature = route path (dễ tìm)
- [ ] ✅ Types đầy đủ, không dùng `any`
- [ ] ✅ Public API rõ ràng trong `index.ts`
- [ ] ✅ Naming conventions nhất quán
- [ ] ✅ Comments cho logic phức tạp
- [ ] ✅ Follow patterns của features khác
- [ ] ✅ Import từ path aliases, không dùng relative paths sâu
- [ ] ✅ Code được tổ chức logic (state → hooks → handlers → return)

---

## Responsive Design: PC vs SP variants

Đôi khi UI của PC và Mobile quá khác nhau, không thể dùng responsive CSS:

```typescript
features/dashboard-posts/
└── components/
    └── PostList/
        ├── PostList.tsx      # Main component (logic)
        ├── PostList.pc.tsx   # Desktop UI
        └── PostList.sp.tsx   # Mobile UI

// PostList.tsx
'use client'
import { useMediaQuery } from '@/shared/hooks/useMediaQuery'
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

**Quy tắc:**

- Test file cùng folder với implementation
- Tên: `*.test.ts` hoặc `*.test.tsx`
- Test độc lập, không phụ thuộc feature khác

---

## Những lưu ý quan trọng

### ✅ **Khi nào nên tạo feature mới?**

- ✅ **Khi có page (route) mới** - Mỗi page mới = 1 feature mới
- ✅ Khi có modal/dialog phức tạp (>200 dòng code) và không thuộc về page nào cụ thể
- ❌ Không tạo feature mới chỉ vì logic có thể tái sử dụng → Nên move logic đó sang `shared/` hoặc `components/`

### ✅ **Khi nào nên move sang shared?**

- Khi ≥ 2 features dùng chung
- Khi là utility thuần túy (không phụ thuộc business)
- Khi là UI component base

### ⚠️ **Tránh shared trở thành "bãi rác"**

```typescript
// ❌ BAD: Quá specific, không nên ở shared
shared / utils / formatPostTitle.ts;

// ✅ GOOD: Generic utility
shared / utils / formatText.ts;

// ✅ BETTER: Để trong feature
features / dashboard - posts / utils / formatPostTitle.ts;
```

### ⚠️ **Khi nào cần `_shared/` trong feature?**

Chỉ khi feature có ≥ 3 sub-features và có code dùng chung:

```
features/account/
├── _shared/              # ✅ Có ≥ 3 sub-features
│   └── services/
├── account-list/
├── account-detail/
└── account-settings/

features/simple-feature/
└── components/           # ❌ Không cần _shared
```

---

## Kết quả sau khi áp dụng

### 📊 Metrics cải thiện

**Trước khi áp dụng:**

- ⏱️ Onboarding: 2-3 tuần
- 🐛 Bug fix time: 4-8 giờ
- 🔍 Code review: 2-3 giờ
- 😰 Developer happiness: 3/10

**Sau khi áp dụng:**

- ⏱️ Onboarding: 3-5 ngày
- 🐛 Bug fix time: 1-2 giờ
- 🔍 Code review: 30 phút - 1 giờ
- 😊 Developer happiness: 8/10

### 💬 Feedback từ team

> "Giờ tôi không phải suy nghĩ nhiều về việc đặt code ở đâu. Follow pattern là xong!" - Junior Dev

> "Review code nhanh hơn rất nhiều. Chỉ cần check xem có follow structure không." - Tech Lead

> "Onboard người mới dễ hơn trước rất nhiều. Chỉ cần show 1 feature example là họ hiểu ngay." - Team Manager

### 🎯 Các vấn đề được giải quyết

✅ **Code nhất quán:** Mọi người code theo cùng một pattern
✅ **Tránh conflict:** Team làm việc parallel không đụng code nhau
✅ **Dễ testing:** Test từng feature độc lập
✅ **Dễ refactor:** Sửa 1 feature không ảnh hưởng feature khác
✅ **AI-friendly:** GitHub Copilot suggest code chính xác hơn 80%

---

## Nhược điểm và Trade-offs

Không có kiến trúc nào hoàn hảo. Đây là những điểm cần cân nhắc:

### ❌ **Over-engineering cho dự án nhỏ**

Nếu dự án có ≤ 10 màn hình, kiến trúc này có thể quá phức tạp. Stick với classic structure.

### ❌ **Quyết định "shared hay không?" mất thời gian ban đầu**

Đầu dự án, team sẽ mất thời gian tranh luận xem một utility có nên để shared không. Nhưng sau 2-3 tuần sẽ quen.

### ❌ **Folder depth sâu**

```
features/dashboard-posts/components/PostList/PostItem/PostItemActions.tsx
```

Đường dẫn dài, nhưng trade-off để có tổ chức rõ ràng.

### ⚠️ **Cần discipline cao**

Nếu team không follow rules, architecture này sẽ vô dụng. Cần:

- ESLint rules để enforce import hierarchy
- Code review chặt chẽ
- Documentation rõ ràng

---

## Checklist khi implement feature mới

```markdown
- [ ] Tạo folder feature với tên đúng convention (mỗi feature = 1 page/route)
- [ ] Tạo index.ts và export public API (chỉ export những gì cần thiết)
- [ ] Tách UI (components) và Logic (hooks/services)
- [ ] Service chỉ chứa API calls, không có business logic
- [ ] Types được định nghĩa rõ ràng trong types/
- [ ] Constants được tách riêng nếu cần
- [ ] Không import trực tiếp từ features khác
- [ ] Test files được đặt cùng folder với implementation
```

---

## Kết luận

Feature-Based Architecture là một giải pháp hiệu quả để tổ chức code cho các dự án NextJS quy mô lớn. Sau 2 năm áp dụng, chúng tôi đã thấy rõ những lợi ích:

### ✅ **Những gì đạt được:**

- **Code nhất quán:** Mọi developer follow cùng một pattern, dễ maintain và review
- **Parallel Development:** Team có thể làm việc song song mà không conflict
- **Dễ Onboarding:** Developer mới chỉ cần hiểu 1 feature, apply cho tất cả
- **AI-Friendly:** Cấu trúc nhất quán giúp AI Coding Assistant suggest code chính xác hơn 80%
- **Scale tốt:** Dễ dàng mở rộng và refactor từng feature độc lập

### 🎯 **Khi nào nên áp dụng:**

- ✅ Dự án có ≥ 20 màn hình
- ✅ Team có ≥ 3 developers
- ✅ Dự án dài hạn, cần maintain lâu dài
- ✅ Cần làm việc hiệu quả với AI Coding Assistant

### ⚠️ **Khi nào không nên:**

- ❌ Dự án nhỏ (≤ 10 màn hình) - Có thể quá phức tạp
- ❌ Prototype/MVP - Cần tốc độ hơn là tổ chức
- ❌ Team không có discipline - Cần enforce rules chặt chẽ

### 💡 **Lời khuyên:**

Kiến trúc này không phải "silver bullet" nhưng là một công cụ mạnh mẽ khi được áp dụng đúng cách. Quan trọng nhất là:

1. **Tuân thủ nguyên tắc:** Follow các rules một cách nghiêm ngặt
2. **Consistency:** Giữ cấu trúc nhất quán giữa các features
3. **Code Review:** Review để đảm bảo follow pattern
4. **Documentation:** Giữ documentation cập nhật

### 🚀 **Bước tiếp theo:**

Nếu bạn quyết định áp dụng kiến trúc này:

1. Bắt đầu với 1-2 features mới để team làm quen
2. Refactor features cũ dần dần (không cần refactor tất cả ngay)
3. Setup ESLint rules để enforce import hierarchy
4. Tạo template/boilerplate cho feature mới
5. Document patterns và best practices cho team

---

**Hi vọng bài viết này hữu ích cho bạn!** Nếu có câu hỏi hoặc góp ý, đừng ngần ngại chia sẻ. Chúc bạn xây dựng được một codebase sạch, dễ maintain và thân thiện với AI! 🎉
