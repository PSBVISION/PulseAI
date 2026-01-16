# CIFAR-10 Image Classification Challenge

## Problem Statement
Multi-level image classification challenge using the CIFAR-10 dataset (60,000 images × 10 classes).

## Dataset
- **Name**: CIFAR-10
- **Size**: 60,000 images (50,000 train + 10,000 test)
- **Classes**: Airplane, Automobile, Bird, Cat, Deer, Dog, Frog, Horse, Ship, Truck
- **Image Size**: 32×32 pixels (RGB)
- **Download Size**: 162 MB

## Dataset Split
- **Train**: 80% (40,000 images from original train set)
- **Validation**: 10% (10,000 images from original train set)
- **Test**: 10% (10,000 images - official test set)

## Project Structure
```
├── README.md                 # This file
├── Level1.ipynb             # Level 1: Baseline Model
├── Level2.ipynb             # Level 2: Intermediate Techniques
├── Level3.ipynb             # Level 3: Advanced Architecture
├── Level4.ipynb             # Level 4: Expert Techniques
├── Level5.ipynb             # Level 5: Production System (Optional)
├── models/                  # Saved model files
├── results/                 # Accuracy plots, confusion matrices
└── requirements.txt         # Python dependencies
```

## Levels Completed
- [ ] Level 1: Baseline Model (Target: ≥85% accuracy)
- [ ] Level 2: Intermediate Techniques (Target: ≥90% accuracy)
- [ ] Level 3: Advanced Architecture (Target: ≥91% accuracy)
- [ ] Level 4: Expert Techniques (Target: ≥93% accuracy)
- [ ] Level 5: Production System (Target: ≥95% accuracy)

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Notebooks
Open notebooks in Google Colab or Jupyter and run cells sequentially.

### 3. Dataset Download
Dataset auto-downloads when running the notebooks.

## Results Summary
| Level | Model | Accuracy | Notes |
|-------|-------|----------|-------|
| 1 | ResNet50 (Transfer Learning) | TBD | Baseline |
| 2 | ResNet50 + Augmentation | TBD | With data augmentation |
| 3 | Custom Architecture | TBD | Attention mechanisms |
| 4 | Ensemble | TBD | Multiple models voting |
| 5 | Compressed Model | TBD | Production-ready |

## Author
Punit

## Submission Date
January 16, 2026
