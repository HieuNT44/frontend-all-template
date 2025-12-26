# Absolute Import Resolver / Alias Configuration

Tài liệu này mô tả cấu hình Absolute Import Resolver cho dự án, cho phép import modules bằng đường dẫn tuyệt đối thay vì relative paths.

---

## 📋 Tổng quan

Dự án sử dụng path aliases để import modules một cách rõ ràng và dễ bảo trì hơn.

### Lợi ích

- ✅ **Dễ đọc**: Import paths rõ ràng, không phụ thuộc vào vị trí file
- ✅ **Dễ refactor**: Di chuyển file không cần sửa import paths
- ✅ **Autocomplete tốt hơn**: IDE hiểu rõ cấu trúc dự án
- ✅ **Giảm lỗi**: Tránh lỗi import do đường dẫn tương đối sai

---

## 🔧 Cấu hình

### 1. TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/config/*": ["./src/config/*"],
      "@/models/*": ["./src/models/*"],
      "@/providers/*": ["./src/providers/*"]
    }
  }
}
```

### 2. JavaScript Configuration (`jsconfig.json`)

File này đảm bảo JavaScript files cũng có autocomplete và path resolution:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
      // ... các paths khác
    }
  }
}
```

### 3. ESLint Configuration (`eslint.config.mjs`)

ESLint được cấu hình để hiểu path aliases:

```javascript
parserOptions: {
  project: true,
  tsconfigRootDir: process.cwd(),
}
```

### 4. VSCode Settings (`vscode/settings.json`)

Cấu hình để có autocomplete và import suggestions tốt hơn:

```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.autoImports": true,
  "typescript.suggest.paths": true,
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "javascript.suggest.autoImports": true,
  "javascript.suggest.paths": true
}
```

### 5. Prettier Configuration (`.prettierrc.mjs`)

Prettier đã được cấu hình để sắp xếp imports theo thứ tự, ưu tiên absolute imports:

```javascript
importOrder: [
  // ... third-party modules
  "^@/assets/(.*)",
  "^@/api/(.*)$",
  "^@/stores/(.*)$",
  "^@/lib/(.*)$",
  "^@/utils/(.*)$",
  "^@/constants/(.*)$",
  "^@/context/(.*)$",
  "^@/hooks/(.*)$",
  "^@/components/layouts/(.*)$",
  "^@/components/ui/(.*)$",
  "^@/components/errors/(.*)$",
  "^@/components/(.*)$",
  "^@/features/(.*)$",
  "^[./]", // Relative imports last
];
```

---

## 📝 Cách sử dụng

### Import với Absolute Path

```typescript
// ✅ Tốt - Sử dụng absolute import
import { Button } from "@/components/ui/button";
import { useFormBuilderStore } from "@/stores/form-builder-store";
import { cn } from "@/lib/utils";
import { FormComponentModel } from "@/models/FormComponent";

// ❌ Tránh - Relative import (trừ khi cần thiết)
import { Button } from "../../../components/ui/button";
```

### Các Path Aliases có sẵn

| Alias            | Path                 | Mô tả                       |
| ---------------- | -------------------- | --------------------------- |
| `@/*`            | `./src/*`            | Root của source code        |
| `@/components/*` | `./src/components/*` | Components                  |
| `@/lib/*`        | `./src/lib/*`        | Utilities và helpers        |
| `@/hooks/*`      | `./src/hooks/*`      | Custom React hooks          |
| `@/stores/*`     | `./src/stores/*`     | State management stores     |
| `@/types/*`      | `./src/types/*`      | TypeScript type definitions |
| `@/config/*`     | `./src/config/*`     | Configuration files         |
| `@/models/*`     | `./src/models/*`     | Data models                 |
| `@/providers/*`  | `./src/providers/*`  | React context providers     |

### Ví dụ

```typescript
// Import component
// Import config
import { AVAILABLE_COMPONENTS } from "@/config/available-components";
// Import type
import type { FormComponentModel } from "@/models/FormComponent";
import type { FormComponentValidationTypes } from "@/types/FormComponent.types";

// Import store
import { useFormBuilderStore } from "@/stores/form-builder-store";

// Import utility
import { cn } from "@/lib/utils";

// Import hook
import { useIsMobile } from "@/hooks/use-mobile";
import { useLoadTemplates } from "@/hooks/useLoadTemplates";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

---

## 🔍 Kiểm tra

### TypeScript

TypeScript tự động resolve paths từ `tsconfig.json`. Không cần cấu hình thêm.

### Next.js

Next.js tự động sử dụng paths từ `tsconfig.json`. Không cần cấu hình trong `next.config.mjs`.

### ESLint

ESLint được cấu hình để hiểu path aliases và sẽ báo lỗi nếu import không tồn tại.

### VSCode

VSCode sẽ tự động:

- ✅ Autocomplete khi gõ `@/`
- ✅ Go to definition (Cmd/Ctrl + Click)
- ✅ Find all references
- ✅ Auto-import suggestions

---

## 🚀 Best Practices

1. **Luôn dùng absolute imports** cho code trong `src/`
2. **Chỉ dùng relative imports** cho:
   - Files trong cùng folder
   - Files gần nhau (ví dụ: `./utils`, `../types`)
3. **Sắp xếp imports** theo thứ tự:
   - React và third-party libraries
   - Absolute imports (`@/...`)
   - Relative imports (`./...`, `../...`)
4. **Sử dụng specific aliases** khi có thể:
   - `@/components/ui/button` thay vì `@/components/.../button`
   - `@/hooks/use-mobile` thay vì `@/hooks/.../use-mobile`

---

## 🐛 Troubleshooting

### Autocomplete không hoạt động

1. Reload VSCode window: `Cmd/Ctrl + Shift + P` → "Reload Window"
2. Kiểm tra `tsconfig.json` có `baseUrl` và `paths`
3. Kiểm tra `jsconfig.json` tồn tại (cho JavaScript files)

### ESLint báo lỗi "Cannot find module"

1. Kiểm tra path trong `tsconfig.json` đúng
2. Chạy `npm run lint` để xem lỗi chi tiết
3. Đảm bảo file tồn tại tại path đã chỉ định

### Build error về paths

1. Next.js tự động resolve từ `tsconfig.json`
2. Không cần cấu hình thêm trong `next.config.mjs`
3. Kiểm tra `baseUrl` và `paths` trong `tsconfig.json`

---

## 📚 Tài liệu tham khảo

- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [Next.js Absolute Imports](https://nextjs.org/docs/advanced-features/module-path-aliases)
- [VSCode TypeScript Settings](https://code.visualstudio.com/docs/languages/typescript)
