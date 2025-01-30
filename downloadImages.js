const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp'); // Biblioteca para conversão de imagens

// Diretório de saída para as imagens baixadas
const outputDir = path.join(__dirname, 'downloaded_images');

// Função para criar o diretório de saída, se não existir
function createOutputDir() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
}

// Função para salvar uma imagem de Base64 como JPG
async function saveBase64AsJpg(base64Data, filePath) {
    try {
        const base64Image = base64Data.split(';base64,').pop(); // Remove o cabeçalho Base64
        const imageBuffer = Buffer.from(base64Image, 'base64');

        // Usar sharp para converter e salvar como JPG
        await sharp(imageBuffer)
            .toFormat('jpeg') // Converter para JPG
            .toFile(filePath);

        console.log(`Imagem salva: ${filePath}`);
    } catch (error) {
        console.error(`Erro ao salvar imagem Base64 como JPG:`, error.message);
    }
}

// Função para baixar uma imagem de uma URL e salvar como JPG
async function downloadImageAndConvertToJpg(url, filePath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        // Usar sharp para converter e salvar como JPG
        await sharp(response.data)
            .toFormat('jpeg') // Converter para JPG
            .toFile(filePath);

        console.log(`Imagem baixada e convertida: ${filePath}`);
    } catch (error) {
        console.error(`Erro ao baixar e converter imagem de ${url}:`, error.message);
    }
}

// Função principal para processar o JSON e baixar as imagens
async function processJsonFile(filePath) {
    try {
        // Ler o arquivo JSON
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(jsonData);

        // Criar o diretório de saída
        createOutputDir();

        // Processar cada item do JSON
        for (const item of data) {
            const { dataId, backgroundImage, imgSrc } = item;

            // Processar backgroundImage (Base64 ou URL)
            if (backgroundImage) {
                const bgImagePath = path.join(outputDir, `${dataId}_background.jpg`);
                if (backgroundImage.startsWith('data:image')) {
                    await saveBase64AsJpg(backgroundImage, bgImagePath); // Salvar Base64 como JPG
                } else if (backgroundImage.startsWith('http')) {
                    await downloadImageAndConvertToJpg(backgroundImage, bgImagePath); // Baixar e converter para JPG
                }
            }

            // Processar imgSrc (Base64 ou URL)
            if (imgSrc) {
                const iconPath = path.join(outputDir, `${dataId}_icon.jpg`);
                if (imgSrc.startsWith('data:image')) {
                    await saveBase64AsJpg(imgSrc, iconPath); // Salvar Base64 como JPG
                } else if (imgSrc.startsWith('http')) {
                    await downloadImageAndConvertToJpg(imgSrc, iconPath); // Baixar e converter para JPG
                }
            }
        }
    } catch (error) {
        console.error('Erro ao processar o arquivo JSON:', error.message);
    }
}

// Caminho para o arquivo JSON local
const jsonFilePath = path.join(__dirname, 'data.json');

// Executar o script
processJsonFile(jsonFilePath);