# TOMOSIA FRONTEND Dashboard

**TOMOSIA FRONTEND** - Modern Next.js dashboard with TypeScript & Shadcn UI. Includes multiple dashboards, authentication layouts, customizable theme presets, and more.

<img src="./media/dashboard.png" alt="Dashboard Screenshot">

A modern, clean dashboard template built with Next.js 15, featuring theme toggling, layout controls, and a flexible design that's perfect for SaaS apps, admin panels, and internal tools.

## Features

- Built with Next.js 15, TypeScript, Tailwind CSS v4, and Shadcn UI  
- Responsive and mobile-friendly  
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Brutalist, and more)  
- Flexible layouts (collapsible sidebar, variable content widths)  
- Authentication flows and screens  
- Prebuilt dashboards (Default, CRM, Finance) with more coming soon  
- Role-Based Access Control (RBAC) with config-driven UI and multi-tenant support *(planned)*  

> [!NOTE]
> The default dashboard uses the **shadcn neutral** theme.  
> It also includes additional color presets inspired by [Tweakcn](https://tweakcn.com):  
>
> - Tangerine  
> - Neo Brutalism  
> - Soft Pop  
>
> You can create more presets by following the same structure as the existing ones.


## Tech Stack

- **Framework**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4  
- **UI Components**: Shadcn UI  
- **Validation**: Zod  
- **Forms & State Management**: React Hook Form, Zustand  
- **Tables & Data Handling**: TanStack Table  
- **Tooling & DX**: ESLint, Prettier, Lefthook, Knip  

## Screens

### Available
- Default Dashboard  
- CRM Dashboard  
- Finance Dashboard  
- Authentication (4 screens)

### Coming Soon
- Analytics Dashboard  
- eCommerce Dashboard  
- Academy Dashboard  
- Logistics Dashboard  
- Email Page  
- Chat Page  
- Calendar Page  
- Kanban Board  
- Invoice Page  
- Users Management  
- Roles Management  

## Feature-Based Architecture

This project follows a **feature-based architecture** where each feature corresponds to one page (route). Each feature is an independent unit containing all logic and UI for that page.  
Shared UI, hooks, and configuration live in the `shared/` folder, making the codebase modular, scalable, and easier to maintain as the app grows.

For a full breakdown of the structure, see the [Feature-Based Pattern Documentation](./docs/en/01-feature-base-pattern.md).

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Run locally

1. **Navigate into the project**
   ```bash
   cd tomosia-frontend-dashboard
   ```
   
3. **Install dependencies**
   ```bash
    npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

---

> [!IMPORTANT]  
> This project is updated frequently. If you’re working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.


**Happy Vibe Coding!**
