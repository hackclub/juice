import { useEffect, useState, useRef } from 'react';

export default function RabbitMessage({ isVisible, onClaimLuck }) {
  // Add fortune messages array and date calculation logic at the top
  const FORTUNE_MESSAGES = [
    "Today you shine brighter than ever. Move forward boldly!",
    "A fresh start awaits you. Trust your intuition and go for it",
    "Your passion will light up the path ahead",
    "Today's challenges are tomorrow's stepping stones",
    "You're stronger than you realize. Don't sell yourself short",
    "Be your own hero, starting today",
    "Dream big, but act bigger",
    "Plant the seeds of success for your future self today",
    "Every step counts, every moment matters",
    "Your heart knows the way - follow it",
    "Your creativity is on fire today - try something new",
    "Today's efforts will bring double rewards tomorrow",
    "The world needs your unique perspective",
    "Courage isn't absence of fear, but conquering it",
    "A smile changes a day, a decision changes a life",
    "Perfect day to step outside your comfort zone",
    "Your energy is contagious - use it wisely",
    "Pause, breathe, appreciate the moment, then push forward",
    "Break your routine and take a risk today",
    "Your dreams are closer to reality than you think",
    "Today's journey will lead you to unexpected places",
    "One conversation could change everything today - speak up",
    "Today's choices are shaping your tomorrow",
    "Your creativity is ready to explode - let it out",
    "Keep an open mind - today holds unexpected surprises",
    "The greatest adventure? Being authentically yourself",
    "Today's obstacles are making you stronger",
    "Trust your gut feeling - it knows where to go",
    "Stronger than yesterday, even stronger tomorrow",
    "Victory is within sight - hold on a little longer",
    "Today your full potential will be unleashed",
    "Standing at the edge of transformation - ready?",
    "Destiny unfolds before you - seize this moment",
    "All preparation has led to tomorrow",
    "The time has come. Seize your reward." // Final message
  ];

  const getCurrentFortuneMessage = () => {
    const targetDate = new Date('2024-04-04T00:00:00Z');
    const currentDate = new Date();
    const daysUntilTarget = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
    
    // If we're past April 4th or more than 35 days away, show the first message
    if (daysUntilTarget < 0 || daysUntilTarget >= FORTUNE_MESSAGES.length) {
      return FORTUNE_MESSAGES[0];
    }
    
    // Show the appropriate message based on days remaining
    return FORTUNE_MESSAGES[FORTUNE_MESSAGES.length - 1 - daysUntilTarget];
  };

  if (!isVisible) return null;

  const audioRef = useRef(null);

  const [isRabbitMode, setRabbitMode] = useState(false);
  // Add new state variables for the card game
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Initialize cards when rabbit mode is turned on
  useEffect(() => {
    if (isRabbitMode) {
      initializeCards();
    }
  }, [isRabbitMode]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      
      if (cards[firstIndex].value === cards[secondIndex].value) {
        // Match found - only add if not already in the array
        if (!matchedPairs.includes(cards[firstIndex].value)) {
          setMatchedPairs([...matchedPairs, cards[firstIndex].value]);
        }
      }
      
      // Flip cards back after a delay if no match
      const timer = setTimeout(() => {
        setFlippedIndices([]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [flippedIndices, cards, matchedPairs]);

  // Check if game is complete - should have all 4 unique cards matched
  useEffect(() => {
    if (matchedPairs.length === 4 && isRabbitMode) {
      setIsGameComplete(true);
    }
  }, [matchedPairs, isRabbitMode]);

  // Initialize the card deck
  const initializeCards = () => {
    const cardTypes = [
      { value: 1, image: "./cards/card1.png" },
      { value: 2, image: "./cards/card2.png" },
      { value: 3, image: "./cards/card3.png" },
      { value: 4, image: "./cards/card4.png" }
    ];
    
    // Create pairs of each card
    const cardDeck = [...cardTypes, ...cardTypes].map((card, index) => ({
      ...card,
      id: index
    }));
    
    // Shuffle the cards
    const shuffledCards = cardDeck.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setIsGameComplete(false);
  };

  // Handle card flip
  const handleCardFlip = (index) => {
    // Prevent flipping if already two cards flipped or card already matched
    if (flippedIndices.length === 2 || 
        flippedIndices.includes(index) || 
        matchedPairs.includes(cards[index].value)) {
      return;
    }
    
    setFlippedIndices([...flippedIndices, index]);
  };

  // Reset the game
  const resetGame = () => {
    initializeCards();
  };

  // Exit card game mode
  const exitCardGame = () => {
    setRabbitMode(false);
  };

  // Add this handler to prevent clicks from reaching the background
  const handleMessageClick = (e) => {
    e.stopPropagation();
  };

  // Handle claiming luck (zooming out)
  const handleClaimLuck = (e) => {
    e.stopPropagation(); // Prevent the click from bubbling up
    if (onClaimLuck && typeof onClaimLuck === 'function') {
      onClaimLuck();
    }
  };

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }}>
        <source src="./rabbit-ok.mp3" type="audio/mpeg" />
      </audio>
      {/* <img 
        onClick={handleMessageClick}
        style={{
          width: 250,
          left: -110,
          top: 42,
          height: 100,
          zIndex: 2,
          opacity: 0.4,
          position: "absolute",
          mixBlendMode: "multiply",
          pointerEvents: "none",
          animation: "rabbitMessagePaperSlide 0.3s ease-out"
        }} 
        src="./paper.jpg"
        data-rabbit-component="true"
      /> */}
      
      <div 
        onClick={handleMessageClick}
        style={{ 
          position: "absolute", 
          justifyContent: "space-between", 
          display: "flex", 
          flexDirection: "row", 
          width: 250, 
          left: "calc(50% - 104px)", 
          top: 42, 
          height: 100,
          overflow: "hidden",
          backgroundColor: "#fff", 
          paddingLeft: 2, 
          paddingRight: 2, 
          borderRadius: 0,
          animation: "rabbitMessageOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformOrigin: "top center"
        }}
        data-rabbit-component="true"
      >
        <div style={{ height: "100px", overflow: "hidden", position: "relative" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            animation: "scrollSeamless 15s ease-in infinite"
          }}>
            <img style={{ 
              height: "150px",
              objectFit: "contain" 
            }} src="/leftrabbit.png" />
            <img style={{ 
              height: "150px",
              objectFit: "contain",
              marginTop: "-1px"
            }} src="/leftrabbit.png" />
          </div>
        </div>
        {!isRabbitMode ? 
        <div style={{ 
          height: "100px", 
          display: "flex", 
          justifyContent: "center", 
          flexDirection: "column", 
          alignItems: "center" 
        }}>
          <div style={{
            height: "100%", 
            overflow: "hidden", 
            display: "flex", 
            borderBottom: "0px solid #E1001D", 
            alignItems: "start", 
            width: "100%", 
            justifyContent: "start", 
            flexDirection: "row", 
            gap: 4,
            animation: "drawBorders 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear 0.5s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear 1s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineDown 5s linear 1.5s forwards"}}></div>
          
            <img style={{width: 150}} src="./JuiceMagic.png"/>
          </div>
          <p style={{ 
            fontSize: 13, 
            borderLeft: "0px solid #E1001D", 
            borderRight: "0px solid #E1001D", 
            paddingLeft: 2, 
            width: 148,
            animation: "drawBorders 1.5s cubic-bezier(0.4, 0, 0.2, 1) 1s forwards"
          }}>
            {getCurrentFortuneMessage().split('').map((char, i) => (
              <span 
                key={i} 
                style={{
                  color: "#fff",
                  fontSize: 13,
                  animation: `textReveal 0.1s cubic-bezier(0.4, 0, 0.2, 1) ${2 + (i * 0.05)}s forwards`
                }}
              >
                {char}
              </span>
            ))}
          </p>
          <div style={{
            height: "100%", 
            display: "flex", 
            alignItems: "end", 
            width: "100%", 
            justifyContent: "end", 
            borderTop: "0px solid #E1001D", 
            flexDirection: "row", 
            gap: 4,
            animation: "drawBorders 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}>
            <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "space-between", width: "100%", flexDirection: "row"}}>
            <p 
              onClick={() => setRabbitMode(true)}
              style={{
                fontSize: 13, 
                color: "#000", 
                height: "100%", 
                cursor: "pointer",
                alignItems: "center", 
                display: "flex",
                opacity: 0,
                width: "125px",
                animation: "fadeIn 0.5s ease-in-out 6s forwards"
              }}>
              <span 
                style={{
                  animation: "blink 1.5s ease-in-out infinite 6s",
                  marginRight: 6, 
                }}>{'>'}</span> 
              Play Cards
            </p>
            <p 
              onClick={handleClaimLuck}
              style={{
                width: "50%", 
                fontSize: 13, 
                color: "#000", 
                cursor: "pointer",
                justifyContent: "center",
                alignItems: "center", 
                display: "flex",
                opacity: 0, border: "1px dotted #000",                animation: "fadeIn 0.5s ease-in-out 6s forwards"
              }}>
               Exit
            </p>
            </div>

            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear 0.5s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear 1s forwards"}}></div>
            <div style={{height: 0, width: 2, backgroundColor: "#E1001D", animation: "drawLineUp 5s linear 1.5s forwards"}}></div>
          </div>
          
          
        </div> :
        <div style={{ 
          height: "100px", 
          width: "190px",
          display: "flex", 
          justifyContent: "center", 
          flexDirection: "column", 
          alignItems: "center",
          position: "relative"
        }}>
          {isGameComplete ? (
            <div style={{
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              animation: "fadeIn 0.5s ease-in"
            }}>
              <p style={{color: "#E1001D", fontWeight: "bold", margin: "0 0 8px 0"}}>You Won!</p>
              <div style={{display: "flex", gap: 8}}>
                <button 
                  onClick={resetGame}
                  style={{
                    border: "1px solid #000",
                    background: "none",
                    padding: "2px 6px",
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Play Again
                </button>
                <button 
                  onClick={exitCardGame}
                  style={{
                    border: "1px solid #000",
                    background: "none",
                    padding: "2px 6px",
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Exit
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{display: "flex", gap: 8, flexDirection: "row", marginBottom: 8}}>
                {cards.slice(0, 4).map((card, index) => (
                  <div 
                    key={card.id}
                    onClick={() => handleCardFlip(index)}
                    style={{
                      width: 35,
                      height: 45,
                      cursor: "pointer",
                      perspective: "1000px",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                    }}
                  >
                    <img 
                      draggable="false"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        transform: flippedIndices.includes(index) || matchedPairs.includes(card.value) ? "rotateY(180deg)" : "rotateY(0deg)",
                        transition: "transform 0.5s"
                      }} 
                      src="./cards/cardBack.png"
                    />
                    <img 
                      draggable="false"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        transform: flippedIndices.includes(index) || matchedPairs.includes(card.value) ? "rotateY(0deg)" : "rotateY(180deg)",
                        transition: "transform 0.5s"
                      }} 
                      src={card.image}
                    />
                  </div>
                ))}
              </div>
              <div style={{display: "flex", gap: 8, flexDirection: "row"}}>
                {cards.slice(4, 8).map((card, index) => (
                  <div 
                    key={card.id}
                    onClick={() => handleCardFlip(index + 4)}
                    style={{
                      width: 35,
                      height: 45,
                      cursor: "pointer",
                      perspective: "1000px",
                      position: "relative",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                    }}
                  >
                    <img 
                      draggable="false"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        transform: flippedIndices.includes(index + 4) || matchedPairs.includes(card.value) ? "rotateY(180deg)" : "rotateY(0deg)",
                        transition: "transform 0.5s"
                      }} 
                      src="./cards/cardBack.png"
                    />
                    <img 
                      draggable="false"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        transform: flippedIndices.includes(index + 4) || matchedPairs.includes(card.value) ? "rotateY(0deg)" : "rotateY(180deg)",
                        transition: "transform 0.5s"
                      }} 
                      src={card.image}
                    />
                  </div>
                ))}
              </div>
              <button 
                onClick={exitCardGame}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  border: "none",
                  background: "none",
                  fontSize: 10,
                  color: "#999",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Exit
              </button>
            </>
          )}
        </div>
        }
        <div style={{ height: "100px", overflow: "hidden", position: "relative" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            animation: "scrollSeamless 25s linear infinite"
          }}>
            <img style={{ 
              height: "150px",
              objectFit: "contain",
              transform: "scaleX(-1)" 
            }} src="/leftrabbit.png" />
            <img style={{ 
              height: "150px",
              objectFit: "contain",
              marginTop: "-1px",
              transform: "scaleX(-1)"
            }} src="/leftrabbit.png" />
          </div>
        </div>
      </div>
    </>
  );
} 