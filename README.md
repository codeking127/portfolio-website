# aryan.os

My portfolio: a Mac-style desktop where each part of me (code, journey, running, music, origami, languages, animals) is a window that unfolds like paper.

Built with Next.js (App Router) + TypeScript, plain CSS, deployed on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Change my details

Everything about me is in **`data/profile.ts`**: intro text, projects, journey, instruments, runs, languages, origami and animal photos, and links. Edit it and the page updates.

- Photos and videos go in `public/assets/` and are referenced as `/assets/<file>`.
- A photo entry needs its width and height (`w`, `h`) in pixels. On a Mac: `sips -g pixelWidth -g pixelHeight public/assets/<file>.jpg`.
- Music videos: add a file to `public/assets/` and set `src` on the matching entry in `musicVideos`.
- Things still marked `todo: true` (like EPTech) show highlighted until you fill them in.

## Where things live

| Path | What it is |
| --- | --- |
| `data/profile.ts` | all content |
| `components/Desktop.tsx` | menu bar, desktop, window positions and opening/closing |
| `components/Window.tsx` | a draggable window with the paper fold/unfold |
| `components/WindowContents.tsx` | what's inside each window |
| `components/Crane.tsx` | the paper crane that folds from a flat square |
| `components/Dock.tsx` | the dock, including LinkedIn and GitHub links |
| `app/globals.css` | all styles and the fold animations |

## Deploy

Push this folder to a GitHub repo, then import the repo at vercel.com/new. Vercel detects Next.js automatically; every push to `main` redeploys.
