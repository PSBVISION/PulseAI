# Face-API.js Models

This directory should contain the face-api.js pre-trained models required for face detection and recognition.

## Download Instructions

### Automated Download

**Windows:**
```bash
cd scripts
download-models.bat
```

**macOS/Linux:**
```bash
bash scripts/download-models.sh
```

### Manual Download

Download the following files from the face-api.js GitHub repository:
https://github.com/vladmandic/face-api/tree/master/model

Required files:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-weights.bin`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-weights.bin`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-weights.bin`

Place all files in this directory: `public/models/`

## What These Models Do

- **tiny_face_detector** - Detects faces in images/video
- **face_landmark_68** - Identifies 68 facial landmark points
- **face_recognition** - Extracts face descriptors for comparison

## Size

Total size: ~35-40 MB

## Notes

- Models are loaded once at startup
- They stay in memory during the session
- Models are not sent to any external service
- Only the extracted descriptors are used for recognition
