# Code Quality Tools Documentation

Tài liệu này mô tả chi tiết các tool đảm bảo chất lượng code trong dự án.

---

## 📋 Tổng quan

Dự án sử dụng một bộ công cụ toàn diện để đảm bảo chất lượng code, từ formatting, linting, type checking đến testing và git hooks.

---

## 🛠️ Bảng tổng hợp các Tools

| Tool           | Version  | Mục đích                       | File Config             | Auto Run                    |
| -------------- | -------- | ------------------------------ | ----------------------- | --------------------------- |
| **ESLint**     | ^9.39.1  | Code linting & quality checks  | `eslint.config.mjs`     | ✅ (Auto save + Pre-commit) |
| **Prettier**   | ^3.6.2   | Code formatting                | `.prettierrc.mjs`       | ✅ (Auto save + Pre-commit) |
| **TypeScript** | ^5.9.3   | Type checking                  | `tsconfig.json`         | ✅ (Build time)             |
| **Commitlint** | ^20.0.0  | Commit message validation      | `commitlint.config.mjs` | ✅ (Commit-msg hook)        |
| **Lefthook**   | ^2.0.4   | Git hooks management           | `lefthook.yml`          | ✅ (Pre-commit, Pre-push)   |
| **Knip**       | ^5.69.1  | Find unused files/deps/exports | `knip.config.ts`        | ✅ (Pre-push)               |
| **Stylelint**  | ^16.25.0 | CSS/SCSS linting               | -                       | ❌ (Manual)                 |
| **Vitest**     | ^4.0.9   | Unit testing                   | -                       | ❌ (Manual)                 |
| **Playwright** | ^1.56.1  | E2E testing                    | -                       | ❌ (Manual)                 |
| **only-allow** | ^1.2.1   | Package manager enforcement    | `package.json`          | ✅ (Pre-install)            |

---

## 1. ESLint - Code Linting

### Mô tả

ESLint kiểm tra code quality, tìm lỗi, và enforce best practices cho JavaScript/TypeScript và React.

### Cấu hình

- **File**: `eslint.config.mjs`
- **Format**: ESLint 9 Flat Config
- **Extends**:
  - `@eslint/js` (recommended)
  - `typescript-eslint` (recommended)
  - `eslint-plugin-react` (recommended)
  - `eslint-plugin-react-hooks` (recommended)
  - `eslint-config-prettier` (tắt conflicting rules)

### Rules chính

| Rule                                 | Level     | Mô tả                                                    |
| ------------------------------------ | --------- | -------------------------------------------------------- |
| `prefer-const`                       | **error** | Bắt buộc dùng `const` thay vì `let` nếu không reassign   |
| `@typescript-eslint/no-unused-vars`  | **warn**  | Cảnh báo biến/import không sử dụng (cho phép prefix `_`) |
| `@typescript-eslint/no-explicit-any` | **warn**  | Cảnh báo khi dùng `any` type                             |
| `react/react-in-jsx-scope`           | **off**   | Tắt (Next.js không cần import React)                     |
| `react/prop-types`                   | **off**   | Tắt (dùng TypeScript thay vì PropTypes)                  |
| `prettier/prettier`                  | **off**   | Tắt để tránh conflict với formatOnSave                   |

### Commands

```bash
npm run lint        # Kiểm tra lỗi
npm run lint:fix    # Tự động sửa lỗi
```

### Auto Run

- ✅ **Auto Save**: Chạy qua VSCode settings (`source.fixAll.eslint`)
- ✅ **Pre-commit**: Chạy qua Lefthook (chỉ staged files)
- ✅ **Pre-push**: Chạy full lint check

### Ignored Files

- `.next/**`
- `node_modules/**`
- `dist/**`, `build/**`, `coverage/**`
- `storybook-static/**`
- `*.config.{js,mjs,ts}`
- `public/**`
- `next-env.d.ts`

---

## 2. Prettier - Code Formatting

### Mô tả

Prettier tự động format code để đảm bảo code style nhất quán trong toàn bộ dự án.

### Cấu hình

- **File**: `.prettierrc.mjs`
- **Ignore File**: `.prettierignore`

### Settings chính

| Setting          | Value      | Mô tả                                   |
| ---------------- | ---------- | --------------------------------------- |
| `semi`           | `false`    | Không dùng semicolon                    |
| `singleQuote`    | `true`     | Dùng single quotes                      |
| `jsxSingleQuote` | `true`     | Dùng single quotes trong JSX            |
| `tabWidth`       | `2`        | 2 spaces cho indentation                |
| `printWidth`     | `80`       | Max line length 80 characters           |
| `trailingComma`  | `"es5"`    | Trailing comma theo ES5                 |
| `arrowParens`    | `"always"` | Luôn có parentheses cho arrow functions |
| `endOfLine`      | `"lf"`     | Unix-style line endings                 |

### Plugins

- `@trivago/prettier-plugin-sort-imports`: Tự động sắp xếp imports
- `prettier-plugin-tailwindcss`: Format Tailwind CSS classes

### Import Order

1. Core modules (`path`, `vite`, `react`)
2. Third-party libraries (`zod`, `axios`, `date-fns`, etc.)
3. Radix UI components
4. TanStack packages
5. Internal modules (`@/assets`, `@/api`, `@/stores`, etc.)
6. Relative imports (`./`, `../`)

### Commands

```bash
npm run format          # Format toàn bộ code
npm run format:check    # Kiểm tra format (không sửa)
npm run format:fix      # Format và list files đã sửa
```

### Auto Run

- ✅ **Auto Save**: Chạy qua VSCode settings (`editor.formatOnSave`)
- ✅ **Pre-commit**: Chạy qua Lefthook (chỉ staged files)

---

## 3. TypeScript - Type Checking

### Mô tả

TypeScript cung cấp static type checking để phát hiện lỗi sớm và cải thiện code quality.

### Cấu hình

- **File**: `tsconfig.json`
- **Strict Mode**: ✅ Enabled

### Settings chính

| Setting            | Value             | Mô tả                                  |
| ------------------ | ----------------- | -------------------------------------- |
| `strict`           | `true`            | Bật strict type checking               |
| `target`           | `"ES2017"`        | Compile target                         |
| `module`           | `"esnext"`        | Module system                          |
| `moduleResolution` | `"bundler"`       | Module resolution strategy             |
| `jsx`              | `"react-jsx"`     | JSX transform (không cần import React) |
| `paths`            | `@/*` → `./src/*` | Path aliases                           |

### Auto Run

- ✅ **Build time**: TypeScript check khi build
- ✅ **VSCode**: Real-time type checking trong editor

---

## 4. Commitlint - Commit Message Validation

### Mô tả

Commitlint đảm bảo commit messages tuân theo Conventional Commits specification.

### Cấu hình

- **File**: `commitlint.config.mjs`
- **Extends**: `@commitlint/config-conventional`

### Commit Types cho phép

| Type       | Mô tả                   |
| ---------- | ----------------------- |
| `feat`     | New feature             |
| `fix`      | Bug fix                 |
| `refactor` | Code refactoring        |
| `perf`     | Performance improvement |
| `style`    | Code style changes      |
| `test`     | Test changes            |
| `docs`     | Documentation changes   |
| `build`    | Build system changes    |
| `ops`      | Operational changes     |
| `chore`    | Miscellaneous changes   |

### Rules

| Rule                 | Mô tả                                         |
| -------------------- | --------------------------------------------- |
| `type-enum`          | Type phải là một trong các types cho phép     |
| `type-case`          | Type phải lowercase                           |
| `subject-case`       | Description phải lowercase                    |
| `subject-full-stop`  | Description không được kết thúc bằng dấu chấm |
| `subject-max-length` | Description tối đa 100 ký tự                  |
| `header-max-length`  | Header tối đa 100 ký tự                       |

### Format

```
<type>(<scope>): <description>

<body>

<footer>
```

### Ví dụ hợp lệ

```bash
feat: add new form builder feature
fix(ui): resolve button styling issue
refactor: improve code structure
docs: update README
```

### Auto Run

- ✅ **Commit-msg hook**: Chạy qua Lefthook khi commit

---

## 5. Lefthook - Git Hooks Management

### Mô tả

Lefthook quản lý git hooks để tự động chạy các tool khi commit/push.

### Cấu hình

- **File**: `lefthook.yml`

### Hooks

#### Pre-commit

- **Format**: Chạy Prettier trên staged files (`.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.css`, `.scss`, `.md`, `.yml`, `.yaml`)
- **Lint**: Chạy ESLint fix trên staged files (`.js`, `.jsx`, `.ts`, `.tsx`)
- **Parallel**: ✅ Chạy song song để tối ưu tốc độ
- **Stage fixed**: ✅ Tự động stage files đã được sửa

#### Commit-msg

- **Commitlint**: Validate commit message format

#### Pre-push

- **Lint**: Chạy full lint check trên toàn bộ dự án
- **Parallel**: ❌ Chạy tuần tự

### Commands

```bash
npx lefthook install    # Cài đặt hooks
npx lefthook run pre-commit  # Test pre-commit hook
```

### Auto Run

- ✅ **Pre-commit**: Tự động khi `git commit`
- ✅ **Commit-msg**: Tự động khi `git commit`
- ✅ **Pre-push**: Tự động khi `git push`

---

## 6. Knip - Find Unused Files, Dependencies & Exports

### Mô tả

Knip tìm và báo cáo các file, dependencies, và exports không được sử dụng trong dự án, giúp dọn dẹp và tối ưu codebase.

### Cấu hình

- **File**: `knip.config.ts`
- **Format**: TypeScript config file

### Tính năng

- ✅ Tìm unused files
- ✅ Tìm unused dependencies
- ✅ Tìm unused exports
- ✅ Tìm unused types
- ✅ Tìm duplicate exports

### Settings chính

| Setting              | Mô tả                                                 |
| -------------------- | ----------------------------------------------------- |
| `entry`              | Entry points của ứng dụng (Next.js pages, app routes) |
| `project`            | Files cần được phân tích                              |
| `ignore`             | Files/folders bỏ qua                                  |
| `ignoreDependencies` | Dependencies được sử dụng nhưng knip không phát hiện  |
| `next`               | Next.js specific configuration                        |

### Commands

```bash
npm run knip        # Kiểm tra unused files/deps/exports
npm run knip:fix    # Tự động xóa unused exports (nếu có)
```

### Ignored Dependencies

Các dependencies được ignore vì được sử dụng trong:

- Config files: `@babel/parser`, `@prettier/sync`
- Build tools: `@vercel/analytics` (auto-injected)
- Server-side: `posthog-node`
- Code generation: `prism-react-renderer`
- Tailwind config: `tailwindcss-animate`, `tw-animate-css`

### Auto Run

- ✅ **Pre-push**: Chạy qua Lefthook với `--no-exit-code` (không block push, chỉ cảnh báo)

### Ignored Files

- `src/app/**/*.css`, `src/app/**/*.scss`
- `**/*.d.ts`
- `**/*.config.{js,ts,mjs}`
- `.next/**`, `node_modules/**`, `dist/**`, `build/**`
- `coverage/**`, `storybook-static/**`, `public/**`

---

## 7. Stylelint - CSS/SCSS Linting

### Mô tả

Stylelint kiểm tra và enforce best practices cho CSS/SCSS code.

### Cấu hình

- **Configs**:
  - `stylelint-config-standard`
  - `stylelint-config-recommended-scss`
  - `stylelint-config-prettier-scss`
  - `stylelint-config-tailwindcss`

### Packages

- `stylelint`: ^16.25.0
- `stylelint-config-standard`: ^39.0.1
- `stylelint-config-recommended-scss`: ^16.0.2
- `stylelint-config-prettier-scss`: ^1.0.0
- `stylelint-config-tailwindcss`: ^1.0.0

### Auto Run

- ❌ **Manual only**: Chưa tích hợp vào auto save hoặc git hooks

---

## 8. Vitest - Unit Testing

### Mô tả

Vitest là testing framework nhanh cho unit tests và component tests.

### Packages

- `vitest`: ^4.0.9
- `@vitest/browser`: ^4.0.9
- `@vitest/coverage-v8`: ^4.0.9

### Auto Run

- ❌ **Manual only**: Chạy bằng lệnh `npm test` hoặc qua Storybook

---

## 9. Playwright - E2E Testing

### Mô tả

Playwright thực hiện end-to-end testing cho ứng dụng.

### Package

- `playwright`: ^1.56.1

### Auto Run

- ❌ **Manual only**: Chạy bằng lệnh `npx playwright test`

---

## 10. only-allow - Package Manager Enforcement

### Mô tả

Đảm bảo dự án chỉ sử dụng npm, không cho phép yarn hoặc pnpm.

### Cấu hình

- **Script**: `"preinstall": "npx only-allow npm"`

### Auto Run

- ✅ **Pre-install**: Tự động chạy khi `npm install`
- ❌ **Chặn**: Nếu ai đó dùng `yarn install` hoặc `pnpm install`

---

## 🔄 Workflow khi Commit

### Thứ tự thực thi

1. **Pre-install** (nếu cài package mới)
   - `only-allow npm` - Kiểm tra package manager

2. **Pre-commit** (khi `git commit`)
   - Prettier format staged files
   - ESLint fix staged files
   - Cả hai chạy song song

3. **Commit-msg** (khi `git commit`)
   - Commitlint validate commit message

4. **Pre-push** (khi `git push`)
   - ESLint full check toàn bộ dự án
   - Knip check unused files/deps/exports (không block push)

---

## 📊 Thống kê lỗi hiện tại

| Loại         | Số lượng         | Rules chính                                                                                  |
| ------------ | ---------------- | -------------------------------------------------------------------------------------------- |
| **Errors**   | **4**            | `prefer-const`, `react-hooks/set-state-in-effect`, `@typescript-eslint/no-empty-object-type` |
| **Warnings** | **114**          | `@typescript-eslint/no-unused-vars` (82), `@typescript-eslint/no-explicit-any` (31)          |
| **Tổng**     | **118 problems** | -                                                                                            |

---

## 🎯 Best Practices

### 1. Code Formatting

- ✅ Luôn để Prettier format code (không format thủ công)
- ✅ Commit code đã được format

### 2. Code Quality

- ✅ Fix tất cả ESLint errors trước khi commit
- ✅ Warnings nên được fix nhưng không block commit
- ✅ Không dùng `any` type (dùng type cụ thể)

### 3. Commit Messages

- ✅ Luôn tuân theo Conventional Commits
- ✅ Type phải lowercase
- ✅ Description phải lowercase, không có dấu chấm

### 4. Git Workflow

- ✅ Không skip hooks (`--no-verify`)
- ✅ Fix lỗi trước khi push

---

## 🔧 Troubleshooting

### Prettier và ESLint conflict

- ✅ Đã tắt `prettier/prettier` rule trong ESLint
- ✅ Prettier format trước, ESLint fix sau

### Auto save không hoạt động

- ✅ Kiểm tra VSCode settings
- ✅ Reload VSCode window
- ✅ Kiểm tra extensions đã cài đặt

### Lefthook không chạy

- ✅ Chạy `npx lefthook install`
- ✅ Kiểm tra `.git/hooks` có hooks không

---

## 📚 Tài liệu tham khảo

- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Lefthook Documentation](https://github.com/evilmartians/lefthook)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated**: 2025-01-17
