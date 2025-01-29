const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');

// Promisify fs.writeFile para facilitar o uso com async/await
const writeFileAsync = promisify(fs.writeFile);

// Diretório de saída para as imagens baixadas
const outputDir = path.join(__dirname, 'downloaded_images');

// Função para criar o diretório de saída, se não existir
function createOutputDir() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
}

// Função para baixar uma imagem de uma URL
async function downloadImageFromUrl(url, filePath) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        await writeFileAsync(filePath, response.data);
        console.log(`Imagem baixada: ${filePath}`);
    } catch (error) {
        console.error(`Erro ao baixar imagem de ${url}:`, error.message);
    }
}

// Função para salvar uma imagem de Base64
async function saveImageFromBase64(base64Data, filePath) {
    try {
        const base64Image = base64Data.split(';base64,').pop(); // Remove o cabeçalho Base64
        const imageBuffer = Buffer.from(base64Image, 'base64');
        await writeFileAsync(filePath, imageBuffer);
        console.log(`Imagem salva: ${filePath}`);
    } catch (error) {
        console.error(`Erro ao salvar imagem Base64:`, error.message);
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

            // Baixar a imagem de fundo (backgroundImage)
            if (backgroundImage && backgroundImage.startsWith('http')) {
                const bgImagePath = path.join(outputDir, `${dataId}_background.jpg`);
                await downloadImageFromUrl(backgroundImage, bgImagePath);
            }

            // Salvar a imagem do ícone (imgSrc)
            if (imgSrc) {
                if (imgSrc.startsWith('data:image')) {
                    const iconPath = path.join(outputDir, `${dataId}_icon.png`);
                    await saveImageFromBase64(imgSrc, iconPath);
                } else if (imgSrc.startsWith('http')) {
                    const iconPath = path.join(outputDir, `${dataId}_icon.jpg`);
                    await downloadImageFromUrl(imgSrc, iconPath);
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