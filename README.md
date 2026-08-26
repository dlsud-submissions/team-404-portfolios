# Team 404 | Portfolios

A collection of personal developer portfolios built by Team 404 for the
DLSU-D Enabling Assessment.

**Live site:** [dlsud-submissions.github.io/team-404-portfolios](https://dlsud-submissions.github.io/team-404-portfolios/)

## Team Members

| Member          | Role                 |
| --------------- | -------------------- |
| Staana, Matthew | Full-Stack Developer |
| Raquin, Renz    | Full-Stack Developer |
| Rullan, Harvey  | Full-Stack Developer |
| Magpale, Chloe  | Full-Stack Developer |

## Project Structure

Each member's portfolio lives in its own top-level folder and is a
self-contained static site (HTML, CSS, and assets):

```text
.
├── index.html          # Landing page linking to each portfolio
├── styles.css
├── staana-matthew/
├── raquin-renz/
├── rullan-harvey/
└── magpale-chloe/
```

## Development

Install dependencies:

```sh
npm install
```

### Linting and Formatting

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run lint`         | Lint JavaScript with ESLint      |
| `npm run lint:fix`     | Lint and auto-fix where possible |
| `npm run format`       | Format files with Prettier       |
| `npm run format:check` | Check formatting without writing |

The same checks run automatically on every push and pull request via
[GitHub Actions](.github/workflows/ci.yml).

Matching VS Code tasks (**Lint**, **Lint: Fix**, **Format**, **Format: Check**)
are available under **Terminal → Run Task**.

## License

Distributed under the [MIT License](LICENSE).
