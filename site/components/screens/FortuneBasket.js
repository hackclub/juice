import React, { useEffect, useState, useRef } from 'react';
import Confetti from 'react-confetti'; 
import styles from './FortuneBasket.module.css'; 

const cookieShakeKeyframes = `
  @keyframes cookieShake {
    0% { transform: rotate(0deg) scale(1); }
    15% { transform: rotate(-1deg) scale(0.98); }
    30% { transform: rotate(1.5deg) scale(1.01); }
    45% { transform: rotate(-1.2deg) scale(0.97); }
    60% { transform: rotate(1deg) scale(1.015); }
    75% { transform: rotate(-0.8deg) scale(0.98); }
    85% { transform: rotate(0.6deg) scale(1.01); }
    100% { transform: rotate(0deg) scale(1); }
  }
`;

export default function FortuneBasket({ 
  handleDismiss, 
  position, 
  style, 
  handleMouseDown,
  handleWindowClick,
  isDragging,
  isActive,
  BASE_Z_INDEX,
  ACTIVE_Z_INDEX
}) {
  const [error, setError] = useState(null);
  const [showCookies, setShowCookies] = useState(false);
  const [selectedCookie, setSelectedCookie] = useState(null);
  const [fortuneMessage, setFortuneMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNewImages, setShowNewImages] = useState(false); 
  const [fadeInMessage, setFadeInMessage] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const fortuneSoundRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCookies(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = new Audio('/fortune.mp3');
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });
    fortuneSoundRef.current = audio;
    
    return () => {
      if (fortuneSoundRef.current) {
        fortuneSoundRef.current.pause();
        fortuneSoundRef.current = null;
      }
    };
  }, []);

  const playFortuneSound = () => {
    if (fortuneSoundRef.current) {
      fortuneSoundRef.current.currentTime = 0;
      fortuneSoundRef.current.play().catch(e => console.error('Error playing fortune sound:', e));
    }
  };

  const handleCookieClick = (index) => {
    try {
      console.log('Cookie clicked, attempting to play sound');
      if (fortuneSoundRef.current) {
        console.log('Sound ref exists');
        fortuneSoundRef.current.currentTime = 0;
        fortuneSoundRef.current.play()
          .then(() => console.log('Sound played successfully'))
          .catch(e => console.error('Sound play failed:', e));
      } else {
        console.log('Sound ref missing');
      }
      setSelectedCookie(index);
      setShowConfetti(true); 
      setShowNewImages(true); 
      generateFortuneMessage(); 
      setHasClicked(true);
    } catch (err) {
      console.error('Error in cookie click:', err);
      setError(err);
    }
  };

  const generateFortuneMessage = () => {
    const normalFortunes = [
      "Achievement unlocked: Turning dreams into reality.",
      "You will soon embark on a new adventure.",
      "Your code is about to get a new feature.",
      "A bug today is the feature of tomorrow's success.",
      "Warning: Excessive game development may lead to dreams in 8-bit.",
      "You will soon discover that 'just one more level' applies to coding too.",
      "Your high score in life is about to get a new personal best.",
      "Your lucky numbers are 2/1/25.",
      "You will soon discover that the best games are the ones you make for others.",
      "If someone offers you a side quest, take it.",
    ];
    const weirdFortunes = [
      "Get the rest of your fortune by mail in rebate.",
      "Your next big idea is loading... please wait.",
      "The fortune you seek is in another cookie.",
      "Anything not saved will be lost.",
      "Ignore previous cookie.",
      "Your next meal will bring more fortunes.",
      "I'm stuck in a fortune cookie factory, please send help.",
      "You will soon discover just how #$%@ gamedev is.",
      "You will develop a fear of waffle cones.",
      "You will soon start a new duolingo course.",
      "If a mint is offered, please take it.",
    ];

    const fortunes = hasClicked ? 
      [...normalFortunes, ...weirdFortunes] : 
      normalFortunes;

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortuneMessage(randomFortune);
    
    setTimeout(() => {
      setFadeInMessage(true);
    }, 1000);
  };

  if (error) {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        border: '1px solid #000',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <p>Something went wrong with the fortune cookie!</p>
        <button 
          onClick={() => {
            setError(null);
            setShowNewImages(false);
            setSelectedCookie(null);
          }}
          style={{
            padding: '5px 10px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
      position: "absolute", 
      top: "50%",
      left: "50%",
      zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX
    }}>
      <style>{cookieShakeKeyframes}</style>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (handleWindowClick) {
            handleWindowClick('fortuneBasket');
          }
        }}
        style={{
          display: "flex", 
          width: 300,
          height: 220,
          backgroundColor: "#fff", 
          border: "1px solid #000", 
          borderRadius: 4,
          flexDirection: "column",
          padding: 0,
          color: 'black',
          justifyContent: "flex-start",
          alignItems: "center",
          userSelect: "none",
          animation: "linear .3s windowShakeAndScale"
        }}>
        <div 
          onMouseDown={(e) => {
            e.stopPropagation();
            if (handleMouseDown) {
              handleMouseDown('fortuneBasket')(e);
            }
          }}
          style={{
            display: "flex", 
            borderBottom: "1px solid #000", 
            padding: 8, 
            width: "100%",
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center",
            cursor: isDragging ? 'grabbing' : 'grab'
          }}>
          <div style={{display: "flex", flexDirection: "row", gap: 8}}>
            <button 
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                if (handleDismiss) {
                  handleDismiss('fortuneBasket');
                }
              }}
            >x</button>
          </div>
          <p style={{ margin: 0 }}>Fortune Basket</p>
          <div></div>
        </div>
        <div style={{ 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 16px 0' }}>Choose your fortune cookie!</p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: '24px',
            width: '100%'
          }}>
            {showNewImages ? (
              <>
                <img 
                  src="./fortunecookieleft.png" 
                  alt="Fortune Cookie Left" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    animation: `${styles.moveLeft} 1s forwards`, 
                    imageRendering: 'pixelated'
                  }} 
                />
                <p style={{ 
                  margin: '0',
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '120px'
                }}>
                  {fortuneMessage}
                </p>
                <img 
                  src="./fortunecookieright.png" 
                  alt="Fortune Cookie Right" 
                  style={{ 
                    width: '60px', 
                    height: '60px', 
                    animation: `${styles.moveRight} 1s forwards`, 
                    imageRendering: 'pixelated'
                  }} 
                />
              </>
            ) : (
              [0, 1, 2].map((index) => (
                <div 
                  key={index} 
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: 'cookieShake 1.2s linear infinite',
                    transformOrigin: '50% 50%'
                  }} 
                  onClick={() => handleCookieClick(index)}
                >
                  <img 
                    src="./fortunecookieicon.png" 
                    alt="Fortune Cookie" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      imageRendering: 'pixelated'
                    }} 
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Confetti effect */}
        {showConfetti && <Confetti width={300} height={200} recycle={false} numberOfPieces={200} colors={['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']} />}
      </div>
    </div>
  );
}
