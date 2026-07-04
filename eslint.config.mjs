import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  ...next,
  prettier,
  {
    // ds-bundle/ and .ds-sync/ are gitignored design-sync build output
    // (includes vendored React) — never lint them.
    ignores: [".next/**", "node_modules/**", "out/**", "ds-bundle/**", ".ds-sync/**"],
  },
  {
    rules: {
      // This is a prose-heavy editorial piece; apostrophes and quotes in body
      // text are intentional and read fine without HTML entity escapes.
      "react/no-unescaped-entities": "off",
    },
  },
];
