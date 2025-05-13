require("dotenv").config();
const axios = require("axios");
const natural = require("natural");
const fs = require("fs");

// Charger les catégories depuis le fichier JSON externe
const categories = JSON.parse(fs.readFileSync("categories.json", "utf-8"));

// Utiliser le stemmer français
const stemmer = natural.PorterStemmerFr;

// Fonction pour extraire les keyphrases
// Fonction pour extraire les keyphrases
const extractKeyphrases = async (texts) => {
  try {
    const responses = await Promise.all(
      texts.map((text) =>
        axios.post(
          "https://api-inference.huggingface.co/models/ml6team/keyphrase-extraction-kbir-inspec",
          { inputs: text },
          {
            headers: {
              Authorization: `Bearer ${process.env.HF_TOKEN}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
      )
    );

    // Vérification des réponses
    const keyphrasesData = responses.map((response, index) => {
      if (response.status !== 200) {
        console.error(
          `Error in response for text ${index + 1}:`,
          response.status
        );
        return { error: "Failed to retrieve keyphrases" };
      }

      if (!response.data || !Array.isArray(response.data)) {
        console.error(`No valid keyphrases found for text ${index + 1}`);
        return { keyphrases: [], error: "No valid keyphrases found" };
      }

      return response.data;
    });

    return keyphrasesData;
  } catch (error) {
    console.error("Error extracting keyphrases:", error);
    throw new Error("Error extracting keyphrases: " + error.message);
  }
};

// Fonction pour catégoriser le texte
const categorizeText = (keyphrases) => {
  let textCategories = [];

  keyphrases.forEach((phrase) => {
    const word = (phrase.word || phrase).toLowerCase().trim();
    const stemmedWord = stemmer.stem(word);

    // Vérifier les catégories pour chaque mot
    Object.entries(categories).forEach(([category, keywords]) => {
      keywords.forEach((keyword) => {
        const stemmedKeyword = stemmer.stem(keyword);
        if (stemmedWord.includes(stemmedKeyword)) {
          textCategories.push(category);
        }
      });
    });
  });

  // Éviter les doublons
  return [...new Set(textCategories)];
};

// Fonction pour mettre en évidence les keyphrases dans le texte
const highlightText = (text, keyphrases) => {
  let highlightedText = text;
  keyphrases.forEach((phrase) => {
    const word = (phrase.word || phrase).trim();
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    highlightedText = highlightedText.replace(regex, `<mark>${word}</mark>`);
  });
  return highlightedText;
};

module.exports = { extractKeyphrases, categorizeText, highlightText };
