import { useState } from 'react';


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);

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

      setMessages((prevMessages) => [...prevMessages, botReply]);
      setInput('');
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = { sender: 'bot', text: 'Une erreur est survenue.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <h1>Chat avec Gemini</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <p><strong>{msg.sender === 'user' ? 'Moi' : 'Gemini'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
}
