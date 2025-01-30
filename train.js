import * as tf from "@tensorflow/tfjs";

// Função para carregar imagens e convertê-las em tensores
async function carregarEConverterImagens(urls, label) {
  const imagens = [];
  const labels = [];

  for (const url of urls) {
    const img = new Image();
    img.src = url;
    await img.decode(); // Aguarda a imagem carregar

    const tensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255); // Normaliza os valores entre 0 e 1

    imagens.push(tensor);
    labels.push(label);
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

  const X = tf.concat([...dadosMines.imagens, ...dadosOthers.imagens]);
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
}

// Inicia o treinamento corretamente
treinarModelo();
