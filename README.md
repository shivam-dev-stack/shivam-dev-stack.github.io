# DataLog — GitHub Pages Data Science Blog

A ready-to-use, single-page blog template for data scientists. Content is written in Markdown. No build step required.

## File Structure

```
/
├── index.html          ← Site shell & styles (edit nav, colors, etc.)
├── blog.js             ← JS engine (routing, markdown rendering)
├── posts.json          ← Post index (add entries here for each post)
├── about.md            ← Your about page content
├── _config.yml         ← GitHub Pages config
└── posts/
    ├── gradient-descent.md
    ├── production-failures.md
    └── eda-pandas-plotly.md
```

## How to Add a Blog Post

**Step 1:** Create a markdown file in `/posts/`:

```markdown
---
title: My New Post
date: 2025-03-01
tags: python, tutorial
---

Your content here...
```

**Step 2:** Add an entry to `posts.json`:

```json
{
  "title": "My New Post",
  "file": "my-new-post.md",
  "date": "2025-03-01",
  "excerpt": "A short one-liner shown on the home page.",
  "tags": ["python", "tutorial"]
}
```

That's it! The post appears on the home page immediately.

## Deploying to GitHub Pages

1. Create a new GitHub repo (e.g. `yourusername.github.io` or `my-blog`)
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Source → Deploy from branch → main / root**
4. Your site will be live at `https://yourusername.github.io` (or `/my-blog`)

## Customizing

| What | Where |
|---|---|
| Blog name & nav | `index.html` → `<nav>` section |
| Colors & fonts | `index.html` → `:root` CSS variables |
| Hero text | `index.html` → `#hero` section |
| About page text | `about.md` |
| GitHub link | `index.html` → nav GitHub link |

## Front Matter Fields

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Post title |
| `date` | Yes | `YYYY-MM-DD` format |
| `tags` | No | Comma-separated list |

In `posts.json`, add an `excerpt` field (1 sentence) for the card preview.

## Tech Stack

- Vanilla HTML/CSS/JS — zero dependencies
- [marked.js](https://marked.js.org/) — markdown rendering (loaded from CDN)
- GitHub Pages — free static hosting
