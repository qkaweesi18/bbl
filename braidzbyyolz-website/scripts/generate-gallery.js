/*
  generate-gallery.js
  - Scans `images/` (excluding `images/favicon`) for image files
  - Normalizes filenames to URL-friendly names (lowercase, hyphens)
  - Renames files on disk (safe: avoids overwriting existing targets)
  - Writes `images/gallery.json` with an array of filenames (most-recent-first)

  Usage (PowerShell):
    node scripts/generate-gallery.js

  Requirements: Node.js installed
*/

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images');
const excludeDirs = new Set(['favicon']);
const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

function normalize(name) {
  // lowercase
  let s = name.toLowerCase();
  // replace spaces, commas, parentheses, apostrophes with hyphens
  s = s.replace(/[\s,()'"’]+/g, '-');
  // remove characters that are not alphanumeric, hyphen, dot
  s = s.replace(/[^a-z0-9-\.]/g, '');
  // collapse multiple hyphens
  s = s.replace(/-+/g, '-');
  // trim hyphens and dots from ends
  s = s.replace(/^[-\.]+|[-\.]+$/g, '');
  return s;
}

function safeRename(oldPath, newPath) {
  if (oldPath === newPath) return newPath;
  if (!fs.existsSync(oldPath)) return null;
  let target = newPath;
  const dir = path.dirname(newPath);
  const ext = path.extname(newPath);
  const base = path.basename(newPath, ext);
  let idx = 1;
  while (fs.existsSync(target)) {
    // if target exists and is same file, break
    if (fs.realpathSync(target) === fs.realpathSync(oldPath)) {
      return target;
    }
    target = path.join(dir, `${base}-${idx}${ext}`);
    idx++;
  }
  fs.renameSync(oldPath, target);
  return target;
}

function scanAndNormalize() {
  const items = fs.readdirSync(imagesDir, { withFileTypes: true });
  const files = [];

  for (const it of items) {
    if (it.isDirectory()) continue; // skip directories here (we handle favicon by ignoring names)
    const full = path.join(imagesDir, it.name);
    const ext = path.extname(it.name).toLowerCase();
    if (!allowedExt.has(ext)) continue;
    // skip obvious icon files (social icons, favicons)
    const lname = it.name.toLowerCase();
    if (lname.includes('icon') || lname.includes('favicon')) continue;
    files.push({ name: it.name, full, mtime: fs.statSync(full).mtimeMs });
  }

  // Normalize names and rename
  const mapping = [];
  for (const f of files) {
    const normalized = normalize(f.name);
    const target = path.join(imagesDir, normalized);
    const final = safeRename(f.full, target);
    const finalName = final ? path.basename(final) : f.name;
    mapping.push({ original: f.name, final: finalName, mtime: fs.statSync(path.join(imagesDir, finalName)).mtimeMs });
  }

  // Sort most-recent-first and exclude any remaining icon-like files
  mapping.sort((a, b) => b.mtime - a.mtime);
  const gallery = mapping
    .map(m => m.final)
    .filter(name => {
      const n = name.toLowerCase();
      return !(n.includes('icon') || n.includes('favicon'));
    });

  // Write gallery.json
  const outPath = path.join(imagesDir, 'gallery.json');
  fs.writeFileSync(outPath, JSON.stringify(gallery, null, 2), 'utf8');
  console.log('gallery.json written with', gallery.length, 'items');
}

try {
  scanAndNormalize();
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
