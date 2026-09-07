import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

const runtimeGlobals = {
  console: "readonly",
  document: "readonly",
  window: "readonly",
  sessionStorage: "readonly",
  HTMLElement: "readonly",
  HTMLMetaElement: "readonly",
  HTMLLinkElement: "readonly",
  IntersectionObserver: "readonly",
  KeyboardEvent: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  crypto: "readonly",
  fetch: "readonly",
  process: "readonly",
};

export default [
  { ignores: ["dist", "coverage"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser, globals: runtimeGlobals },
    plugins: { "@typescript-eslint": tsPlugin, "react-hooks": reactHooks },
    rules: { ...tsPlugin.configs.recommended.rules, ...reactHooks.configs.recommended.rules },
  },
  {
    files: ["api/**/*.{ts,tsx}"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
  { files: ["test/**/*.{ts,tsx}"], languageOptions: { globals: { describe: "readonly", it: "readonly", expect: "readonly" } } },
];
