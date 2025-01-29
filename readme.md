# Simple Game Image Classifier

This project is focused on building a simple image classification model to identify the game "Mines" using TensorFlow.js. The goal is to create a classifier that can recognize images of the game and categorize them as "Mines" or "Other".

## Features

- **Image Classification**: The model can identify the game "Mines" based on uploaded images.
- **TensorFlow.js**: Utilizes TensorFlow.js for training and inference directly in the browser.
- **Extensible**: Once "Mines" is recognized, we can extend the model to classify other games.

## Steps

### 1. Setup the Environment

- Install the required dependencies:
  ```bash
  npm install @tensorflow/tfjs

### 2. Brief Tutorial

1️⃣ Image Collection

First, use get_images.js because, you will need to capture images of the "Mines" game icon that you want to detect on the pages. The best way to do this is to save the images you see in the user interface.

    **Image Capture:**
        - Open the page where the "Mines" game is listed.
        - Take a screenshot or download the icon image.
        - Ensure the image is clear and representative of the icon you want to detect.

    **Organize the Images:**
        - Save the image with a descriptive name, such as `mines_icon.jpg`.
        - Place this image in a directory where the code can access it.