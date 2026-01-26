import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import GIFEncoder from 'gifencoder';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function captureGlitchText() {
  const duration = parseInt(process.argv[2]) || 6; // seconds (2 full glitch cycles at 3s each)
  const fps = parseInt(process.argv[3]) || 30;

  console.log(`Capturing glitch text as GIF (${duration}s at ${fps}fps)...`);

  const browser = await chromium.launch();
  const outputDir = path.join(__dirname, '..', 'public');

  const context = await browser.newContext({
    viewport: { width: 800, height: 400 },
  });
  const page = await context.newPage();

  // Create HTML with the glitch effect
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: 800px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }

        .title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 72px;
          line-height: 0.9;
          color: #0F0E0E;
          text-align: left;
        }

        .line1 {
          font-style: italic;
        }

        /* Two-color glitch effect */
        .glitch-base-text {
          position: relative;
          display: inline-block;
          isolation: isolate;
        }

        /* Acid glitch (yellow-green) */
        .glitch-base-text::before {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          color: rgba(200, 255, 0, 1);
          z-index: 1;
          opacity: 0;
          transform-origin: left center;
          animation: acid-glitch 3s ease-in-out infinite;
          pointer-events: none;
        }

        /* Lemon glitch */
        .glitch-base-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          color: #EDFF4C;
          z-index: 2;
          opacity: 0;
          transform-origin: left center;
          animation: lemon-glitch 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes acid-glitch {
          0%, 70%, 82%, 100% {
            opacity: 0;
            transform: translate(0);
          }
          72% {
            opacity: 1;
            transform: translate(6px, 3px);
          }
          74% {
            opacity: 1;
            transform: translate(5px, 2px);
          }
          76% {
            opacity: 1;
            transform: translate(7px, 4px);
          }
          78% {
            opacity: 1;
            transform: translate(5px, 3px);
          }
          80% {
            opacity: 1;
            transform: translate(6px, 2px);
          }
        }

        @keyframes lemon-glitch {
          0%, 70%, 82%, 100% {
            opacity: 0;
            transform: translate(0);
          }
          72% {
            opacity: 1;
            transform: translate(-2px, -3px);
          }
          74% {
            opacity: 1;
            transform: translate(-1px, -2px);
          }
          76% {
            opacity: 1;
            transform: translate(-3px, -3px);
          }
          78% {
            opacity: 1;
            transform: translate(-2px, -2px);
          }
          80% {
            opacity: 1;
            transform: translate(-2px, -3px);
          }
        }
      </style>
    </head>
    <body>
      <div class="title">
        <span class="line1">
          <span class="glitch-base-text" data-text="Reimagine">
            <span style="position: relative; z-index: 10;">Reimagine</span>
          </span>
        </span>
        <br>
        <span class="line2">This Coastal Town</span>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  // Wait for font to load
  await page.waitForTimeout(1000);

  const totalFrames = duration * fps;
  const frameDelay = 1000 / fps;
  const gifPath = path.join(outputDir, 'glitch-text.gif');

  console.log(`Capturing ${totalFrames} frames at ${fps}fps...`);

  // Set up GIF encoder
  const encoder = new GIFEncoder(800, 400);
  const gifStream = fs.createWriteStream(gifPath);
  encoder.createReadStream().pipe(gifStream);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(Math.round(1000 / fps));
  encoder.setQuality(10);
  encoder.setTransparent(0x000000);

  for (let i = 0; i < totalFrames; i++) {
    const buffer = await page.screenshot({
      type: 'png',
      omitBackground: true,
    });

    const png = PNG.sync.read(buffer);

    // Convert transparent pixels to black (transparent color)
    for (let j = 0; j < png.data.length; j += 4) {
      if (png.data[j + 3] === 0) {
        png.data[j] = 0;
        png.data[j + 1] = 0;
        png.data[j + 2] = 0;
      }
    }

    encoder.addFrame(png.data);
    await page.waitForTimeout(frameDelay);

    if (i % 10 === 0) {
      console.log(`  Frame ${i + 1}/${totalFrames}`);
    }
  }

  encoder.finish();
  console.log(`GIF saved to: ${gifPath}`);

  await page.close();
  await context.close();
  await browser.close();
}

captureGlitchText().catch(console.error);
