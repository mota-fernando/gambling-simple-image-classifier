import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Carregar e treinar modelo
async function carregarModelo() {

  const modeloJSON = await fetch('saved_models/0_sequencial_1.json').then(res => res.json());
  const modelo = await tf.loadLayersModel(tf.io.fromMemory(modelJSON));
  return modelo;
  
}

// Classificar uma imagem
async function classificarImagem(imgElement, modelo) {
  // Convert the image to a tensor that matches your model's input layer
  const tensorImg = tf.browser.fromPixels(imgElement).toFloat();
  const resized = tf.image.resizeBilinear(tensorImg, [yourModelInputHeight, yourModelInputWidth]);
  const batchedImg = resized.expandDims(0);
  const normalizedImg = batchedImg.div(255.0); // Normalize if your model expects normalized input

  const predictions = await modelo.predict(normalizedImg);

  // Assuming your model outputs a single class probability or an array of probabilities
  const output = await predictions.data();
  
  // Here, adjust based on how your model outputs results
  // For example, if it's binary classification (Mines or Not Mines):
  const probabilityOfMines = output[0];
  return probabilityOfMines > 0.5; // Threshold can be adjusted

  // Clean up
  tensorImg.dispose();
  resized.dispose();
  batchedImg.dispose();
  normalizedImg.dispose();
  predictions.dispose();
}

// Verificar todas as imagens na página
async function verificarImagens() {
  const modelo = await carregarModelo();
  const imagens = document.querySelectorAll(".lobby-image");

  imagens.forEach(async (img) => {
    const bgImage = img.style.backgroundImage.match(/url\("?(.*?)"?\)/)[1];
    const imageElement = new Image();
    imageElement.crossOrigin = "Anonymous";
    imageElement.src = bgImage;

    imageElement.onload = async () => {
      const ehMines = await classificarImagem(imageElement, modelo);
      if (ehMines) {
        console.log("🔹 Encontrado: Mines!", img);
        img.click(); // Clicar automaticamente no item "Mines"
      }
    };
  });
}

verificarImagens();