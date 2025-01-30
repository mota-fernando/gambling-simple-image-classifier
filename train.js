async function carregarImagens() {
    const resposta = await fetch("http://localhost:8000/list-images");
    const dados = await resposta.json();
    
    console.log("Imagens carregadas:", dados);
    
    return dados;
  }
  
  // Chamar a função para carregar as imagens no navegador
  carregarImagens();
  