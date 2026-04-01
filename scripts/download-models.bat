@echo off
REM Download face-api.js models for Windows

setlocal enabledelayedexpansion
set MODELS_DIR=public\models
set BASE_URL=https://raw.githubusercontent.com/vladmandic/face-api/master/model

if not exist "%MODELS_DIR%" mkdir "%MODELS_DIR%"

echo Downloading face-api.js models...

REM Download model files
powershell -command "(New-Object Net.WebClient).DownloadFile('!BASE_URL!/tiny_face_detector_model-weights_manifest.json', '%MODELS_DIR%\tiny_face_detector_model-weights_manifest.json')"
powershell -command "(New-Object Net.WebClient).DownloadFile('!BASE_URL!/tiny_face_detector_model-weights.bin', '%MODELS_DIR%\tiny_face_detector_model-weights.bin')"
powershell -command "(New-Object Net.WebClient).DownloadFile('!BASE_URL!/face_landmark_68_model-weights_manifest.json', '%MODELS_DIR%\face_landmark_68_model-weights_manifest.json')"
powershell -command "(New-Object Net.WebClient).DownloadFile('!BASE_URL!/face_landmark_68_model-weights.bin', '%MODELS_DIR%\face_landmark_68_model-weights.bin')"
powershell -command "(New-Object Net.WebClient).DownloadFile('!BASE_URL!/face_recognition_model-weights_manifest.json', '%MODELS_DIR%\face_recognition_model-weights_manifest.json')"
powershell -command "(New-Object Net.WebClient).DownloadFile('!BASE_URL!/face_recognition_model-weights.bin', '%MODELS_DIR%\face_recognition_model-weights.bin')"

echo Models downloaded to %MODELS_DIR%
pause
