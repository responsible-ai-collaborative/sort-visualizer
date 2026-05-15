import next from "eslint-config-next";
import prettier from "eslint-config-prettier";

export default [
  ...next,
  prettier,
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  {
    rules: {
      // This is a prose-heavy editorial piece; apostrophes and quotes in body
      // text are intentional and read fine without HTML entity escapes.
      "react/no-unescaped-entities": "off",
    },
  },
];
