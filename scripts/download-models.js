const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const MODELS_DIR = path.join(__dirname, '..', 'public', 'models');

// Try multiple sources for the models
const URLS = {
  'tiny_face_detector_model-weights_manifest.json': [
    'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models/tiny_face_detector_model-weights_manifest.json',
    'https://unpkg.com/face-api.js@0.22.2/dist/models/tiny_face_detector_model-weights_manifest.json',
  ],
  'tiny_face_detector_model-weights.bin': [
    'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models/tiny_face_detector_model-weights.bin',
    'https://unpkg.com/face-api.js@0.22.2/dist/models/tiny_face_detector_model-weights.bin',
  ],
  'face_landmark_68_model-weights_manifest.json': [
    'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models/face_landmark_68_model-weights_manifest.json',
    'https://unpkg.com/face-api.js@0.22.2/dist/models/face_landmark_68_model-weights_manifest.json',
  ],
  'face_landmark_68_model-weights.bin': [
    'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models/face_landmark_68_model-weights.bin',
    'https://unpkg.com/face-api.js@0.22.2/dist/models/face_landmark_68_model-weights.bin',
  ],
  'face_recognition_model-weights_manifest.json': [
    'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models/face_recognition_model-weights_manifest.json',
    'https://unpkg.com/face-api.js@0.22.2/dist/models/face_recognition_model-weights_manifest.json',
  ],
  'face_recognition_model-weights.bin': [
    'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models/face_recognition_model-weights.bin',
    'https://unpkg.com/face-api.js@0.22.2/dist/models/face_recognition_model-weights.bin',
  ],
};

// Create models directory if it doesn't exist
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

console.log('📥 Downloading face-api.js models...');
console.log(`📁 Destination: ${MODELS_DIR}\n`);

let completed = 0;
let failed = 0;

const downloadFile = (urls, dest) => {
  return new Promise((resolve, reject) => {
    let urlIndex = 0;

    const tryDownload = () => {
      if (urlIndex >= urls.length) {
        reject(new Error('All download sources failed'));
        return;
      }

      const url = urls[urlIndex];
      const protocol = url.startsWith('https') ? https : http;

      protocol
        .get(url, { timeout: 30000 }, (response) => {
          if (response.statusCode !== 200) {
            urlIndex++;
            tryDownload();
            return;
          }

          const fileStream = fs.createWriteStream(dest);
          response.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });

          fileStream.on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
          });
        })
        .on('error', () => {
          urlIndex++;
          tryDownload();
        });
    };

    tryDownload();
  });
};

const files = Object.keys(URLS);

files.forEach((file) => {
  const filePath = path.join(MODELS_DIR, file);
  const urls = URLS[file];

  downloadFile(urls, filePath)
    .then(() => {
      completed++;
      const size = fs.statSync(filePath).size;
      console.log(`✅ Downloaded: ${file} (${(size / 1024 / 1024).toFixed(2)} MB)`);

      if (completed + failed === files.length) {
        if (failed === 0) {
          console.log(`\n✨ Successfully downloaded all ${files.length} model files!`);
          console.log('🚀 Ready to run: npm run dev\n');
        } else {
          console.log(
            `\n⚠️  Downloaded ${completed}/${files.length} files. ${failed} failed.`
          );
          console.log('See instructions in public/models/README.md for manual download.');
          process.exit(1);
        }
      }
    })
    .catch((err) => {
      failed++;
      console.error(`❌ Failed to download ${file}`);

      if (completed + failed === files.length) {
        console.log(
          `\n⚠️  Could not download models automatically.`
        );
        console.log(
          '\n📖 MANUAL DOWNLOAD INSTRUCTIONS:'
        );
        console.log(
          '1. Visit: https://github.com/vladmandic/face-api/tree/master/model'
        );
        console.log('2. Download all .json and .bin files');
        console.log(
          `3. Place them in: ${MODELS_DIR}`
        );
        console.log(
          '\n   Or use jsdelivr CDN links from the repo directly.'
        );
        process.exit(1);
      }
    });
});
