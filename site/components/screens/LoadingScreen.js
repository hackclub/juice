import { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({isJungle}) {
  const textRef = useRef(null);
  const [barColor, setBarColor] = useState('#E31E60');

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const progressBar = document.getElementById('progress-bar');
          const width = progressBar.style.width;
          const progress = parseFloat(width) || 0;
          
          // Update text opacity
          if (textRef.current) {
            textRef.current.style.opacity = progress / 100;
          }

          // Update color based on progress - vintage Mac rainbow colors
          if (progress <= 14) {
            setBarColor('#E31E60');     // Vintage magenta
          } else if (progress <= 28) {
            setBarColor('#FF453C');     // Vintage red
          } else if (progress <= 42) {
            setBarColor('#FF883E');     // Vintage orange
          } else if (progress <= 56) {
            setBarColor('#FFC900');     // Vintage yellow
          } else if (progress <= 70) {
            setBarColor('#53D769');     // Vintage green
          } else if (progress <= 84) {
            setBarColor('#00B2CA');     // Vintage cyan
          } else if (progress <= 98) {
            setBarColor('#67B1E0');     // Vintage blue
          } else {
            setBarColor('#FFFFFF');     // White
          }
        }
      });
    });

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      observer.observe(progressBar, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: 'black',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      cursor: 'none'
    }}>
      <div 
        ref={textRef}
        style={{ 
          fontSize: '32px',
          opacity: 0,
          transition: 'opacity 0.1s linear'
        }}
      >
        Juice & Jungle
      </div>
      <div style={{
        width: '300px',
        height: '4px',
        backgroundColor: '#333'
      }}>
        <div 
          id="progress-bar"
          style={{
            width: '0%',
            height: '100%',
            backgroundColor: barColor,
            transition: 'width 0.1s linear, background-color 0.5s ease'
          }}
        />
      </div>
    </div>
  );
} 