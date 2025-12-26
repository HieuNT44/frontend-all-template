import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "TOMOSIA FRONTEND",
  version: packageJson.version,
  copyright: `© ${currentYear}, TOMOSIA FRONTEND.`,
  meta: {
    title: "TOMOSIA FRONTEND - Modern Next.js Dashboard",
    description:
      "TOMOSIA FRONTEND is a modern dashboard built with Next.js 15, Tailwind CSS v4, and shadcn/ui. Perfect for SaaS apps, admin panels, and internal tools—fully customizable and production-ready.",
  },
};
