import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message manquant.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(message);
      const response = await result.response;
      const text = response.text();

      res.status(200).json({ reply: text });
    } catch (error) {
      console.error('Erreur API:', error);
      res.status(500).json({ error: 'Erreur lors de la génération du contenu.' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée.' });
  }
}
