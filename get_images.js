function extrairInformacoes() {
    const elementos = document.querySelectorAll(".lobby-image");  // Seleciona todos os elementos com a classe .lobby-image
    const resultados = [];  // Array para armazenar os resultados

    elementos.forEach((elemento) => {
        // Extrai a URL da imagem de fundo
        const bgImage = window.getComputedStyle(elemento).backgroundImage;
        const urlMatch = bgImage.match(/url\("?(.*?)"?\)/);
        const url = urlMatch ? urlMatch[1] : null;

        // Extrai o data-id
        const dataId = elemento.getAttribute("data-id");

        // Extrai o src da tag <img>, se existir
        const imgElement = elemento.querySelector("img");
        const imgSrc = imgElement ? imgElement.getAttribute("src") : null;

        // Armazena as informações no array
        if (url && dataId) {
            resultados.push({
                dataId,
                backgroundImage: url,
                imgSrc
            });
        }
    });

    // Exibe os resultados no console
    console.log("Informações extraídas:", resultados);
    return resultados;  // Retorna os resultados para uso externo, se necessário
}

// Executa a função após o carregamento da página
extrairInformacoes();