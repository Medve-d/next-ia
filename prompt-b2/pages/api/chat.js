import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body;

    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const generationConfig = {
        temperature: 0.2,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };

      // On donne une instruction à suivre pour Gemini
      const instruction = `
        Je suis un expert en cinéma. Mes réponses doivent toujours se limiter au domaine du cinéma, en recommandant des films, acteurs, réalisateurs, et autres sujets relatifs au cinéma.
      `;

      
      const parts = [
        { text: `instruction: ${instruction}` },  // Prompt d'instruction
        { text: `input: ${message}` },  // Message user
      ];

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig,
      });

      const botReply = result?.response?.text() || 'Je n’ai pas pu générer de réponse.';

      res.status(200).json({ reply: botReply });
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
      res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Gemini' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
