# Duolingo Stats Card

Auto-updating Duolingo stats card for GitHub Pages.

## Preview

![Duolingo Stats](https://yongsk0066.github.io/duolingo-card/card.svg)

## Usage

Embed in your website or README:

```html
<a href="https://duolingo.com/profile/yongsk0066" target="_blank">
  <img src="https://yongsk0066.github.io/duolingo-card/card.svg" alt="Duolingo Stats" />
</a>
```

Or in Markdown:

```markdown
[![Duolingo Stats](https://yongsk0066.github.io/duolingo-card/card.svg)](https://duolingo.com/profile/yongsk0066)
```

## How it works

1. GitHub Actions runs twice daily (00:00 and 12:00 UTC)
2. Fetches stats from Duolingo's public API
3. Generates an SVG card
4. Deploys to GitHub Pages

## Local Development

```bash
# Generate card locally
node src/generate.js

# Preview
open dist/card.svg
```

## Environment Variables

- `DUOLINGO_USERNAME` - Duolingo username (default: yongsk0066)
- `THEME` - Card theme: github-dark, dark, dracula (default: github-dark)
