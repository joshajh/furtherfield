import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function captureBrandmark() {
  console.log('Capturing brandmark with acid tops...');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 400, height: 400 });

  // Create HTML with the brandmark CSS
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

  const outputPath = path.join(__dirname, '..', 'public', 'brandmark-acid-top.png');
  await page.screenshot({
    path: outputPath,
    type: 'png',
    omitBackground: true,
  });

  await browser.close();

  console.log(`Brandmark saved to: ${outputPath}`);
}

captureBrandmark().catch(console.error);
