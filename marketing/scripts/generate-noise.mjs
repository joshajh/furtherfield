import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SIZE = 3000;
const FREQUENCY = 0.85;

async function generateNoiseTexture() {
  console.log(`Generating ${SIZE}x${SIZE} noise texture...`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to match our desired size
  await page.setViewportSize({ width: SIZE, height: SIZE });

  // Create HTML with the SVG noise pattern
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body { width: ${SIZE}px; height: ${SIZE}px; overflow: hidden; }
        .noise {
          width: ${SIZE}px;
          height: ${SIZE}px;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${FREQUENCY}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      </style>
    </head>
    <body>
      <div class="noise"></div>
    </body>
    </html>
  `;

  await page.setContent(html);

  // Wait for rendering
  await page.waitForTimeout(500);

  // Screenshot as PNG
  const outputPath = path.join(__dirname, '..', 'public', 'noise-texture-3000px.png');
  await page.screenshot({
    path: outputPath,
    type: 'png',
    fullPage: false,
    clip: { x: 0, y: 0, width: SIZE, height: SIZE }
  });

  await browser.close();

  console.log(`Noise texture saved to: ${outputPath}`);
  console.log('You can use this PNG in Canva with overlay blend mode at ~60% opacity');
}

generateNoiseTexture().catch(console.error);
