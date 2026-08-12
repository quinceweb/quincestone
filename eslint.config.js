import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist", "coverage", "supabase/functions"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: { console: "readonly", document: "readonly", URL: "readonly", crypto: "readonly" },
    },
    plugins: { "@typescript-eslint": tsPlugin, "react-hooks": reactHooks },
    rules: { ...tsPlugin.configs.recommended.rules, ...reactHooks.configs.recommended.rules },
  },
  {
    files: ["src/test/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { describe: "readonly", it: "readonly", expect: "readonly" },
    },
  },
];
