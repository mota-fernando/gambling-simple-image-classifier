const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8000;

const BASE_DIR = "F:/work/bets/automines/downloaded_images";

// Middleware para servir arquivos estáticos
app.use("/images", express.static(BASE_DIR));

// Rota para listar imagens dos diretórios
app.get("/list-images", (req, res) => {
  const categorias = ["others", "mines_tada"];
  let imagens = {};

  categorias.forEach((categoria) => {
    const dirPath = path.join(BASE_DIR, categoria);
    if (fs.existsSync(dirPath)) {
      imagens[categoria] = fs.readdirSync(dirPath).map((file) => `/images/${categoria}/${file}`);
    }
  });

  res.json(imagens);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
});