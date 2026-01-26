import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import GIFEncoder from 'gifencoder';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function captureTidalGrid() {
  const duration = parseInt(process.argv[2]) || 10; // seconds
  const fps = parseInt(process.argv[3]) || 20;
  const size = parseInt(process.argv[4]) || 3000;

  console.log(`Capturing tidal grid as GIF (${size}x${size}, ${duration}s at ${fps}fps)...`);

  const browser = await chromium.launch();
  const outputDir = path.join(__dirname, '..', 'public');

  const context = await browser.newContext({
    viewport: { width: size, height: size },
  });
  const page = await context.newPage();

  // Recreate the TidalGrid SVG with animation in pure HTML/JS
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: ${size}px;
          height: ${size}px;
          background: transparent;
          overflow: hidden;
        }
        svg {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <svg id="grid" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"></svg>
      <script>
        const gridSize = 16;
        const waveAmplitude = 6;
        const waveFrequency = 2.5;
        const strokeColor = '#9A8B55';
        const strokeWidth = 0.8;
        const animationSpeed = 0.0003;

        const viewBoxSize = 100;
        const cellSize = viewBoxSize / gridSize;

        let animationPhase = 0;
        const svg = document.getElementById('grid');

        function generateWavyPath(x1, y1, x2, y2, waveParams, direction, lineIndex) {
          const segments = 35;
          let d = \`M \${x1.toFixed(2)} \${y1.toFixed(2)}\`;

          for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            let x, y;

            if (direction === 'horizontal') {
              x = x1 + (x2 - x1) * t;
              const wave = Math.sin(
                t * Math.PI * 2 * waveParams.frequency +
                waveParams.phase +
                lineIndex * 0.3
              ) * waveParams.amplitude;
              y = y1 + wave;
            } else {
              const wave = Math.sin(
                t * Math.PI * 2 * waveParams.frequency +
                waveParams.phase +
                lineIndex * 0.3
              ) * waveParams.amplitude;
              x = x1 + wave;
              y = y1 + (y2 - y1) * t;
            }

            d += \` L \${x.toFixed(2)} \${y.toFixed(2)}\`;
          }

          return d;
        }

        function render() {
          const waveParams = {
            amplitude: waveAmplitude,
            frequency: waveFrequency,
            phase: animationPhase
          };

          let paths = '';

          // Horizontal lines
          for (let i = 0; i <= gridSize; i++) {
            const y = i * cellSize;
            const d = generateWavyPath(0, y, viewBoxSize, y, waveParams, 'horizontal', i);
            paths += \`<path d="\${d}" stroke="\${strokeColor}" stroke-width="\${strokeWidth}" fill="none" vector-effect="non-scaling-stroke"/>\`;
          }

          // Vertical lines
          for (let i = 0; i <= gridSize; i++) {
            const x = i * cellSize;
            const d = generateWavyPath(x, 0, x, viewBoxSize, waveParams, 'vertical', i);
            paths += \`<path d="\${d}" stroke="\${strokeColor}" stroke-width="\${strokeWidth}" fill="none" vector-effect="non-scaling-stroke"/>\`;
          }

          svg.innerHTML = paths;
        }

        let lastTime = 0;
        function animate(timestamp) {
          if (!lastTime) lastTime = timestamp;
          const delta = timestamp - lastTime;
          lastTime = timestamp;

          animationPhase = (animationPhase + delta * animationSpeed) % (Math.PI * 2);
          render();
          requestAnimationFrame(animate);
        }

        render();
        requestAnimationFrame(animate);
      </script>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(500);

  const totalFrames = duration * fps;
  const frameDelay = 1000 / fps;
  const gifPath = path.join(outputDir, 'tidal-grid.gif');

  console.log(`Capturing ${totalFrames} frames at ${fps}fps...`);
  console.log(`This may take a while for ${size}x${size} resolution...`);

  // Set up GIF encoder
  const encoder = new GIFEncoder(size, size);
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

    if (i % 5 === 0) {
      console.log(`  Frame ${i + 1}/${totalFrames}`);
    }
  }

  encoder.finish();
  console.log(`GIF saved to: ${gifPath}`);

  await page.close();
  await context.close();
  await browser.close();
}

captureTidalGrid().catch(console.error);
