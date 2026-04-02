import { UserProfile, RecognitionResult } from './types';

const DISTANCE_THRESHOLD = 0.6;
const CONFIDENCE_THRESHOLD = 0.6;

declare global {
  interface Window {
    tf?: any;
    blazeface?: any;
  }
}

let modelsLoaded = false;
let blazefaceModel: any = null;

// Generate a simple face descriptor from canvas image data
function generateFaceDescriptorFromPixels(canvas: HTMLCanvasElement, prediction: any): Float32Array {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get canvas context');

  let x = 0, y = 0, width = canvas.width, height = canvas.height;

  // Handle different BlazeFace output formats
  if (prediction && prediction.start && prediction.end) {
    // Standard format: { start: [x, y], end: [x, y] }
    x = Math.max(0, Math.floor(prediction.start[0]));
    y = Math.max(0, Math.floor(prediction.start[1]));
    width = Math.floor(prediction.end[0] - prediction.start[0]);
    height = Math.floor(prediction.end[1] - prediction.start[1]);
  } else if (prediction && Array.isArray(prediction.landmarks) && prediction.landmarks.length > 0) {
    // Landmarks format: extract bounding box from landmarks
    const landmarks = prediction.landmarks;
    const xs = landmarks.map((p: any) => Array.isArray(p) ? p[0] : p.x);
    const ys = landmarks.map((p: any) => Array.isArray(p) ? p[1] : p.y);
    x = Math.max(0, Math.floor(Math.min(...xs)) - 10);
    y = Math.max(0, Math.floor(Math.min(...ys)) - 10);
    width = Math.floor(Math.max(...xs) - Math.min(...xs)) + 20;
    height = Math.floor(Math.max(...ys) - Math.min(...ys)) + 20;
  }

  // Clamp to canvas bounds
  x = Math.min(x, canvas.width - 1);
  y = Math.min(y, canvas.height - 1);
  width = Math.min(width, canvas.width - x);
  height = Math.min(height, canvas.height - y);

  if (width <= 0 || height <= 0) {
    console.warn('Invalid face region, using full canvas');
    x = 0;
    y = 0;
    width = canvas.width;
    height = canvas.height;
  }

  // Extract image data
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data;

  // Create a 128-dimensional descriptor from face pixels
  const descriptor = new Float32Array(128);

  // Divide face into 16x8 grid (128 cells) and compute average intensity
  const cellWidth = width / 16;
  const cellHeight = height / 8;

  let cellIdx = 0;
  for (let gy = 0; gy < 8; gy++) {
    for (let gx = 0; gx < 16; gx++) {
      let sum = 0;
      let count = 0;

      const startX = Math.floor(gx * cellWidth);
      const endX = Math.floor((gx + 1) * cellWidth);
      const startY = Math.floor(gy * cellHeight);
      const endY = Math.floor((gy + 1) * cellHeight);

      for (let py = startY; py < endY; py++) {
        for (let px = startX; px < endX; px++) {
          if (px < width && py < height) {
            const idx = (py * width + px) * 4;
            // Convert to grayscale
            const gray = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
            sum += gray;
            count++;
          }
        }
      }

      descriptor[cellIdx] = count > 0 ? sum / count : 0;
      cellIdx++;
    }
  }

  // Normalize descriptor
  let mean = 0;
  for (let i = 0; i < 128; i++) {
    mean += descriptor[i];
  }
  mean /= 128;

  let stdDev = 0;
  for (let i = 0; i < 128; i++) {
    stdDev += Math.pow(descriptor[i] - mean, 2);
  }
  stdDev = Math.sqrt(stdDev / 128);

  for (let i = 0; i < 128; i++) {
    if (stdDev > 0) {
      descriptor[i] = (descriptor[i] - mean) / stdDev;
    }
  }

  return descriptor;
}

export const faceRecognitionManager = {
  async loadModels(): Promise<void> {
    if (modelsLoaded) return;

    try {
      console.log('Loading BlazeFace model...');

      // Check if required libraries are loaded
      if (typeof window !== 'undefined' && window.blazeface) {
        blazefaceModel = await window.blazeface.load();
        modelsLoaded = true;
        console.log('✓ BlazeFace model loaded');
        return;
      }

      // Fallback: try loading via script dynamically
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0';
      script.async = true;

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      const blazeFaceScript = document.createElement('script');
      blazeFaceScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7';
      blazeFaceScript.async = true;

      await new Promise((resolve, reject) => {
        blazeFaceScript.onload = resolve;
        blazeFaceScript.onerror = reject;
        document.head.appendChild(blazeFaceScript);
      });

      if (window.blazeface) {
        blazefaceModel = await window.blazeface.load();
        modelsLoaded = true;
        console.log('✓ BlazeFace model loaded from CDN');
      } else {
        throw new Error('BlazeFace library not available');
      }
    } catch (error) {
      console.error('Error loading BlazeFace:', error);
      modelsLoaded = false;
      throw error;
    }
  },

  async detectAndExtractDescriptor(canvas: HTMLCanvasElement): Promise<Float32Array | null> {
    try {
      if (!modelsLoaded || !blazefaceModel) {
        await faceRecognitionManager.loadModels();
      }

      if (!blazefaceModel) {
        console.warn('BlazeFace model not available, using full image descriptor');
      }

      // Detect faces
      let predictions: any[] = [];
      
      if (blazefaceModel) {
        try {
          predictions = await blazefaceModel.estimateFaces(canvas, false);
          console.log('BlazeFace predictions:', predictions);
        } catch (err) {
          console.warn('Face detection failed:', err);
        }
      }

      if (predictions.length === 0) {
        // Fallback: create descriptor from full image
        console.warn('No faces detected, using full image descriptor');
        return generateFaceDescriptorFromPixels(canvas, {});
      }

      // Use first detected face
      const prediction = predictions[0];
      console.log('Using face prediction:', prediction);
      const descriptor = generateFaceDescriptorFromPixels(canvas, prediction);

      console.log('Face descriptor extracted successfully');
      return descriptor;
    } catch (error) {
      console.error('Error detecting face:', error);
      return null;
    }
  },

  calculateDistance(descriptor1: Float32Array | number[], descriptor2: Float32Array | number[]): number {
    let sum = 0;
    const len = Math.min(descriptor1.length, descriptor2.length);
    for (let i = 0; i < len; i++) {
      const diff = Number(descriptor1[i]) - Number(descriptor2[i]);
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  },

  async recognizeUser(canvas: HTMLCanvasElement, users: UserProfile[]): Promise<RecognitionResult> {
    if (users.length === 0) {
      return { recognized: false };
    }

    try {
      const descriptor = await faceRecognitionManager.detectAndExtractDescriptor(canvas);

      if (!descriptor) {
        return { recognized: false };
      }

      let bestMatch: { user: UserProfile; distance: number } | null = null;

      for (const user of users) {
        const distance = faceRecognitionManager.calculateDistance(descriptor, user.faceDescriptor);

        console.log(`Distance to ${user.name}:`, distance);

        if (!bestMatch || distance < bestMatch.distance) {
          bestMatch = { user, distance };
        }
      }

      if (bestMatch && bestMatch.distance < DISTANCE_THRESHOLD) {
        const confidence = Math.max(0, 1 - bestMatch.distance / DISTANCE_THRESHOLD);
        return {
          recognized: confidence > CONFIDENCE_THRESHOLD,
          userId: bestMatch.user.id,
          confidence,
          user: bestMatch.user,
        };
      }

      return { recognized: false };
    } catch (error) {
      console.error('Error recognizing user:', error);
      return { recognized: false };
    }
  },

  async captureFrame(videoElement: HTMLVideoElement): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(videoElement, 0, 0);
    }

    return canvas;
  },
};
