/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Types based on conventional-commits.md
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "refactor", // Code refactoring
        "perf", // Performance improvement
        "style", // Code style changes
        "test", // Test changes
        "docs", // Documentation changes
        "build", // Build system changes
        "ops", // Operational changes
        "chore", // Miscellaneous changes
      ],
    ],
    // Description rules
    "subject-case": [2, "never", ["upper-case", "pascal-case", "start-case"]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    // Scope is optional
    "scope-empty": [0],
    "scope-case": [2, "always", "lower-case"],
    // Body and footer are optional
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
  },
};
