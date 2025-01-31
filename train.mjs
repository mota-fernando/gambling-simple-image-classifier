import * as tf from "@tensorflow/tfjs-node";
import fs from "fs";
import path from "path";

import { saveModel } from './modelSaver.js';

// Função para carregar imagens e convertê-las em tensores
async function carregarEConverterImagens(filePaths, label) {
  const imagens = [];
  const labels = [];

  for (const filePath of filePaths) {
    try {
      const localPath = path.join("F:/work/bets/automines/downloaded_images", filePath.replace("/images/", ""));
      console.log(`Tentando carregar: ${localPath}`);

      if (!fs.existsSync(localPath)) {
        console.error(`Arquivo não encontrado: ${localPath}`);
        continue;
      }

      const imageBuffer = fs.readFileSync(localPath);
      const tensor = tf.node.decodeImage(imageBuffer)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255);

      imagens.push(tensor);
      labels.push(label);
    } catch (error) {
      console.error(`Erro ao carregar a imagem ${filePath}:`, error);
    }
  }

  return { imagens, labels };
}

// Função para carregar as imagens do servidor
async function carregarImagens() {
  const resposta = await fetch("http://localhost:8000/list-images");
  const dados = await resposta.json();

  console.log("Imagens carregadas:", dados);
  return dados;
}

// Função para treinar o modelo
async function treinarModelo() {
  console.log("Carregando imagens...");
  const dados = await carregarImagens(); // Carrega as imagens antes de prosseguir

  // Verifica se as imagens foram carregadas corretamente
  if (!dados.mines_tada || !dados.others) {
    console.error("Erro: imagens não carregadas corretamente.");
    return;
  }

  // Converte as imagens para tensores do TensorFlow.js
  console.log("Convertendo imagens para tensores...");
  const dadosMines = await carregarEConverterImagens(dados.mines_tada, 1);
  const dadosOthers = await carregarEConverterImagens(dados.others, 0);

  // Verifica se há imagens suficientes
  if (dadosMines.imagens.length === 0 || dadosOthers.imagens.length === 0) {
    console.error("Erro: Nenhuma imagem carregada.");
    return;
  }

  // Concatena as imagens e ajusta o formato para [num_imagens, 224, 224, 3]
  const X = tf.stack([...dadosMines.imagens, ...dadosOthers.imagens]);
  const Y = tf.tensor1d([...dadosMines.labels, ...dadosOthers.labels]);

  // Criar um modelo simples
  const modelo = tf.sequential();
  modelo.add(tf.layers.flatten({ inputShape: [224, 224, 3] }));
  modelo.add(tf.layers.dense({ units: 128, activation: "relu" }));
  modelo.add(tf.layers.dense({ units: 2, activation: "softmax" }));

  modelo.compile({
    optimizer: "adam",
    loss: "sparseCategoricalCrossentropy",
    metrics: ["accuracy"]
  });

  console.log("Treinando modelo...");
  await modelo.fit(X, Y, { epochs: 10 });

  console.log("Modelo treinado!");

  // Salvar o modelo
  saveModel(modelo);

}

// Inicia o treinamento corretamente
treinarModelo();