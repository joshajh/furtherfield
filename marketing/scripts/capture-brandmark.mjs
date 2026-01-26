import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import GIFEncoder from 'gifencoder';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function captureBrandmark() {
  const mode = process.argv[2] || 'gif'; // 'gif', 'video', or 'png'
  const duration = parseInt(process.argv[3]) || 15; // seconds
  const fps = parseInt(process.argv[4]) || 30; // frames per second for gif

  console.log(`Capturing brandmark as ${mode}...`);

  const browser = await chromium.launch();

  const outputDir = path.join(__dirname, '..', 'public');
  const framesDir = path.join(outputDir, 'brandmark-frames');

  const contextOptions = {
    viewport: { width: 400, height: 400 },
  };

  // Enable video recording for video mode
  if (mode === 'video') {
    contextOptions.recordVideo = {
      dir: outputDir,
      size: { width: 400, height: 400 },
    };
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  // Create HTML with the brandmark CSS and rotation animation
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; }
        body {
          width: 400px;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
        }
        .brandmark {
          width: 250px;
          height: 250px;
          perspective: 1000px;
        }
        .brandmark-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transform: rotateX(-30deg) rotateY(-45deg);
          animation: brandmark-spin ${duration}s linear infinite;
        }
        @keyframes brandmark-spin {
          from { transform: rotateX(-30deg) rotateY(-45deg); }
          to { transform: rotateX(-30deg) rotateY(315deg); }
        }
        .cube {
          position: absolute;
          width: 50px;
          height: 50px;
          transform-style: preserve-3d;
          left: 50%;
          top: 50%;
          margin-left: -25px;
          margin-top: -25px;
        }
        .face {
          position: absolute;
          width: 50px;
          height: 50px;
          border: 0.5px solid #0F0E0E;
          box-sizing: border-box;
        }
        .face-front { transform: translateZ(25px); background: linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%); }
        .face-back { transform: rotateY(180deg) translateZ(25px); background: rgba(200, 255, 0, 0.85); }
        .face-right { transform: rotateY(90deg) translateZ(25px); background: linear-gradient(180deg, #BCE5F3 0%, #D0D6FD 100%); }
        .face-left { transform: rotateY(-90deg) translateZ(25px); background: rgba(200, 255, 0, 0.85); }
        .face-top { transform: rotateX(90deg) translateZ(25px); background: rgba(200, 255, 0, 0.85); }
        .face-bottom { transform: rotateX(-90deg) translateZ(25px); background: rgba(200, 255, 0, 0.85); }

        .cube1 { transform: translate3d(-25px, -50px, -25px); }
        .cube2 { transform: translate3d(25px, 0px, -25px); }
        .cube3 { transform: translate3d(-25px, 0px, 25px); }
        .cube4 { transform: translate3d(25px, 50px, 25px); }
      </style>
    </head>
    <body>
      <div class="brandmark">
        <div class="brandmark-inner">
          <div class="cube cube1">
            <div class="face face-front"></div>
            <div class="face face-back"></div>
            <div class="face face-right"></div>
            <div class="face face-left"></div>
            <div class="face face-top"></div>
            <div class="face face-bottom"></div>
          </div>
          <div class="cube cube2">
            <div class="face face-front"></div>
            <div class="face face-back"></div>
            <div class="face face-right"></div>
            <div class="face face-left"></div>
            <div class="face face-top"></div>
            <div class="face face-bottom"></div>
          </div>
          <div class="cube cube3">
            <div class="face face-front"></div>
            <div class="face face-back"></div>
            <div class="face face-right"></div>
            <div class="face face-left"></div>
            <div class="face face-top"></div>
            <div class="face face-bottom"></div>
          </div>
          <div class="cube cube4">
            <div class="face face-front"></div>
            <div class="face face-back"></div>
            <div class="face face-right"></div>
            <div class="face face-left"></div>
            <div class="face face-top"></div>
            <div class="face face-bottom"></div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(500);

  if (mode === 'png') {
    const outputPath = path.join(outputDir, 'brandmark-acid-top.png');
    await page.screenshot({
      path: outputPath,
      type: 'png',
      omitBackground: true,
    });
    console.log(`Brandmark PNG saved to: ${outputPath}`);
  } else if (mode === 'gif') {
    // Capture frames and create GIF with transparency
    const totalFrames = duration * fps;
    const frameDelay = 1000 / fps;
    const gifPath = path.join(outputDir, 'brandmark-rotating.gif');

    console.log(`Capturing ${totalFrames} frames at ${fps}fps...`);

    // Set up GIF encoder
    const encoder = new GIFEncoder(400, 400);
    const gifStream = fs.createWriteStream(gifPath);
    encoder.createReadStream().pipe(gifStream);

    encoder.start();
    encoder.setRepeat(0); // 0 = loop forever
    encoder.setDelay(Math.round(1000 / fps)); // frame delay in ms
    encoder.setQuality(10); // image quality (lower = better)
    encoder.setTransparent(0x000000); // black as transparent

    for (let i = 0; i < totalFrames; i++) {
      const buffer = await page.screenshot({
        type: 'png',
        omitBackground: true,
      });

      // Parse PNG and add frame
      const png = PNG.sync.read(buffer);

      // Convert transparent pixels to black (our transparent color)
      for (let j = 0; j < png.data.length; j += 4) {
        if (png.data[j + 3] === 0) {
          // Fully transparent pixel - set to black
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
  } else {
    // Record for the duration of one full rotation
    console.log(`Recording ${duration} second rotation...`);
    await page.waitForTimeout(duration * 1000);
  }

  await page.close();
  await context.close();
  await browser.close();

  if (mode === 'video') {
    console.log(`Brandmark video saved to: ${outputDir}/`);
    console.log('Note: Playwright saves videos with auto-generated names. Check the public folder.');
  }
}

captureBrandmark().catch(console.error);
