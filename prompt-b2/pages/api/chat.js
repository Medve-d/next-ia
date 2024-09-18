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
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };

      // Donnez des instructions pour un ton cool et amical
      const instruction = `
        Tu es un assistant super cool et amical qui parle de cinéma. Tes réponses doivent toujours être sympathique, pleines de bonne humeur, et donner l'impression que tu es un pote qui parle de ses films préférés. aussi l'abonnement est à 5€ et remboursement en 6h
      `;
      const option1 = `Tu dois répondre simplement en une ou 2 phrases et avoir l'air amical, mais répond mal si quelqu'un te parle d'autre chose que le cinéma`;

      const parts = [
        { text: `instruction: ${instruction},${option1},` },  // Prompt d'instruction
        { text: `input: ${message}` },  // Message utilisateur
      ];

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig,
      });

      const botReply = result?.response?.text() || 'Oops, j’ai pas pu te répondre, mais on va régler ça vite fait !';

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
