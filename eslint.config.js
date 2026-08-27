import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // side-effect imports
            ["^@?\\w"], // external packages
            ["^@/"], // internal alias
            ["^\\."], // relative imports
          ],
        },
      ],
    },
  },
  {
    // Components, hooks, and helpers are always `const` arrow functions, and
    // src/ never uses default exports — see CODING_STANDARDS.md.
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration",
          message:
            "Use a const arrow function instead of a function declaration.",
        },
        {
          selector: "FunctionExpression",
          message:
            "Use a const arrow function instead of a function expression.",
        },
        {
          selector: "ExportDefaultDeclaration",
          message: "No default exports in src/ — use a named export.",
        },
      ],
    },
  },
  {
    // shadcn/ui generated primitives: exporting a cva() variants function
    // alongside the component is the standard shadcn pattern.
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  eslintConfigPrettier
);
