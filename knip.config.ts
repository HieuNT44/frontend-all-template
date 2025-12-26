import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/app/**/*.{ts,tsx}",
    "src/server/**/*.{ts,tsx}",
    "next.config.mjs",
    "postcss.config.mjs",
    "eslint.config.mjs",
    "tailwind.config.*",
  ],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    "src/app/**/*.config.ts",
    "src/components/ui/**",
    "src/styles/**",
    "src/scripts/**",
    ".next/**",
    "node_modules/**",
    "public/**",
  ],
  ignoreDependencies: [
    "@types/node",
    "@types/react",
    "@types/react-dom",
    "typescript",
    "ts-node",
    "eslint",
    "prettier",
    "knip",
    "lefthook",
  ],
  ignoreBinaries: ["next", "ts-node"],
  next: {
    entry: ["src/app/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
  },
};

export default config;
