export type UseCase =
  | "AI"
  | "Starter"
  | "Ecommerce"
  | "SaaS"
  | "Blog"
  | "Portfolio"
  | "CMS"
  | "Backend"
  | "Edge Functions"
  | "Edge Middleware"
  | "Edge Config"
  | "Cron"
  | "Multi-Tenant Apps"
  | "Realtime Apps"
  | "Documentation"
  | "Virtual Event"
  | "Monorepos"
  | "Web3"
  | "Vercel Firewall"
  | "Microfrontends"
  | "Authentication"
  | "Marketing Sites"
  | "CDN";
export type Framework =
  | "Next.js"
  | "React"
  | "Vue"
  | "Svelte"
  | "Angular"
  | "Remix"
  | "NuxtJS"
  | "NestJS"
  | "Express JS"
  | "Extension Chrome";
export type CSS = "MUI" | "TailwindCSS" | "Shadcn" | "Ant Design" | "Charka UI";
export type Database = "PostgreSQL" | "MySQL" | "MongoDB" | "SQLite" | "Supabase" | "PlanetScale";
export type Authentication = "NextAuth.js" | "Clerk" | "Auth0" | "Supabase Auth" | "Firebase Auth";
export type CMS = "Contentful" | "Sanity" | "Strapi" | "Prismic" | "WordPress";
export type Experimentation = "Vercel Edge Config" | "LaunchDarkly" | "Split.io";

export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  useCases?: UseCase[];
  frameworks?: Framework[];
  css?: CSS[];
  databases?: Database[];
  authentication?: Authentication[];
  cms?: CMS[];
  experimentation?: Experimentation[];
  githubRepo?: string;
  demoUrl?: string;
  gettingStarted?: string;
}

export interface TemplateFilters {
  searchQuery: string;
  selectedUseCases: UseCase[];
  selectedFrameworks: Framework[];
  selectedCSS: CSS[];
  selectedDatabases: Database[];
  selectedAuthentication: Authentication[];
  selectedCMS: CMS[];
  selectedExperimentation: Experimentation[];
}

