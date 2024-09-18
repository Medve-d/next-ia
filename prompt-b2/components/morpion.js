
import { useState, useEffect } from 'react';
import styles from '../styles/morpion.module.css';

const initialState = Array(9).fill(null);



const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const Morpion = () => {
  const [squares, setSquares] = useState(initialState);
  const [isXNext, setIsXNext] = useState(true);
  const [apiData, setApiData] = useState(null);
  const winner = calculateWinner(squares);
  const status = winner ? `Gagnant : ${winner}` : `Prochain joueur : ${isXNext ? 'X' : 'O'}`;

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await fetch('../pages/api/morpion.js', {
          headers: {
            'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
          },
        });
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchApiData();
  }, []);

  const handleClick = (i) => {
    if (squares[i] || winner) return;
    const newSquares = squares.slice();
    newSquares[i] = isXNext ? 'X' : 'O';
    setSquares(newSquares);
    setIsXNext(!isXNext);
  };

  const renderSquare = (i) => (
    <button className={styles.square} onClick={() => handleClick(i)}>
      {squares[i]}
    </button>
  );

  return (
    <div>
      <div className={styles.status}>{status}</div>
      <div className={styles.board}>
        {[0, 1, 2].map((row) => (
          <div key={row} className={styles.boardRow}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>
      <div>
        <h2>API Data:</h2>
        <pre>{JSON.stringify(apiData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Morpion;
