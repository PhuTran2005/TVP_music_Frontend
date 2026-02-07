# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

Tuyệt vời. Để đạt chuẩn "Production/Enterprise" (Doanh nghiệp), phong cách comment code cần tuân thủ các nguyên tắc sau:

JSDoc (/\*_ ... _/) cho các khối chính: Dùng cho Config, Function, Type xuất ra ngoài (export). Giúp IDE (VSCode) hiển thị gợi ý (Intellisense) khi rê chuột vào.

Section Dividers (// ====== ...): Phân chia code thành các vùng logic rõ ràng, giúp mắt dễ quét (scan) khi file dài.

"Why" over "What": Comment giải thích TẠI SAO làm thế (Logic nghiệp vụ/Bảo mật), thay vì giải thích code làm gì (vì code đã tự nói lên điều đó).

English/Vietnamese Consistent: Ở đây tôi sẽ viết comment bằng Tiếng Việt chuẩn kỹ thuật để team của bạn dễ hiểu nhất, nhưng giữ văn phong chuyên nghiệp.
Loại Hook,Quy tắc đặt tên,Ví dụ thực tế,Ý nghĩa ngầm định
Data Fetching,use[Resource]Query use[Resource]List,useAlbumsQuery useTracksList,"Tự động fetch, cache data, trả về loading/data."
Data Single,use[Resource]Detail,useAlbumDetail,"Lấy 1 item, thường dựa trên ID/Slug."
Data Mutation,use[Resource]Mutation use[Action][Resource],useDeleteAlbum useAlbumMutations,Trả về hàm trigger. Không tự chạy.
UI Logic,use[Context]Params,useTableParams,Quản lý URL search params.
Utility,use[Tech],"useDebounce, useClickOutside",Helper thuần túy.
