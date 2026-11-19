// Restore QR sampling throughout the continuous ImageGen portrait mosaic.
// Rebuild with: node scripts/build-portrait-qr.mjs (no packages required).
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { matrix, url } = JSON.parse(fs.readFileSync(path.join(root, 'scripts/qr-matrix.json'), 'utf8'));
const art = fs.readFileSync(path.join(root, 'images/portrait-qr-art.png')).toString('base64');
const size = 1254;
const cells = matrix.length;
const pitch = size / cells;
const n = cells - 8;
const core = 0.50;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Portrait QR code for Chunzheng Li's homepage"><title>Chunzheng Li — portrait QR code</title><desc>Scans to ${url}</desc><rect width="100%" height="100%" fill="white"/><image href="data:image/png;base64,${art}" width="${size}" height="${size}"/>`;

for (let row = 0; row < cells; row++) {
  for (let col = 0; col < cells; col++) {
    const x = col - 4;
    const y = row - 4;
    const quiet = x < 0 || y < 0 || x >= n || y >= n;
    if (quiet) continue;
    // Version 6: finders, separators, timing, format strips, and alignment.
    const control = (x <= 8 && y <= 8) || (x >= n - 8 && y <= 8)
      || (x <= 8 && y >= n - 8) || x === 6 || y === 6 || x === 8 || y === 8
      || (Math.abs(x - 34) <= 2 && Math.abs(y - 34) <= 2);
    const side = pitch * (control ? 1 : core);
    const inset = (pitch - side) / 2;
    const fill = !matrix[row][col] ? 'white' : 'black';
    svg += `<rect x="${(col * pitch + inset).toFixed(3)}" y="${(row * pitch + inset).toFixed(3)}" width="${side.toFixed(3)}" height="${side.toFixed(3)}" fill="${fill}" shape-rendering="${control ? 'crispEdges' : 'auto'}"/>`;
  }
}

// Solid border strips keep the quiet zone free of rasterized cell seams.
const quietWidth = pitch * 4;
svg += `<g fill="white"><rect width="${size}" height="${quietWidth}"/><rect y="${size-quietWidth}" width="${size}" height="${quietWidth}"/><rect width="${quietWidth}" height="${size}"/><rect x="${size-quietWidth}" width="${quietWidth}" height="${size}"/></g>`;
fs.writeFileSync(path.join(root, 'images/portrait-qr.svg'), svg + '</svg>');
console.log(`Built portrait QR for ${url}`);
