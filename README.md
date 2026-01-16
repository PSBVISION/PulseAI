Hiring Challenge
Multi-Level Assessment Framework (Levels 1-5)
Challenge Duration: 10-20 hours (to be completed before the submission deadline)

Target Positions: AI/Computer Vision/ML Engineers

Ideal Submission: Till Level 4 completion with required quality

CHOOSE ONE OF 5 VERIFIED PROBLEM STATEMENTS
Option 1: CIFAR-10 Image Classification
Dataset: 60,000 images × 10 classes (32×32 pixels)

Classes: Airplane, Automobile, Bird, Cat, Deer, Dog, Frog, Horse, Ship, Truck
Download: 162 MB (auto-download available) Loadable directly via PyTorch or TensorFlow

from torchvision import datasets
datasets.CIFAR10(root='./data', download=True)
Resources:

https://www.tensorflow.org/datasets/catalog/cifar10
https://www.cs.toronto.edu/~kriz/cifar.html
TensorFlow/PyTorch/Keras built-in support
Option 2: STANFORD CARS Fine-Grained Classification
Dataset: 16,185 images × 196 classes (high-resolution)

High-resolution, fine-grained recognition task
2012 Tesla Model S, 2012 BMW M3 Coupe, 2010 Chevrolet Avalanche, etc.
Typically requires manual dataset download and annotation handling
Download: 1.5 GB

from torchvision import datasets
datasets.StanfordCars(root='./data', download=True)
Resources:

http://ai.stanford.edu/~jkrause/cars/car_dataset.html
https://www.kaggle.com/datasets/eduardo4jesus/stanford-cars-dataset
Option 3: FLOWERS-102 Flower Species Classification
Dataset: 8,189 images × 102 classes

Rose, Tulip, Bluebell, Daisy, Daffodil, and 97 more flower species
Download: 328 MB

import tensorflow_datasets as tfds
tfds.load('oxford_flowers102')
Resources:

https://www.robots.ox.ac.uk/~vgg/data/flowers/102/
https://huggingface.co/datasets/Voxel51/OxfordFlowers102
Option 4: CALTECH-256 Object Classification
Dataset: 30,607 images × 257 classes Diverse objects Requires manual dataset download

Diverse objects: animals, vehicles, people, household items, landmarks
Download: 1.2 GB

# Manual download or
git clone https://github.com/ultralytics/ultralytics
Resources:

https://docs.ultralytics.com/datasets/classify/caltech256/
Option 5: FOOD-101 Food Classification
Dataset: 101,000 images × 101 food categories

Pizza, Pasta, Sushi, Baked Goods, Desserts, etc.
Training data is NOISY (intentionally not cleaned)
Test data is CLEAN (manually reviewed)
Download: 4.7 GB

wget https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/food-101.tar.gz
tar -xzf food-101.tar.gz
Resources:

https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/
https://www.tensorflow.org/datasets/catalog/food101
Dataset Split Requirement (Mandatory)
For fairness and consistency, all participants must use:

Train: 80% Validation: 10% Test: 10%

If the dataset already provides a predefined train/test split, you must:

Use the official test split as test
Derive validation from training set to maintain 80-10-10 effective distribution
Clearly mention how you implemented this split in your submission.

5-LEVEL CHALLENGE STRUCTURE (IDENTICAL FOR ALL DATASETS)
LEVEL 1: Baseline Model
Problem: Build a baseline classifier using transfer learning

Expected Accuracy: 85-95% or plus (varies by dataset)

Approach: Like using ResNet50 transfer learning

Deliverables:

 Code notebook with data loading
 Trained baseline model
 Test accuracy metric
 Training curves visualization
Evaluation: Pass if accuracy ≥85% and code is clean

LEVEL 2: Intermediate Techniques
Problem: Improve performance with advanced techniques

Expected Accuracy: 90-95% or plus

Approach: Data augmentation, regularization, hyperparameter tuning

Deliverables:

 Augmentation pipeline
 Ablation study (with/without augmentation)
 Accuracy comparison table
 Analysis document
Evaluation: Pass if accuracy ≥90% and shows improvement analysis

LEVEL 3: Advanced Architecture Design
Problem: Design custom or multi-task architecture

Expected Accuracy: 91-93% or plus

Approach: Like Custom CNN, multi-task learning, or attention mechanisms

Deliverables:

 Architecture design document
 Custom model implementation
 Per-class performance analysis
 Visualization/interpretability (Grad-CAM, etc.)
 Insights and findings
Evaluation: Pass if accuracy ≥91% and analysis is insightful

LEVEL 4: Expert Techniques SHORTLIST THRESHOLD
Problem: Build ensemble model or use meta-learning/RL

Expected Accuracy: 93-97% or plus

Approach:

Ensemble learning like using voting
Meta-learning (MAML)
Reinforcement learning
Deliverables:

 Multiple trained models
 Ensemble voting strategy
 Comparative analysis
 Research-quality report (around 10 pages)
 Novel insights
Evaluation: Pass if accuracy ≥93% and report is publication-quality

LEVEL 5: Research/Production System
Problem: Build production-ready system with deployment

Expected Accuracy: 95%+ (supervised) + edge optimization

Approach:

Knowledge distillation + model compression
Uncertainty quantification
Real-time inference optimization
Vision-language integration (optional)
Deliverables:

 Compressed student model
 Quantized int8 version
 <100ms inference time
 Full deployment pipeline
 Technical documentation
Evaluation: Pass if complete system deployed with accuracy ≥ 95% and proper insights

EVALUATION CRITERIA & SCORING
Per Level: 100 Points Total
Component	Points	What We Check
Code Quality	20	Clean, documented, modular code
Implementation	20	Correct architecture, proper training
Results	30	Performance vs dataset difficulty
Analysis	20	Insightful explanation & visualizations
Documentation	10	README, Clarity & professionalism
Pass Thresholds:
Level 1: ≥70/100 points
Level 2: ≥72/100 points
Level 3: ≥75/100 points
Level 4: ≥78/100 points ← Ideal for shortlisting (Not a hard rule)
Level 5: ≥80/100 points
HOW TO PARTICIPATE
Step 1: Choose One Dataset
Pick from the 5 options above.

Step 2: Download Dataset
# CIFAR-10 
python -c "from torchvision import datasets; datasets.CIFAR10('./data', download=True)"

# FOOD-101 
wget https://data.vision.ee.ethz.ch/cvl/datasets_extra/food-101/food-101.tar.gz

# Or use TensorFlow/PyTorch built-in loaders
Step 3: Work Through Levels
Level 1 : Baseline model
Level 2 : Improvements
Level 3 : Advanced design
Level 4 : Expert techniques ← Ideal for shortlist (Not a hard rule)
Level 5 : Production system (Optional)
Step 4: Submit Solutions
Format:

├── README.md (with problem understanding & setup instructions)
├── level_1 code
├── level_2 code
├── level_3 code
├── level_4 code 
├── level_5 code (optional)
├── models/ (trained model files)
├── results/ (accuracy plots, confusion matrices)
└── requirements.txt
Note: The codes can be written in either a single or multiple Google Colab notebooks. Failure to include all notebook links in the submission document will result in disqualification.

FREQUENTLY ASKED QUESTIONS
Q: Do I need a GPU? A: Not required for Levels 1-2. A GPU significantly speeds up training for Levels 3-5. Free GPU available on Google Colab.

Q: Can I use existing code/libraries? A: Yes! We encourage using torchvision, timm, transformers, etc. But you must understand and explain the code.

Q: Can multiple students work together? A: No, individual submissions only. Plagiarism will result in disqualification.

Q: What if I don't complete all 5 levels? A: That's fine! Level 4 completion is the minimum for consideration.

Q: How long does this take? A: 10-20 hours depending on your experience and which levels you attempt.

Q: Can I use pre-trained models? A: Yes for Levels 1-2. For Level 3+, design your own architecture or fine-tune creatively.

Q: Will my code be kept private? A: Yes, all submissions are confidential and only reviewed by our hiring team.

SUBMISSION CHECKLIST
Before submitting, verify:

 Code runs without errors
 Dataset loads correctly
 Model trains and produces results
 README has clear instructions
 Results are reproducible
 Code is well-commented
 No hardcoded paths
 requirements.txt is complete
 No plagiarism (original work)
 Professional presentation
Submission Instructions (Mandatory)
All candidates must submit a SINGLE consolidated document (PDF) containing all levels completed.

What the document MUST include
1. Level-wise Completion
Clearly separate Level 1 → Level 5
Mention explicitly which levels you have completed
Partial submissions are allowed, but candidates completing up to Level 4(including this level) will be given priority
2. Google Colab Code Link (Mandatory)
Provide Google Colab notebook links
The notebook must be:
Public / accessible
Fully executable
Contain all code used across all levels
Outputs must be visible when the link is opened
Do NOT clear outputs before submission
Recommended: Google Colab (so evaluators can quickly view both code and results)

3. Results & Accuracy Proof
Include screenshots inside the document showing:

Training and validation metrics
Final evaluation results (RMSE / SMAPE / F1 / Accuracy, as applicable)
Sample outputs (predictions, visualizations, segmentation masks, detections, etc.)
Each screenshot must clearly mention:

Model name
Dataset split
Evaluation metric used
4. Code–Result Consistency
Results shown in screenshots must exactly match the outputs visible in the Colab notebook
Any mismatch between code and reported results may lead to disqualification
5. Explanation - requirements.txt (Concise but Clear)
For each completed level, briefly explain:

Approach taken
Model architecture and reasoning
Key design decisions
Observed failure cases or limitations (if any)
Important Notes
Submissions without a visible-output Google Colab link will NOT be evaluated
Code copied without understanding will be identified during review
Late submissions will not be considered
Candidates completing Level 4 with proper justification will be give priority for shortlist
WHAT SKILLS WE'RE TESTING
Fundamentals: Transfer learning, CNNs, training pipelines
Advanced: Multi-task learning, metric learning, attention mechanisms
Production: Handling real-world challenges (noise, imbalance, speed)
Communication: Documentation, visualization, explanation
Research: Novel approaches, analysis, insights

Final Checklist (Before Submission)
 Single PDF file prepared
 Levels clearly separated
 Public Google Colab links added
 Outputs visible in Colab Notebooks
 Accuracy/result screenshots included
 Code and results are consistent
SHORTLISTING & INTERVIEWS
Candidates Who Will Be Interviewed:
Completed Level 4 or beyond (Not a hard rule)
Scored ≥78/100 on evaluation rubric (Not a hard rule)
Clean, well-documented code
Demonstrated problem-solving skills
Insightful analysis and results
CONTACT & QUESTIONS
For Questions About the Challenge: Email: hiring@terafac.com

Important Dates:

Release Date: 15/01/2026 at 1700 (IST)
Submission Deadline: 16/01/2026 at 1200 Noon (IST)
Submit here

GOOD LUCK!
We look forward to seeing your solutions.

Contact us if you have any questions. Good luck!
