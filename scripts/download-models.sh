#!/bin/bash
# Download face-api.js models

MODELS_DIR="public/models"
BASE_URL="https://raw.githubusercontent.com/vladmandic/face-api/master/model"

mkdir -p "$MODELS_DIR"

echo "Downloading face-api.js models..."

# Download model files
curl -L "$BASE_URL/tiny_face_detector_model-weights_manifest.json" -o "$MODELS_DIR/tiny_face_detector_model-weights_manifest.json"
curl -L "$BASE_URL/tiny_face_detector_model-weights.bin" -o "$MODELS_DIR/tiny_face_detector_model-weights.bin"
curl -L "$BASE_URL/face_landmark_68_model-weights_manifest.json" -o "$MODELS_DIR/face_landmark_68_model-weights_manifest.json"
curl -L "$BASE_URL/face_landmark_68_model-weights.bin" -o "$MODELS_DIR/face_landmark_68_model-weights.bin"
curl -L "$BASE_URL/face_recognition_model-weights_manifest.json" -o "$MODELS_DIR/face_recognition_model-weights_manifest.json"
curl -L "$BASE_URL/face_recognition_model-weights.bin" -o "$MODELS_DIR/face_recognition_model-weights.bin"

echo "✓ Models downloaded to $MODELS_DIR"
