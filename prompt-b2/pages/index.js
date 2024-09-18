import { useState, useEffect } from 'react';

// Composant de Chat intégré
export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupérer les messages stockés localement
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  const updateLocalStorage = (updatedMessages) => {
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    updateLocalStorage(updatedMessages);

    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botReply = { sender: 'bot', text: data.reply };

      const updatedMessagesWithBotReply = [...updatedMessages, botReply];

      setMessages(updatedMessagesWithBotReply);
      updateLocalStorage(updatedMessagesWithBotReply);

      setInput('');
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Une erreur est survenue.' };
      const updatedMessagesWithError = [...updatedMessages, errorMessage];

      setMessages(updatedMessagesWithError);
      updateLocalStorage(updatedMessagesWithError);
    }
    setLoading(false);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="chat-container">
      <h1>Chat avec Gemini</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p>
              <strong>{msg.sender === 'user' ? 'Moi' : 'Gemini'}:</strong> {msg.text}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris quelques choses !"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi' : 'Envoyer'}
        </button>
      </form>
      <button onClick={clearMessages}>Supprimer l'historique</button>
    </div>
  );
}
