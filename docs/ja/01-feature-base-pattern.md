# Next.js / React.js向けFeature-Driven Architecture: AIに優しく、保守可能でスケーラブルなコード整理

## はじめに

この記事では、**Feature-Driven Architecture** - Next.js/React.jsアプリケーション向けのAIに優しいフォルダアーキテクチャについて共有します。これは、私たちのチームが長年の開発で蓄積された問題を解決するために採用したものです。

Next.js/React.jsプロジェクトで、プロジェクトが徐々に拡大し、チームメンバーの数が不安定で、コードの整理に頭を悩ませており、AIコーディングアシスタント（Cursor AI、GitHub Copilot、Claude）と効果的に作業するために最適化したい場合は、この記事が役立つことを願っています。

このアーキテクチャは、特に以下の目的で設計されています：

- **明確なコード整理:** 各機能が1つのページに対応し、見つけやすく保守しやすい
- **AIに優しい:** 一貫した構造により、AIコーディングアシスタントがコードを理解し、80%以上の精度で提案できる
- **スケーラブル:** 数画面から80+画面、800+ファイルまでのプロジェクトに適している
- **オンボーディングが容易:** 新しい開発者は1つの機能を理解するだけで、すべてに適用できる

> **注意:** この記事はフォルダアーキテクチャとコード整理に焦点を当てており、State Managementや特定のライブラリについては深く掘り下げていません。

---

## 目次

1. [プロジェクトの背景](#プロジェクトの背景)
2. [使用技術](#使用技術)
3. [遭遇した問題](#遭遇した問題)
4. [なぜFeature-Based Patternを選んだのか？](#なぜfeature-based-patternを選んだのか)
5. [詳細なアーキテクチャ](#詳細なアーキテクチャ)
   - [全体構造](#-全体構造)
   - [各ディレクトリの詳細](#各ディレクトリの詳細)
6. [黄金の原則（必ず従うこと）](#黄金の原則必ず従うこと)
7. [コード例: Feature "Post List"](#コード例-feature-post-list)
8. [AIに優しいベストプラクティス](#aiに優しいベストプラクティス)
9. [レスポンシブデザイン: PC vs SP variants](#レスポンシブデザイン-pc-vs-sp-variants)
10. [テスト戦略](#テスト戦略)
11. [重要な注意事項](#重要な注意事項)
12. [適用後の結果](#適用後の結果)
13. [欠点とトレードオフ](#欠点とトレードオフ)
14. [新機能実装時のチェックリスト](#新機能実装時のチェックリスト)
15. [結論](#結論)

---

## プロジェクトの背景

私たちのプロジェクトは、**複数のクライアント向けのアウトソーシングシステム**で、以下の特徴があります：

- **規模:** 80+画面、800+ファイル
- **チームの特徴:** 人員が頻繁に変わるアウトソーシングチーム
- **要件:** 会社のテンプレートと厳格な受入プロセスに準拠する必要がある
- **新しい目標:** AIコーディングアシスタント（Cursor AI）と効果的に作業するための最適化

プロジェクトが始まった当初は、すべてがコンパクトで管理しやすかったです。しかし、4年間の継続的な開発の後、解決が必要な「技術的負債の山」に直面しました。

---

## 使用技術

プロジェクトでは以下の技術とライブラリを使用しています：

### コアフレームワーク

- **Next.js 15.5.4** - App RouterとTurbopackを備えたReactフレームワーク
- **React 19.1.0** - UIライブラリ
- **TypeScript 5.9.3** - 型安全性

### スタイリング

- **Tailwind CSS 4** - ユーティリティファーストのCSSフレームワーク
- **SASS 1.93.2** - CSSプリプロセッサ
- **Shadcn/ui** - Radix UI上に構築されたコンポーネントライブラリ
- **Radix UI** - スタイルなしのアクセシブルなコンポーネントプリミティブ

### ステート管理とデータフェッチング

- **TanStack Query (React Query) 5.90.2** - サーバーステート管理
- **Zustand 5.0.8** - クライアントステート管理
- **Axios 1.12.2** - HTTPクライアント

### フォーム

- **React Hook Form 7.63.0** - フォームステート管理

### コード品質管理

- **ESLint 9.36.0** - コードリンティング
- **Prettier 3.6.2** - コードフォーマット
- **Lefthook 1.11.1** - Gitフックマネージャー
- **Conventional Commits** - コミットメッセージ規約
- **Knip** - 未使用のファイル、依存関係、エクスポートを検出

### テストとドキュメント

- **Vitest 3.2.4** - ユニットテストフレームワーク
- **Storybook 9.1.10** - コンポーネントドキュメントとテスト
- **Playwright 1.55.1** - E2Eテスト

---

## 遭遇した問題

### 1. **開発者間のコードの一貫性の欠如**

典型的な例：

- 開発者Aはコンポーネント内にAPI呼び出しを配置
- 開発者Bは別のサービスを作成
- 開発者Cはカスタムフックを使用
- 開発者Dは上記3つのアプローチを混在

**結果:** バグ修正や機能追加の際、各人の「やり方」を理解するのに時間がかかりました。

### 2. **「巨大な」コンポーネント**

一部のコンポーネントファイルにはすべてが含まれていました：

- UIレンダリング
- ビジネスロジック
- API呼び出し
- ステート管理
- バリデーションロジック

1つのコンポーネントが**3000-5000行のコード**に達することもありました。小さな部分を修正するのは**ジェンガ**をプレイするようなものでした - 「1つのブロックを引くと、建物全体が崩れる」🏚️

### 3. **オンボーディングの困難**

新しい開発者が参加する際：

- コードベースに慣れるのに2-3週間かかる
- コードをどこに配置すべきかわからない
- なぜそのように行われたのかを理解せずに古いコードをコピー&ペースト
- さらなる一貫性の欠如を生み出す

### 4. **依存関係の混乱**

```typescript
// コンポーネントAがコンポーネントBをインポート
// コンポーネントBがコンポーネントAをインポート
import { PostItem } from "@/features/post/components/PostItem";
import { UserCard } from "@/features/user/components/UserCard";

// 🔥 循環依存の地獄
```

### 5. **テストとレビューの困難**

- テストをどこに書くべきかわからない
- コードレビューに時間がかかる（フロー全体を読み理解する必要があるため）
- 1箇所をリファクタリングすると、あらゆる場所に影響

---

## なぜFeature-Based Patternを選んだのか？

多くの会議と実験の後、**Feature-Based Pattern**を選択することにしました。理由は以下の通りです：

### ✅ **理由1: 明確な分離**

各機能は独立した「ミニアプリケーション」です。機能Aを修正しても機能Bには影響しません。

### ✅ **理由2: 並行開発**

チームはコードの競合なく、複数の機能で並行して作業できます。

### ✅ **理由3: オンボーディングが容易**

新しい開発者は1つの機能の構造を理解するだけで、すべてに適用できます。

### ✅ **理由4: スケーラビリティが良い**

後でmonorepoやマイクロフロントエンドに分割しやすい。

### ✅ **理由5: AIに優しい**

一貫した構造により、AI（GitHub Copilot、Cursor、Claude）がより正確なコードアシスタンスを提供できます。

---

## 詳細なアーキテクチャ

### 📁 全体構造

**原則:** `app/`内の各ページ（ルート）は`features/`内の1つの機能に対応します

```
src/
├── app/                    # Next.js App Router (ルーティング層)
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx     # ページ: /login
│   ├── dashboard/
│   │   └── page.tsx         # ページ: /dashboard
│   └── settings/
│       └── profile/
│           └── page.tsx      # ページ: /settings/profile
│
├── features/               # 🎯 アーキテクチャの核心（各機能 = 1ページ）
│   ├── auth-login/         # ← ページ /login の機能
│   ├── dashboard/          # ← ページ /dashboard の機能
│   └── settings-profile/   # ← ページ /settings/profile の機能
│
├── components/             # 🎨 共有UIコンポーネント
│   ├── ui/                # ベースコンポーネント（Shadcn/ui）
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── dialog.tsx
│   ├── composite/         # 複合コンポーネント
│   │   ├── data-table/
│   │   └── confirmation-dialog/
│   └── layouts/           # レイアウトコンポーネント
│       ├── main-layout.tsx
│       └── auth-layout.tsx
│
└── shared/                 # 🔧 共有リソース
    ├── utils/             # 純粋なユーティリティ
    ├── hooks/             # グローバルフック
    ├── services/          # APIクライアント、設定
    ├── types/             # グローバル型
    ├── constants/         # アプリ定数
    ├── config/            # 設定
    ├── stores/            # グローバルステート
    └── providers/         # Reactプロバイダー
```

---

## 各ディレクトリの詳細

### 1. `app/` - ルーティング層

ルーティングとコンポジションのみを含みます。**ビジネスロジックは含みません**。

```typescript
// app/dashboard/posts/page.tsx
import { PostList } from '@/features/dashboard-posts'

export default function PostsPage() {
  return <PostList />
}
```

**ルール:**

- ✅ `features/`からインポートしてコンポーズ
- ✅ レイアウト、メタデータ、エラーバウンダリを処理
- ❌ ビジネスロジックを含まない
- ❌ APIを直接呼び出さない

---

### 2. `features/` - アーキテクチャの核心

これは**最も重要な部分**です。各機能は1つのページ（ルート）に対応します。各機能は、そのページのすべてのロジックとUIを含む独立した単位です。

#### **機能の命名規則**

各機能はページ名（ルート）に合わせて設計されます。機能名 = ルーティングパス（`/`を`-`に置き換え、`[param]`を説明名に置き換え）

```
app/dashboard/posts/              → features/dashboard-posts/
app/dashboard/posts/[id]/        → features/dashboard-posts-detail/
app/dashboard/posts/[id]/edit/   → features/dashboard-posts-edit/
app/settings/profile/             → features/settings-profile/
app/admin/users/                  → features/admin-users/
app/users/[userId]/posts/         → features/users-posts/
```

**ルートのない機能（モーダル、サイドバー）の場合:**

```
features/modal-confirm-delete/
features/dialog-user-invite/
features/sidebar-navigation/
```

#### **機能内部の構造**

```typescript
features/dashboard-posts/
├── index.ts              # 📦 パブリックAPI（必須）
│
├── components/           # 🎨 UIコンポーネント
│   ├── PostList/
│   │   ├── PostList.tsx      # メインコンポーネント
│   │   ├── PostList.pc.tsx   # デスクトップバリアント（オプション）
│   │   └── PostList.sp.tsx   # モバイルバリアント（オプション）
│   ├── PostItem/
│   │   └── PostItem.tsx
│   └── PostFilters/
│       └── PostFilters.tsx
│
├── hooks/                # 🎮 カスタムフック（コントローラー層）
│   ├── usePostList.ts        # React Queryフック
│   ├── usePostCreate.ts      # ミューテーションフック
│   ├── usePostFilters.ts     # クライアントステートフック
│   └── usePostController.ts  # メインオーケストレーター
│
├── services/             # 🌐 API層
│   └── post.service.ts       # HTTP呼び出し
│
├── types/                # 📘 TypeScript型
│   └── post.types.ts
│
├── constants/            # 🔢 定数
│   └── post.constants.ts
│
└── stores/               # 💾 ローカルステート（オプション）
    └── post.store.ts         # Zustand/Context
```

**機能内で`stores/`を使用する場合：**

- ✅ 機能内の複数のコンポーネント間で共有する必要がある複雑なステート
- ✅ ステートを永続化する必要がある場合（localStorage、sessionStorage）
- ✅ ステートロジックが複雑すぎて、ReactステートやContextに適さない場合
- ❌ ステートが単純な場合は使用しない → コンポーネント/フック内で`useState`または`useReducer`を使用
- ❌ ステートが1つのコンポーネントでのみ使用される場合 → ローカル`useState`を使用

**例:**

```typescript
// ✅ ストアを使用すべき: 複雑なステート、複数のコンポーネント間で共有
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

// ❌ ストアは不要: 単純なステート、1つのコンポーネントでのみ使用
// features/dashboard-posts/components/PostItem.tsx
const [isExpanded, setIsExpanded] = useState(false); // ✅ これで十分
```

#### **`_shared/`フォルダ - 機能内の共有リソース**

**機能内で`_shared/`が必要な場合：**

機能に≥3つのサブ機能があり、サブ機能間で共有コードがある場合のみ。

例: 機能「アカウント管理」には複数の画面があります：

- アカウント一覧
- アカウント詳細
- アカウント設定
- アカウント権限

→ すべてが共有の`accountService`、`Account`型、`AccountCard`コンポーネントを使用
→ コードの重複を避けるために`_shared/`を作成すべき

```
features/account/
├── _shared/                    # サブ機能間で共有
│   ├── components/
│   │   └── AccountCard/        # 複数のサブ機能で使用
│   ├── hooks/
│   ├── services/
│   │   ├── account.service.ts  # 共有API呼び出し
│   │   └── accountApi.ts
│   ├── types/
│   │   └── account.types.ts    # 共有型
│   └── constants/
│
├── account-list/               # サブ機能1
│   ├── components/
│   ├── hooks/
│   └── index.ts
│
├── account-detail/             # サブ機能2
│   ├── components/
│   ├── hooks/
│   └── index.ts
│
└── account-settings/           # サブ機能3
    ├── components/
    ├── hooks/
    └── index.ts
```

**注意:** サブ機能が1-2つしかない場合、`_shared/`は不要です。コードを重複させるか、共有コードをより高いレベルに移動してください。

---

### 3. `components/` - 共有UIコンポーネント

```
components/
├── ui/                    # ベースコンポーネント（Shadcn/uiから）
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── composite/             # 複合コンポーネント
│   ├── data-table/
│   │   ├── data-table.tsx
│   │   ├── data-table-header.tsx
│   │   └── data-table-pagination.tsx
│   ├── confirmation-dialog/
│   └── empty-state/
│
└── layouts/               # レイアウトコンポーネント
    ├── main-layout.tsx
    ├── auth-layout.tsx
    └── dashboard-layout.tsx
```

**ルール:**

- ≥2つの機能で使用されるUIコンポーネントのみを含む
- ビジネスロジックを含まない
- 必要に応じてContainer/Presentationパターンを使用

**コンポーネントを`features/`から`components/`に移動する場合：**

- ✅ コンポーネントが≥2つの機能で使用される場合
- ✅ コンポーネントにビジネスロジックがない場合（純粋なUI）
- ✅ コンポーネントが多くの異なるコンテキストで再利用できる場合
- ❌ コンポーネントにその機能固有のロジックがある場合は移動しない
- ❌ 1つの機能でのみ使用される場合は移動しない（後で再利用できる可能性があっても）

**例:**

```typescript
// ✅ components/に移動すべき
// features/dashboard-posts/components/PostCard.tsx
// → components/composite/post-card/PostCard.tsx
// 理由: PostCardはdashboard-posts、user-posts、search-postsで使用される

// ❌ 移動すべきではない
// features/dashboard-posts/components/PostListWithFilters.tsx
// 理由: dashboard-posts固有のフィルターロジックがある
```

---

### 4. `shared/` - グローバルユーティリティ

```
shared/
├── utils/                 # 純粋なユーティリティ
│   ├── format.ts         # formatCurrency、formatDate
│   ├── validation.ts     # バリデーションヘルパー
│   └── array.ts          # 配列ユーティリティ
│
├── hooks/                 # グローバルカスタムフック
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useLocalStorage.ts
│
├── services/              # API設定
│   ├── api-client.ts     # Axios/Fetch設定
│   ├── auth.service.ts   # グローバル認証
│   └── upload.service.ts
│
├── types/                 # グローバル型
│   ├── api.types.ts
│   ├── common.types.ts
│   └── env.d.ts
│
├── constants/             # アプリ全体の定数
│   ├── routes.ts
│   ├── config.ts
│   └── regex.ts
│
├── stores/                # グローバルステート
│   ├── auth.store.ts     # Zustandストア
│   └── theme.store.ts
│
└── providers/             # Reactプロバイダー
    ├── query-provider.tsx
    ├── theme-provider.tsx
    └── auth-provider.tsx
```

**`shared/services/`のルール：**

- ✅ APIクライアント設定のみを含む（axiosインスタンス、インターセプター、ベース設定）
- ✅ ビジネスドメインに依存しないグローバルサービスを含む（認証、アップロード、通知）
- ❌ 特定の機能固有のビジネスロジックを含まない
- ❌ 特定のドメインのAPI呼び出しを含まない（例：`postService`、`userService`）

**例:**

```typescript
// ✅ 正しい: APIクライアント設定
// shared/services/api-client.ts
export const apiClient = axios.create({ baseURL: "/api" });

// ✅ 正しい: ドメインに依存しないグローバルサービス
// shared/services/auth.service.ts
export const authService = {
  login: (credentials) => apiClient.post("/auth/login", credentials),
  logout: () => apiClient.post("/auth/logout"),
};

// ❌ 間違い: 特定のビジネスロジック
// shared/services/post.service.ts  ← features/dashboard-posts/services/にあるべき
```

**`shared/stores/`のルール：**

- ✅ グローバルステートのみを含む（認証、テーマ、アプリ設定）
- ❌ 特定の機能固有のステートを含まない
- ステートが1つの機能でのみ使用される場合 → `features/[feature]/stores/`に配置

---

## 黄金の原則（必ず従うこと）

### 🚨 **ルール0: 各機能 = 1ページ**

**最も基本的な原則:** 各機能はアプリケーション内の1つのページ（ルート）に対応します。

```
app/dashboard/posts/page.tsx          → features/dashboard-posts/
app/settings/profile/page.tsx         → features/settings-profile/
app/admin/users/page.tsx              → features/admin-users/
```

**ルール:**

- ✅ 新しいページ = 新しい機能を作成
- ✅ 機能名 = ルーティングパス（`/`を`-`に置き換え）
- ❌ 同じページに対して複数の機能を作成しない
- ❌ 対応するページのない機能を作成しない（複雑なモーダル/ダイアログを除く）

**利点:**

- コードを見つけやすい: ページがわかれば機能がわかる
- 明確な組織: 1ページ = 1機能 = 1つの独立した単位
- 混乱を避ける: 「この機能はどのページに属するか？」を考える必要がない

### 🚨 **ルール1: インポート階層**

```
┌─────────────────┐
│   app/pages     │ ← コンポジション層
└────────┬────────┘
         ↓ ✅ 許可
┌─────────────────┐
│   features/     │ ← ビジネス機能
└────────┬────────┘
         ↓ ✅ 許可
┌─────────────────┐
│   shared/       │ ← ユーティリティ
│   components/  │
└─────────────────┘
```

**ルール:**

- ❌ `shared/`と`components/`は`features/`からインポートできない
- ❌ `features/`は他の`features/`からインポートできない
- ✅ `app/`はすべてをインポートできる
- ✅ `features/`は`shared/`と`components/`からのみインポートできる
- ✅ `shared/`は外部ライブラリ（React、axiosなど）からのみインポートでき、`features/`や`components/`からはインポートできない

### 🚨 **ルール2: パブリックAPIパターン**

各機能は**必須で**`index.ts`を持ち、パブリックAPIをエクスポートする必要があります：

```typescript
// features/dashboard-posts/index.ts

// ✅ 必要なものをエクスポート
export { PostList } from "./components/PostList/PostList";
export { PostDetail } from "./components/PostDetail/PostDetail";
export { usePostController } from "./hooks/usePostController";

// ✅ 外部で使用する必要がある場合は型をエクスポート
export type { Post, CreatePostDto, PostFilters } from "./types/post.types";

// ❌ 実装の詳細をエクスポートしない
// export { PostItem } from './components/PostItem'
// export { postService } from './services/post.service'
// export { usePostList } from './hooks/usePostList'  // 内部フック
```

**利点:**

- 外部で使用されるものを制御できる
- 内部コードをリファクタリングしやすい
- 循環依存を避けられる

### 🚨 **ルール3: 機能間の直接インポート禁止**

**機能間の直接インポートは絶対に禁止です。例外はありません。**

```typescript
// ❌ 絶対にこれをしない - 絶対に禁止
// features/dashboard-posts/hooks/usePostList.ts
import { useUserProfile } from '@/features/settings-profile/hooks/useUserProfile'
import { UserCard } from '@/features/settings-profile/components/UserCard'
import { userService } from '@/features/settings-profile/services/user.service'

// ✅ これを行う: ≥2つの機能で使用される場合はsharedに移動
// shared/hooks/useUserProfile.ts
export function useUserProfile() { ... }

// 両方の機能がsharedからインポート
import { useUserProfile } from '@/hooks/useUserProfile'
```

**経験則:**

- ❌ **決して**機能間で直接インポートしない
- ✅ ≥2つの機能で使用される場合 → `shared/`に移動
- ✅ 1つの機能でのみ使用される場合 → その機能内に保持
- ✅ 他の機能のロジックを使用する必要がある場合 → そのロジックを`shared/`に移動するようにリファクタリング

**利点:**

- 循環依存を避ける
- 機能を完全に独立させる
- リファクタリングとメンテナンスが容易

### 🚨 **ルール4: UIとロジックの分離**

```typescript
// ❌ 悪い例: ロジックがコンポーネントに混在
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

// ✅ 良い例: 明確に分離
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

### 🚨 **ルール5: 必須の機能構造**

各機能は**必須で**以下の構造を持つ必要があります：

```
features/dashboard-posts/
├── index.ts              # 📦 必須 - パブリックAPI
├── components/           # 🎨 UIコンポーネント
├── hooks/                # 🎮 カスタムフック（コントローラー層）
├── services/             # 🌐 API層
├── types/                # 📘 TypeScript型
└── constants/            # 🔢 定数（オプション）
```

**ルール:**

- ✅ **必須:** `index.ts` - パブリックAPIをエクスポート
- ✅ **必須:** `components/` - 機能のUIコンポーネント
- ✅ **必須:** `hooks/` - ロジックとステート管理
- ✅ **必須:** `services/` - API呼び出し
- ✅ **必須:** `types/` - TypeScript型
- ⚪ **オプション:** `constants/` - 必要な場合のみ
- ⚪ **オプション:** `stores/` - 複雑なステートが必要な場合のみ

**最小構造の例:**

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

**利点:**

- 機能間で一貫した構造
- コードを見つけやすい: 必要なものがわかれば場所がわかる
- オンボーディングが容易: 新しい開発者がすぐに構造を理解できる

---

## コード例: Feature "Post List"

完全な機能の完全な例：

### 1. **型**

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

### 2. **サービス層**

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

### 3. **フック層**

```typescript
// features/dashboard-posts/hooks/usePostList.ts

import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/post.service";
import type { PostFilters } from "../types/post.types";

export function usePostList(filters?: PostFilters) {
  return useQuery({
    queryKey: ["posts", filters],
    queryFn: () => postService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5分
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

### 4. **コンポーネント層**

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
    return <div>読み込み中...</div>
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

      <Button onClick={() => createPost({ title: '新規', content: '' })}>
        投稿を作成
      </Button>
    </div>
  )
}
```

### 5. **パブリックAPI**

```typescript
// features/dashboard-posts/index.ts

export { PostList } from "./components/PostList/PostList";
export { usePostController } from "./hooks/usePostController";

export type { Post, CreatePostDto, PostFilters } from "./types/post.types";
```

### 6. **ページでの使用**

```typescript
// app/dashboard/posts/page.tsx

import { PostList } from '@/features/dashboard-posts'

export default function PostsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">投稿</h1>
      <PostList />
    </div>
  )
}
```

---

## AIに優しいベストプラクティス

この構造をAIコーディングアシスタント（Cursor、GitHub Copilot、Claude）向けに最適化するには、以下のベストプラクティスに従ってください：

### 🤖 **1. 命名規則 - 明確で一貫した命名**

AIは名前に基づいてコンテキストを理解します。明確な命名により、AIがより正確にコードを提案できます。

```typescript
// ✅ 良い例: 機能を正確に説明する明確な名前
export function usePostListController() { ... }
export function PostListFilters() { ... }
export const postService = { ... }

// ❌ 悪い例: 曖昧な名前、AIが理解しにくい
export function useController() { ... }
export function Filters() { ... }
export const service = { ... }
```

**ルール:**

- ✅ フックには`use`をプレフィックス（React規約）
- ✅ サービスにはドメイン名をプレフィックス（`postService`、`userService`）
- ✅ コンポーネント: PascalCase、機能を明確に説明
- ✅ ファイル: kebab-case、ファイル名 = メインエクスポート名（該当する場合）

### 🤖 **2. 型定義 - 完全な型定義**

AIは完全な型情報がある場合、コードをよりよく理解します。

```typescript
// ✅ 良い例: 明確で完全な型
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

// ❌ 悪い例: 型が欠落、AIが推測する必要がある
export function usePostList(filters?: any) {
  // ...
}
```

**ルール:**

- ✅ props、params、戻り値の型を常に定義
- ✅ 外部で使用する必要がある場合は`index.ts`で型をエクスポート
- ✅ オブジェクトには`interface`、ユニオン/インターセクションには`type`を使用
- ❌ `any`を避け、本当に必要な場合は`unknown`を使用

### 🤖 **3. ファイル構造 - 予測可能な構造**

AIはフォルダ構造に基づいてコードを見つけます。一貫した構造により、AIが正しいファイルを提案できます。

```
✅ 良い例: 一貫した構造
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

❌ 悪い例: 一貫性のない構造
features/dashboard-posts/
├── PostList.tsx          # ルートにコンポーネント
├── hooks.ts              # すべてのフックを1つのファイルに
└── api.ts                # 不明確なサービス
```

**ルール:**

- ✅ 各機能が同じ構造を持つ
- ✅ 各コンポーネントが独自のフォルダを持つ（見つけやすく拡張しやすい）
- ✅ ファイル名 = エクスポート名（メインエクスポートが1つある場合）

### 🤖 **4. パブリックAPIパターン - 明確なエクスポート**

AIは何がエクスポートされているかを知る必要があります。

```typescript
// ✅ 良い例: 明確なパブリックAPI
// features/dashboard-posts/index.ts
export { PostList } from "./components/PostList/PostList";
export { usePostController } from "./hooks/usePostController";
export type { Post, CreatePostDto } from "./types/post.types";

// ❌ 悪い例: すべてをエクスポート、AIが何を使用すべきかわからない
export * from "./components";
export * from "./hooks";
export * from "./services";
```

**ルール:**

- ✅ 必要なもののみをエクスポート
- ✅ `export type`で型を個別にエクスポート
- ✅ 内部エクスポートにコメント（必要な場合）

### 🤖 **5. コメントとドキュメント - 明確な説明**

AIはコメントを読んでコンテキストを理解し、適切なコードを提案します。

```typescript
// ✅ 良い例: 明確なコメント
/**
 * オプションのフィルターで投稿リストを取得
 * @param filters - フィルターオプション（ステータス、検索、ページ）
 * @returns 投稿配列を含むクエリ結果
 */
export function usePostList(filters?: PostFilters) {
  // ...
}

// ❌ 悪い例: コメントがないか不明確
export function usePostList(filters?: any) {
  // 投稿を取得
}
```

**ルール:**

- ✅ 複雑な関数にはJSDoc
- ✅ 不明確なロジックにはインラインコメント
- ✅ 「何を」だけでなく「なぜ」を説明

### 🤖 **6. 一貫したパターン - 一貫したパターン**

AIはパターンから学習します。一貫したパターンにより、AIが正しいスタイルでコードを提案できます。

```typescript
// ✅ 良い例: 機能間で一貫したパターン
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

// ❌ 悪い例: 各機能が異なるパターン
// 機能A: オブジェクトを返す
// 機能B: 配列を返す
// 機能C: 何も返さず、グローバルステートを変更
```

**ルール:**

- ✅ コントローラーフックが同じ構造を持つ
- ✅ サービスメソッドが同じ命名規則を持つ
- ✅ コンポーネントが類似したprops構造を持つ

### 🤖 **7. インポートパス - 明確なパス**

AIはどこからインポートするかを知る必要があります。明確なパスエイリアスにより、AIが正しく提案できます。

```typescript
// ✅ 良い例: エイリアス付きの明確なインポートパス
import { PostList } from "@/features/dashboard-posts";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/shared/services/api-client";

// ❌ 悪い例: 複雑な相対パス
import { PostList } from "../../../features/dashboard-posts";
import { Button } from "../../../../components/ui/button";
```

**ルール:**

- ✅ パスエイリアスを使用（`@/features`、`@/components`、`@/shared`）
- ✅ 機能の`index.ts`からインポート（パブリックAPI）
- ✅ 深すぎる相対パスを避ける（`../../../`）

### 🤖 **8. AI向けの良いプロンプト例**

AIと作業する際は、明確で具体的なプロンプトを使用してください：

**✅ 良いプロンプト:**

```
"ページ /admin/users の新しい機能を作成:
- ユーザーリストを表示するUserListコンポーネント
- ステートを管理するuseUserControllerフック
- getAllとcreateメソッドを持つuserService
- 型 User、CreateUserDto、UserFilters"
```

```
"dashboard-posts機能にステータスフィルターを追加:
- PostFilters型にステータスフィールドを追加するように更新
- usePostControllerをステータスフィルターを処理するように更新
- PostFiltersコンポーネントをステータスドロップダウンを表示するように更新"
```

**❌ 悪いプロンプト:**

```
"ユーザーリストを作成"  // 曖昧すぎる
```

```
"フィルターを追加"    // どのフィルターか、どこか不明確
```

**プロンプトのルール:**

- ✅ 機能名を指定（ルート別）
- ✅ 作成/修正するコンポーネント/フック/サービスを指定
- ✅ 必要な型を指定
- ✅ 既存のパターンがあれば参照

### 🤖 **9. コード組織 - 論理的なコード組織**

AIはコードが論理的に組織されている場合、コードをよりよく理解します。

```typescript
// ✅ 良い例: 論理的に組織されたコード
export function usePostController() {
  // 1. ステート宣言
  const [filters, setFilters] = useState<PostFilters>({});

  // 2. データフェッチングフック
  const { data: posts, isLoading } = usePostList(filters);

  // 3. ミューテーションフック
  const { mutate: createPost } = usePostCreate();

  // 4. ハンドラー
  const handleFilterChange = (newFilters: Partial<PostFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // 5. 戻り値
  return {
    posts,
    isLoading,
    filters,
    setFilters: handleFilterChange,
    createPost,
  };
}

// ❌ 悪い例: 乱雑なコード、追跡が困難
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

**ルール:**

- ✅ 関連するコードをグループ化
- ✅ 順序: インポート → 型 → ステート → エフェクト → ハンドラー → 戻り値
- ✅ セクション間に空行

### 🤖 **10. テスト - テストはAIが期待される動作を理解するのに役立つ**

テストは、AIにとって期待される動作に関する優れたドキュメントです。

```typescript
// ✅ 良い例: 動作を明確に説明するテスト
describe("usePostController", () => {
  it("ステータスで投稿をフィルタリングする必要がある", () => {
    // テストは明確に説明: ステータスでフィルタリングする場合、そのステータスの投稿のみを返す
  });

  it("投稿を作成してリストを更新する必要がある", () => {
    // テストは明確に説明: 投稿を作成する場合、リストが更新される
  });
});
```

**利点:**

- AIはテストから期待される動作を理解する
- AIはテストに適合するコードを提案できる
- テストは生きたドキュメント

---

## チェックリスト: AI向けに機能を最適化

新しい機能を作成する際は、以下を確認してください：

- [ ] ✅ 機能名 = ルートパス（見つけやすい）
- [ ] ✅ 完全な型、`any`を使用しない
- [ ] ✅ `index.ts`に明確なパブリックAPI
- [ ] ✅ 一貫した命名規則
- [ ] ✅ 複雑なロジックにコメント
- [ ] ✅ 他の機能のパターンに従う
- [ ] ✅ パスエイリアスからインポート、深い相対パスを使用しない
- [ ] ✅ コードが論理的に組織されている（ステート → フック → ハンドラー → 戻り値）

---

## レスポンシブデザイン: PC vs SP variants

PCとモバイルのUIが大きく異なり、レスポンシブCSSを使用できない場合があります：

```typescript
features/dashboard-posts/
└── components/
    └── PostList/
        ├── PostList.tsx      # メインコンポーネント（ロジック）
        ├── PostList.pc.tsx   # デスクトップUI
        └── PostList.sp.tsx   # モバイルUI

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

## テスト戦略

```
features/dashboard-posts/
├── components/
│   └── PostList/
│       ├── PostList.tsx
│       └── PostList.test.tsx      # コンポーネントテスト
├── hooks/
│   └── usePostController.ts
│       └── usePostController.test.ts  # フックテスト
└── services/
    └── post.service.ts
        └── post.service.test.ts    # サービステスト
```

**ルール:**

- テストファイルは実装と同じフォルダに配置
- 名前: `*.test.ts`または`*.test.tsx`
- テストは独立しており、他の機能に依存しない

---

## 重要な注意事項

### ✅ **新しい機能をいつ作成すべきか？**

- ✅ **新しいページ（ルート）がある場合** - 新しいページ = 1つの新しい機能
- ✅ 複雑なモーダル/ダイアログ（>200行のコード）があり、特定のページに属さない場合
- ❌ ロジックを再利用できるという理由だけで新しい機能を作成しない → そのロジックを`shared/`または`components/`に移動すべき

### ✅ **いつsharedに移動すべきか？**

- ≥2つの機能で一緒に使用される場合
- 純粋なユーティリティである場合（ビジネスに依存しない）
- ベースUIコンポーネントである場合

### ⚠️ **sharedが「ゴミ捨て場」になることを避ける**

```typescript
// ❌ 悪い例: 特定すぎる、sharedにあるべきではない
shared / utils / formatPostTitle.ts;

// ✅ 良い例: 汎用ユーティリティ
shared / utils / formatText.ts;

// ✅ より良い: 機能内に保持
features / dashboard - posts / utils / formatPostTitle.ts;
```

### ⚠️ **機能内で`_shared/`が必要な場合**

機能に≥3つのサブ機能があり、共有コードがある場合のみ：

```
features/account/
├── _shared/              # ✅ ≥3つのサブ機能がある
│   └── services/
├── account-list/
├── account-detail/
└── account-settings/

features/simple-feature/
└── components/           # ❌ _sharedは不要
```

---

## 適用後の結果

### 📊 改善されたメトリクス

**適用前:**

- ⏱️ オンボーディング: 2-3週間
- 🐛 バグ修正時間: 4-8時間
- 🔍 コードレビュー: 2-3時間
- 😰 開発者の満足度: 3/10

**適用後:**

- ⏱️ オンボーディング: 3-5日
- 🐛 バグ修正時間: 1-2時間
- 🔍 コードレビュー: 30分 - 1時間
- 😊 開発者の満足度: 8/10

### 💬 チームからのフィードバック

> "コードをどこに配置すべきか考える必要がなくなりました。パターンに従うだけです！" - ジュニア開発者

> "コードレビューがはるかに速くなりました。構造に従っているかチェックするだけです。" - テックリード

> "新しいメンバーのオンボーディングがはるかに簡単になりました。1つの機能例を見せるだけで、すぐに理解できます。" - チームマネージャー

### 🎯 解決された問題

✅ **一貫したコード:** 全員が同じパターンに従ってコードを書く
✅ **競合を避ける:** チームが並行して作業してもコードの競合がない
✅ **テストが容易:** 各機能を独立してテスト
✅ **リファクタリングが容易:** 1つの機能を修正しても他の機能に影響しない
✅ **AIに優しい:** GitHub Copilotが80%以上の精度でコードを提案

---

## 欠点とトレードオフ

完璧なアーキテクチャはありません。以下は考慮すべき点です：

### ❌ **小規模プロジェクトには過剰設計**

プロジェクトに≤10画面がある場合、このアーキテクチャは複雑すぎる可能性があります。クラシックな構造に固執してください。

### ❌ **「sharedかどうか？」の決定に初期時間がかかる**

プロジェクトの開始時、チームはユーティリティをsharedに配置すべきかどうか議論する時間を費やします。しかし、2-3週間後には自然になります。

### ❌ **フォルダの深さ**

```
features/dashboard-posts/components/PostList/PostItem/PostItemActions.tsx
```

パスが長いですが、明確な組織化のためのトレードオフです。

### ⚠️ **高い規律が必要**

チームがルールに従わない場合、このアーキテクチャは無意味になります。以下が必要です：

- インポート階層を強制するESLintルール
- 厳格なコードレビュー
- 明確なドキュメント

---

## 新機能実装時のチェックリスト

```markdown
- [ ] 正しい命名規則で機能フォルダを作成（各機能 = 1ページ/ルート）
- [ ] index.tsを作成し、パブリックAPIをエクスポート（必要なもののみ）
- [ ] UI（コンポーネント）とロジック（フック/サービス）を分離
- [ ] サービスはAPI呼び出しのみを含み、ビジネスロジックを含まない
- [ ] types/で型を明確に定義
- [ ] 必要に応じて定数を分離
- [ ] 他の機能から直接インポートしない
- [ ] テストファイルを実装と同じフォルダに配置
```

---

## 結論

Feature-Based Architectureは、大規模なNextJSプロジェクトのコードを整理するための効果的なソリューションです。4年間の適用後、以下の利点が明確になりました：

### ✅ **達成したこと：**

- **一貫したコード:** すべての開発者が同じパターンに従い、保守とレビューが容易
- **並行開発:** チームは競合なく並行して作業可能
- **オンボーディングが容易:** 新しい開発者は1つの機能を理解するだけで、すべてに適用可能
- **AIに優しい:** 一貫した構造により、AIコーディングアシスタントが80%以上の精度でコードを提案
- **スケーラビリティ:** 各機能を独立して拡張およびリファクタリングが容易

### 🎯 **適用すべき場合：**

- ✅ プロジェクトに≥20画面がある場合
- ✅ チームに≥3人の開発者がいる場合
- ✅ 長期的なプロジェクトで、長期間の保守が必要な場合
- ✅ AIコーディングアシスタントと効果的に作業する必要がある場合

### ⚠️ **適用すべきでない場合：**

- ❌ 小規模プロジェクト（≤10画面） - 複雑すぎる可能性がある
- ❌ プロトタイプ/MVP - 組織化よりも速度が必要
- ❌ 規律のないチーム - ルールを厳格に強制する必要がある

### 💡 **アドバイス：**

このアーキテクチャは「銀の弾丸」ではありませんが、正しく適用されれば強力なツールです。最も重要なのは：

1. **原則の遵守:** ルールを厳格に守る
2. **一貫性:** 機能間で一貫した構造を維持
3. **コードレビュー:** パターンに従っていることを確認するためのレビュー
4. **ドキュメント:** ドキュメントを最新の状態に保つ

### 🚀 **次のステップ：**

このアーキテクチャを適用することを決定した場合：

1. チームが慣れるために1-2つの新機能から始める
2. 古い機能を徐々にリファクタリング（すべてを一度にリファクタリングする必要はない）
3. インポート階層を強制するESLintルールを設定
4. 新機能用のテンプレート/ボイラープレートを作成
5. チーム向けにパターンとベストプラクティスを文書化

---

**この記事が皆様のお役に立てれば幸いです！** ご質問やご意見がございましたら、お気軽に共有してください。クリーンで保守しやすく、AIに優しいコードベースの構築を願っています！ 🎉

---

## プロジェクトリポジトリの取得

このアーキテクチャの完全な実装を探索したい場合は、**コメント欄にGitHubのユーザー名を残してください**。リポジトリのリンクをお送りしますので、コードベースを研究したり、貢献したり、自分のプロジェクトの参考にしたりできます。

**注記:** リポジトリには、このFeature-Driven Architectureを使用した完全に設定されたNext.jsプロジェクト、完全な例、およびこの記事で言及されているすべてのベストプラクティスが含まれています。

また、コメント欄にGitHubのユーザー名を残していただければ、サンプルリポジトリをお送りします。
