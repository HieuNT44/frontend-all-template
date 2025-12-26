import type {
  Authentication,
  CMS,
  CSS,
  Database,
  Experimentation,
  Framework,
  Template,
  UseCase,
} from "../types/template.types";

export const USE_CASES: UseCase[] = [
  "AI",
  "Starter",
  "Ecommerce",
  "SaaS",
  "Blog",
  "Portfolio",
  "CMS",
  "Backend",
  "Edge Functions",
  "Edge Middleware",
  "Edge Config",
  "Cron",
  "Multi-Tenant Apps",
  "Realtime Apps",
  "Documentation",
  "Virtual Event",
  "Monorepos",
  "Web3",
  "Vercel Firewall",
  "Microfrontends",
  "Authentication",
  "Marketing Sites",
  "CDN",
];
export const FRAMEWORKS: Framework[] = [
  "Next.js",
  "React",
  "Vue",
  "Svelte",
  "Angular",
  "Remix",
  "NuxtJS",
  "NestJS",
  "Express JS",
  "Extension Chrome",
];
export const CSS_OPTIONS: CSS[] = [
  "MUI",
  "TailwindCSS",
  "Shadcn",
  "Ant Design",
  "Charka UI",
];
export const DATABASES: Database[] = [
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "SQLite",
  "Supabase",
  "PlanetScale",
];
export const AUTHENTICATION_OPTIONS: Authentication[] = [
  "NextAuth.js",
  "Clerk",
  "Auth0",
  "Supabase Auth",
  "Firebase Auth",
];
export const CMS_OPTIONS: CMS[] = ["Strapi", "WordPress"];
export const EXPERIMENTATION_OPTIONS: Experimentation[] = [
  "Vercel Edge Config",
  "LaunchDarkly",
  "Split.io",
];

// Mock data - will be replaced with API calls later
const DEFAULT_THUMBNAIL =
  "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1aHobcZ8H6WY48u5CMXlOe%2F0f0efe6bd469985b692555fbcad1cc01%2Fnextjs-template.png&w=640&q=75";

export const MOCK_TEMPLATES: Template[] = [
  {
    id: "1",
    title: "Next.js Boilerplate",
    description: "Get started with Next.js and React in seconds.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Starter"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
    githubRepo: "https://github.com/TOMOSIA-VIETNAM",
    demoUrl: "https://nextjs.org",
    technologies: {
      en: `Core Framework

Next.js 15.5.4 - React framework with App Router and Turbopack
React 19.1.0 - UI library
TypeScript 5.9.3 - Type safety

Styling

Tailwind CSS 4 - Utility-first CSS framework
SASS 1.93.2 - CSS preprocessor
Shadcn/ui - Component library built on Radix UI
Radix UI - Unstyled accessible component primitives

State Management & Data Fetching

TanStack Query (React Query) 5.90.2 - Server state management
Zustand 5.0.8 - Client state management
Axios 1.12.2 - HTTP client

Forms

React Hook Form 7.63.0 - Form state management

Code Quality

ESLint 9.36.0 - Code linting
Prettier 3.6.2 - Code formatting
Husky 9.1.7 - Git hooks
lint-staged 16.2.3 - Run linter on staged files
Conventional Commits - Commit message convention
Knip - Detect unused files, dependencies, and exports

Testing & Documentation

Vitest 3.2.4 - Unit testing framework
Storybook 9.1.10 - Component documentation and testing
Playwright 1.55.1 - E2E testing`,
      ja: `コアフレームワーク

Next.js 15.5.4 - App RouterとTurbopackを備えたReactフレームワーク
React 19.1.0 - UIライブラリ
TypeScript 5.9.3 - 型安全性

スタイリング

Tailwind CSS 4 - ユーティリティファーストのCSSフレームワーク
SASS 1.93.2 - CSSプリプロセッサ
Shadcn/ui - Radix UI上に構築されたコンポーネントライブラリ
Radix UI - スタイルなしのアクセシブルなコンポーネントプリミティブ

ステート管理とデータフェッチング

TanStack Query (React Query) 5.90.2 - サーバーステート管理
Zustand 5.0.8 - クライアントステート管理
Axios 1.12.2 - HTTPクライアント

フォーム

React Hook Form 7.63.0 - フォームステート管理

コード品質管理

ESLint 9.36.0 - コードリンティング
Prettier 3.6.2 - コードフォーマット
Husky 9.1.7 - Gitフック
lint-staged 16.2.3 - ステージングされたファイルでリンターを実行
Conventional Commits - コミットメッセージ規約
Knip - 未使用のファイル、依存関係、エクスポートを検出

テストとドキュメント

Vitest 3.2.4 - ユニットテストフレームワーク
Storybook 9.1.10 - コンポーネントドキュメントとテスト
Playwright 1.55.1 - E2Eテスト`,
    },
  },
  {
    id: "2",
    title: "Image Gallery Starter",
    description: "An image gallery built on Next.js and Cloudinary.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Starter"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "3",
    title: "Next.js AI Chatbot",
    description: "A full-featured, hackable Next.js AI chatbot built by Vercel",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["AI"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "4",
    title: "Nextra: Docs Starter Kit",
    description:
      "Simple, powerful and flexible markdown-powered docs site. Built with Next.js.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Documentation"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "5",
    title: "Express on Bun",
    description: "Deploy Express backends using the Bun runtime.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Backend"],
    frameworks: ["Express JS"],
  },
  {
    id: "6",
    title: "Hono on Bun",
    description: "Deploy Hono backends using the Bun runtime.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Backend"],
    frameworks: ["Express JS"],
  },
  {
    id: "7",
    title: "Hume AI - Empathic Voice Interface Starter",
    description:
      "This template creates a voice chat using Hume AI's Empathic Voice Interface.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["AI"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "8",
    title: "Next.js Commerce",
    description: "Starter kit for high-performance commerce with Shopify.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Ecommerce"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "9",
    title: "Lead Agent",
    description:
      "An inbound lead qualification and research agent built with Next.js, AI SDK, Workflow DevKit, and the Vercel Slack Adapter.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["AI"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "10",
    title: "Next.js App Router Playground",
    description: "Examples of many Next.js App Router features.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Starter"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "11",
    title: "Platforms Starter Kit",
    description:
      "Next.js template for building multi-tenant applications with the App Router and Redis.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Multi-Tenant Apps"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "12",
    title: "Portfolio Starter Kit",
    description: "Easily create a portfolio with Next.js and Markdown.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Portfolio"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "13",
    title: "Slack Agent Template",
    description:
      "This is a Slack Agent template built with Bolt for JavaScript (TypeScript) and the Nitro server framework.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Backend"],
    frameworks: ["Express JS"],
  },
  {
    id: "14",
    title: "ISR Blog with Next.js and WordPress",
    description:
      "An Incremental Static Regeneration Blog Example Using Next.js and WordPress",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Blog", "CMS"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
    cms: ["WordPress"],
  },
  {
    id: "15",
    title: "Next.js Enterprise Boilerplate",
    description:
      "Enterprise-grade Next.js boilerplate built with Tailwind CSS, Radix UI, TypeScript, ESLint, Prettier, Jest, Playwright, Storybook, etc.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Starter"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS", "Shadcn"],
  },
  {
    id: "16",
    title: "Blog Starter Kit",
    description:
      "A statically generated blog example using Next.js and Markdown.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Blog"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "17",
    title: "Next.js Contentlayer Blog Starter",
    description:
      "A blog template with Next.js 13 App Router, Contentlayer, Tailwind CSS and dark mode.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Blog"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "18",
    title: "Customer Reviews AI Summary",
    description: "Use a Large Language Model to summarize customer feedback.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["AI"],
    frameworks: ["Next.js"],
    css: ["TailwindCSS"],
  },
  {
    id: "19",
    title: "Nuxt.js 3 Boilerplate",
    description: "A Nuxt.js 3 app, bootstrapped with create-nuxt-app.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["Starter"],
    frameworks: ["NuxtJS"],
    css: ["TailwindCSS"],
  },
  {
    id: "20",
    title: "Nuxt AI Chatbot",
    description:
      "An AI chatbot template to build your own chatbot powered by Nuxt MDC and Vercel AI SDK.",
    thumbnail: DEFAULT_THUMBNAIL,
    useCases: ["AI"],
    frameworks: ["NuxtJS"],
    css: ["TailwindCSS"],
  },
];
