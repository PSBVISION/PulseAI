import * as faceapi from 'face-api.js';
import { UserProfile, RecognitionResult } from './types';

const CONFIDENCE_THRESHOLD = 0.6;
const DISTANCE_THRESHOLD = 0.5;

let modelsLoaded = false;

export const faceRecognitionManager = {
  async loadModels(): Promise<void> {
    if (modelsLoaded) return;
    
    try {
      // CDN URL for models
      const cdnUrl = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/models';
      
      // Load models - face-api.js auto-loads from path
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(cdnUrl),
        faceapi.nets.faceLandmark68.loadFromUri(cdnUrl),
        faceapi.nets.faceRecognitionNet.loadFromUri(cdnUrl),
      ]);
      
      modelsLoaded = true;
    } catch (error) {
      console.error('Error loading face recognition models:', error);
      throw new Error(
        'Could not load face recognition models. Please check your internet connection.'
      );
    }
  },

  async detectAndExtractDescriptor(
    video: HTMLVideoElement | HTMLCanvasElement
  ): Promise<Float32Array | null> {
    try {
      const detections = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        return null;
      }

      return detections.descriptor;
    } catch (error) {
      console.error('Error detecting face:', error);
      return null;
    }
  },

  calculateDistance(
    descriptor1: Float32Array | number[],
    descriptor2: Float32Array | number[]
  ): number {
    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
      const diff = descriptor1[i] - descriptor2[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  },

  async recognizeUser(
    videoElement: HTMLVideoElement,
    users: UserProfile[]
  ): Promise<RecognitionResult> {
    if (users.length === 0) {
      return { recognized: false };
    }

    try {
      const descriptor = await faceRecognitionManager.detectAndExtractDescriptor(
        videoElement
      );

      if (!descriptor) {
        return { recognized: false };
      }

      let bestMatch: { user: UserProfile; distance: number } | null = null;

      for (const user of users) {
        const distance = faceRecognitionManager.calculateDistance(
          descriptor,
          user.faceDescriptor
        );

        if (distance < DISTANCE_THRESHOLD) {
          if (!bestMatch || distance < bestMatch.distance) {
            bestMatch = { user, distance };
          }
        }
      }

      if (bestMatch) {
        const confidence = Math.max(
          0,
          1 - bestMatch.distance / DISTANCE_THRESHOLD
        );
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
