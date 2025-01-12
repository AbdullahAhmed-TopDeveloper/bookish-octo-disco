import React, { useState, useEffect } from "react";

// Styles
const styles = {
  appContainer: {
    height: "100vh",
    background: "url('https://source.unsplash.com/random/1920x1080?abstract') no-repeat center center/cover", // Using a random image as background
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    padding: "20px",
    backgroundAttachment: "fixed", // Background stays fixed while scrolling
  },
  header: {
    textAlign: "center",
    fontSize: "3rem",
    marginBottom: "20px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "2px 2px 10px rgba(0, 0, 0, 0.6)", // Darker shadow for better text visibility
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: "700px",
    marginBottom: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#fff",
  },
  stat: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    padding: "10px 15px",
    borderRadius: "10px",
    background: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for stats
  },
  gameBoard: {
    display: "grid",
    gap: "15px",
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slight dark overlay for contrast
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  },
  cardContainer: {
    position: "relative",
    width: "100px",
    height: "140px",
    perspective: "1000px",
    cursor: "pointer",
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    position: "absolute",
    backfaceVisibility: "hidden",
    transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1), box-shadow 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5em",
    fontWeight: "bold",
    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
  },
  cardFront: {
    background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
    color: "#fff",
    transform: "rotateY(180deg)",
  },
  cardBack: {
    background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    color: "#fff",
  },
  flippedCard: {
    transform: "rotateY(180deg)",
    boxShadow: "0 12px 25px rgba(0, 0, 0, 0.4)",
  },
  matchedCard: {
    background: "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
    color: "#fff",
    transform: "scale(1.05)",
    boxShadow: "0 12px 25px rgba(0, 255, 0, 0.5)",
  },
};

// Utility Functions
const generateCards = (gridSize) => {
  const values = Array.from({ length: gridSize / 2 }, (_, i) => String.fromCharCode(65 + i));
  const cards = [...values, ...values]; // Duplicate cards for matching pairs
  return shuffle(cards);
};

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap
  }
  return array;
};

// Main Component
const App = () => {
  const [gridSize, setGridSize] = useState(16); // Default 4x4 grid
  const [cards, setCards] = useState(generateCards(gridSize).map((value, index) => ({ value, id: index })));
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);

  // Timer Effect
  useEffect(() => {
    if (startTime) {
      const interval = setInterval(() => {
        setTimer(((Date.now() - startTime) / 1000).toFixed(1)); // Update timer every 100ms
      }, 100);
      return () => clearInterval(interval); // Clean up interval when component unmounts
    }
  }, [startTime]);

  // Handle card flip logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCard, secondCard] = flippedCards;
      if (firstCard.value === secondCard.value) {
        setMatchedCards((prev) => [...prev, firstCard, secondCard]);
      }
      setTimeout(() => setFlippedCards([]), 1500); // Reset flipped cards after 1.5 seconds
      setMoves((prev) => prev + 1);
    }
  }, [flippedCards]);

  // Reset the game when all pairs are matched
  useEffect(() => {
    if (matchedCards.length === cards.length) {
      alert(`You won the game in ${moves} moves and ${timer} seconds!`);
      // Reset game state
      setMoves(0);
      setTimer(0);
      setFlippedCards([]);
      setMatchedCards([]);
      setCards(generateCards(gridSize).map((value, index) => ({ value, id: index })));
      setStartTime(null); // Reset start time
    }
  }, [matchedCards, cards, moves, timer, gridSize]);

  const handleCardClick = (card) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.some((flipped) => flipped.id === card.id) ||
      matchedCards.some((matched) => matched.id === card.id)
    )
      return;

    if (!startTime) {
      setStartTime(Date.now()); // Start timer when first card is flipped
    }

    setFlippedCards((prev) => [...prev, card]);
  };

  const isCardFlipped = (card) => flippedCards.some((flipped) => flipped.id === card.id);
  const isCardMatched = (card) => matchedCards.some((matched) => matched.id === card.id);

  return (
    <div style={styles.appContainer}>
      <div style={styles.header}>Memory Match Game</div>
      <div style={styles.stats}>
        <div style={styles.stat}>Moves: {moves}</div>
        <div style={styles.stat}>Time: {timer}s</div>
      </div>
      <div
        style={{
          ...styles.gameBoard,
          gridTemplateColumns: `repeat(${Math.sqrt(gridSize)}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <div
            style={styles.cardContainer}
            key={card.id}
            onClick={() => handleCardClick(card)}
          >
            <div
              style={{
                ...styles.card,
                ...(isCardFlipped(card) ? styles.flippedCard : {}),
                ...(isCardMatched(card) ? styles.matchedCard : {}),
                ...(isCardFlipped(card) ? styles.cardFront : styles.cardBack),
              }}
            >
              {isCardFlipped(card) || isCardMatched(card) ? card.value : "?"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
