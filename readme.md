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
  npm install axios
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

## Explanation of the `downloadImages.js` Code

### Dependencies

- **`fs`**: For file manipulation.
- **`path`**: For handling file paths.
- **`axios`**: For making HTTP requests and downloading images from URLs.
- **`promisify`**: To convert `fs.writeFile` into a function that supports `async/await`.

### Main Functions

- **`createOutputDir`**: Creates the `downloaded_images` directory if it doesn't exist.
- **`downloadImageFromUrl`**: Downloads an image from a URL and saves it to disk.
- **`saveImageFromBase64`**: Decodes a Base64 image and saves it to disk.
- **`processJsonFile`**: Reads the JSON file, processes each item, and downloads/saves the images.

### JSON Processing

- The script reads the local JSON file (`data.json`).
- For each item in the JSON:
  - Downloads the background image (`backgroundImage`) if it's a URL.
  - Saves the icon image (`imgSrc`) if it's Base64 or a URL.

### Output

- Images are saved in the `downloaded_images` directory with filenames in the format:
  - `{dataId}_background.jpg`
  - `{dataId}_icon.png`

---

## Example of `data.json`

Save the JSON in a file named `data.json` in the same directory as the script:

```json
[
    {
        "dataId": "775be205-dfd9-41cd-bfb7-f5aee0c67aa9",
        "backgroundImage": "https://ossa.ejsook.com/game_pictures/g/CL/200/3/2001007/default.avif",
        "imgSrc": "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
    },
    {
        "dataId": "a655d22e-ea94-40a2-8b5f-af02497916c9",
        "backgroundImage": "https://ossa.ejsook.com/siteadmin/skin/lobby_asset/common/web/home/btn_sc_on_2.avif?manualVersion=1&version=8311848029",
        "imgSrc": null
    }
]
````

## How to Run

- Install the required dependencies:

    ```bash
- node downloadImages.js

    Save the script in a file, for example, downloadImages.js.

- Run the script:

   ```bash
    node downloadImages.js

## Expected Output

- The script will create a directory called downloaded_images.

- Inside this directory, you will find the downloaded images, for example:

   - 775be205-dfd9-41cd-bfb7-f5aee0c67aa9_background.jpg

   - 775be205-dfd9-41cd-bfb7-f5aee0c67aa9_icon.png

   - a655d22e-ea94-40a2-8b5f-af02497916c9_background.jpg
