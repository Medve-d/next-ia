import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { board } = req.body; 

    console.log('Requête reçue:', req.body);

    if (!Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ error: 'Le plateau doit être un tableau de 9 éléments.' });
    }

    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      console.log('Clé API Google:', apiKey);
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const generationConfig = {
        temperature: 0,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 10,
        responseMimeType: 'text/plain',
      };

      const prompt = `
        Plateau actuel : ${board.map(cell => cell === null ? 'null' : cell).join(', ')}
        Indique ton prochain coup en utilisant un chiffre de 1 à 9. Les cases sont numérotées de gauche à droite, de haut en bas.
      `;

      console.log('Prompt envoyé à l\'API:', prompt);

      const result = await model.generateContent({
        prompt: prompt,
        ...generationConfig,
      });

      console.log('Réponse de l\'API:', result);

      const aiMove = parseInt(result?.response?.text().trim(), 10);

      console.log('Mouvement recommandé par l\'IA:', aiMove);

      if (isNaN(aiMove) || aiMove < 1 || aiMove > 9 || board[aiMove - 1] !== null) {
        return res.status(400).json({ error: 'Mouvement invalide' });
      }

      board[aiMove - 1] = 'O';

      console.log('Plateau mis à jour:', board);

      res.status(200).json({
        reply: `L'IA a joué le coup : ${aiMove}`,
        updatedBoard: board
      });
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'API Gemini:', error);
      res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Gemini' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
