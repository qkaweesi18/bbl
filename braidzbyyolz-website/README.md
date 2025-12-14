# Braidz By Yolz — Image gallery generator

This repo includes a small Node script to normalize image filenames in `images/` and generate `images/gallery.json` used by the front-end gallery.

Prerequisites
- Node.js (12+)

Run (PowerShell):

```powershell
# From repository root
node scripts/generate-gallery.js
```

What it does
- Renames image files in `images/` to URL-friendly lowercase names (replacing spaces, commas, apostrophes, parentheses with `-`).
- Writes `images/gallery.json` (most-recent-first order).

Notes
- The script skips the `images/favicon` directory.
- If a target normalized filename already exists, the script appends `-1`, `-2`, etc. to avoid overwriting.
- After running the script, refresh the site; `script.js` will load `images/gallery.json` automatically. If `gallery.json` is not present, the site falls back to a built-in list.

If you want, I can run the generator here (if you give permission) or you can run it locally and then tell me if you'd like me to update any remaining references.