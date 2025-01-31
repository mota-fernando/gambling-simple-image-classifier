import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Carregar e treinar modelo
async function carregarModelo() {

  const modeloJSON = await fetch('path/to/your/model.json').then(res => res.json());
  const modelo = await tf.loadLayersModel(tf.io.fromMemory(modelJSON));
  return modelo;
  
}

// Classificar uma imagem
async function classificarImagem(imgElement, modelo) {
  const predictions = await modelo.classify(imgElement);
  console.log("Predições:", predictions);

  // Verifica se "Mines" está nas previsões
  return predictions.some((p) => p.className.includes("Mines") && p.probability > 0.5);
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