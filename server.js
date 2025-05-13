const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const {
  extractKeyphrases,
  categorizeText,
  highlightText,
} = require("./keyphrases");

dotenv.config();

const app = express();
app.use(express.json());

// Servir les fichiers statiques du répertoire public
app.use(express.static(path.join(__dirname, "public")));

// Gestion d’erreur pour les JSON invalides
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).send({ error: "Invalid JSON format" });
  }
  next();
});

// Route pour extraire les phrases clés
app.post("/extract-keyphrases", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: "Text is required" });
  }

  try {
    // ✅ Passer le texte sous forme de tableau
    const keyphrasesResponse = await extractKeyphrases([text]);

    // ✅ Extraire les résultats du premier élément
    const highlightedText = highlightText(text, keyphrasesResponse[0]);
    const categories = categorizeText(keyphrasesResponse[0]);

    res.json({
      keyphrases: keyphrasesResponse[0],
      highlightedText,
      categories,
    });
  } catch (error) {
    console.error("Error extracting keyphrases:", error);
    res
      .status(500)
      .send({ error: "An error occurred while extracting keyphrases" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
