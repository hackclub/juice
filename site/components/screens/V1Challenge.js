import React, { useState, useEffect, useRef } from 'react';

export default function V1Challenge({ userData, handleThirdChallengeOpen }) {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [currentPattern, setCurrentPattern] = useState(0);
  const patternCycleRef = useRef(0); // Keep track of pattern cycles
  const [isHovering, setIsHovering] = useState(false); // Track hover state
  const [isV1Tapped, setIsV1Tapped] = useState(false); // Track if card has been tapped
  const [displayText, setDisplayText] = useState(""); // For typewriter effect
  const [typingComplete, setTypingComplete] = useState(false); // Track if typing is done
  const [countdown, setCountdown] = useState(""); // For countdown timer
  
  // Define grid dimensions at component level so they're available to all functions
  const rows = 7;
  const cols = 15;
  
  // The message to be displayed when tapped
  const fullMessage = "Your third challenge (V1) is to make 30min of complete gameplay, open source your game on GitHub, and publish your game to your own site or a well-crafted itch page.";
  
  // Target date for countdown: March 9, 2025, 9PM PST
  const targetDate = new Date("2025-03-09T21:00:00-08:00");
  
  // Typewriter effect for the message
  useEffect(() => {
    if (!isV1Tapped) return;
    
    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullMessage.length) {
        setDisplayText(fullMessage.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTypingComplete(true); // Mark typing as complete
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [isV1Tapped]);
  
  // Countdown timer effect
  useEffect(() => {
    if (!typingComplete) return;
    
    // Format the countdown for display
    const formatCountdown = () => {
      const now = new Date();
      const timeDiff = targetDate - now;
      
      if (timeDiff <= 0) {
        return "V1 Submissions are open now!";
      }
      
      // Calculate remaining time
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      // Format the countdown string
      let countdownText = "V1 Submissions open in ";
      
      if (days > 0) {
        countdownText += `${days} day${days !== 1 ? 's' : ''}, `;
      }
      
      countdownText += `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} min${minutes !== 1 ? 's' : ''}`;
      
      return countdownText;
    };
    
    setCountdown(formatCountdown());
    
    // Update countdown every minute
    const countdownInterval = setInterval(() => {
      setCountdown(formatCountdown());
    }, 60000); // Update every minute instead of every second
    
    return () => clearInterval(countdownInterval);
  }, [typingComplete]);
  
  // Handle card tap
  const handleCardTap = () => {
    if (!isV1Tapped) {
      setIsV1Tapped(true);
    }
  };
  
  // Define which grid positions form "V1" (row, col)
  const v1Pattern = [
    // V shape (left side)
    [0, 1], [1, 1], [2, 1], [3, 1], [4, 2], [5, 3],
    // V shape (middle/bottom)
    [6, 4],
    // V shape (right side)
    [5, 5], [4, 6], [3, 7], [2, 7], [1, 7], [0, 7],
    // Number 1
    [0, 10], [1, 9], [1, 10], [2, 10], [3, 10], [4, 10], [5, 10], [6, 9], [6, 10], [6, 11]
  ];

  // Animation sequence with simplified pattern alternation - only runs on hover
  useEffect(() => {
    // Don't run animation if not hovering or if already tapped
    if (!isHovering || isV1Tapped) return;
    
    const v1CycleLength = Math.floor(v1Pattern.length * 0.7) + 12; // Longer V1 animation
    const otherPatternCycleLength = 80; // Slower decorative patterns

    const timer = setInterval(() => {
      setAnimationFrame(prevFrame => {
        // Increment the frame counter
        const nextFrame = prevFrame + 1;
        
        // Get current cycle length based on pattern type
        const currentCycleLength = currentPattern === 0 
          ? v1CycleLength 
          : otherPatternCycleLength;
        
        // Check if we've reached the end of a cycle
        if (nextFrame >= currentCycleLength) {
          // Switch patterns at the end of a cycle
          patternCycleRef.current += 1;
          
          // If we just finished showing V1, switch to a random pattern
          if (currentPattern === 0) {
            const randomPattern = Math.floor(Math.random() * 4) + 1;
            setCurrentPattern(randomPattern);
          } else {
            // If we just finished a random pattern, go back to V1
            setCurrentPattern(0);
          }
          
          // Reset frame counter
          return 0;
        }
        
        return nextFrame;
      });
    }, 120); // Much slower animation for more satisfying pacing
    
    return () => clearInterval(timer);
  }, [currentPattern, isHovering, isV1Tapped]); // Add isV1Tapped to dependencies
  
  // Reset animation when hover ends
  useEffect(() => {
    if (!isHovering) {
      setAnimationFrame(0);
      setCurrentPattern(0);
    }
  }, [isHovering]);

  // Helper function for easing
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  // Pattern 0: V1 Pattern (base pattern)
  const isV1PatternLit = (row, col, frame) => {
    const positionIndex = v1Pattern.findIndex(pos => pos[0] === row && pos[1] === col);
    if (positionIndex === -1) return false;
    
    const totalSquares = v1Pattern.length;
    const totalAnimationFrames = Math.floor(totalSquares * 0.7) + 12;
    
    // Apply easing to frame progression
    let normalizedFrame = frame / totalAnimationFrames;
    
    // First half is appearance
    if (frame < totalAnimationFrames / 2) {
      // Use ease-in for appearance
      const easedProgress = easeInOutQuad(normalizedFrame * 2);
      const revealIndex = Math.floor(easedProgress * totalSquares);
      return positionIndex <= revealIndex;
    } 
    // Second half is disappearance
    else {
      // Hold full pattern for a moment in the middle
      if (frame < (totalAnimationFrames * 0.6)) {
        return true;
      }
      
      // Use ease-out for disappearance
      const disappearanceProgress = (frame - (totalAnimationFrames * 0.6)) / (totalAnimationFrames * 0.4);
      const easedProgress = easeInOutQuad(disappearanceProgress);
      const fadeIndex = Math.floor(easedProgress * totalSquares);
      return positionIndex >= fadeIndex;
    }
  };
  
  // Pattern 1: Ripple pattern - creates expanding/contracting circles
  const isRipplePatternLit = (row, col, frame) => {
    const centerRow = 3, centerCol = 7;
    // Calculate distance from center
    const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2) * 1.5);
    
    // Create expanding ripple effect
    const ripplePosition = frame % 15; // 0-14
    const rippleWidth = 1.5;
    
    return distance > ripplePosition - rippleWidth && distance < ripplePosition;
  };
  
  // Pattern 2: Digital Rain pattern (replaces diagonal pattern)
  const isRainPatternLit = (row, col, frame) => {
    // Create a column-based "digital rain" effect
    // Each column has droplets falling at different speeds
    
    // Generate a semi-random speed for each column (1-3)
    const columnSpeed = ((col * 7 + 3) % 3) + 1;
    
    // Calculate droplet position for this column
    const dropletPosition = Math.floor((frame * columnSpeed) % (rows * 2));
    
    // Make some columns start later than others for better visual effect
    const columnOffset = (col * 3) % 7;
    
    // Each droplet is 2-3 cells long with a "tail"
    const dropletHead = dropletPosition - columnOffset;
    
    if (row === dropletHead % rows) {
      // Droplet head - brightest
      return true;
    } else if (row === (dropletHead - 1) % rows) {
      // Droplet middle - visible but not as bright
      return frame % 2 === 0; // Flicker effect
    } else if (row === (dropletHead - 2) % rows) {
      // Droplet tail - faintest
      return frame % 3 === 0; // More subtle flicker
    }
    
    return false;
  };
  
  // Pattern 3: Spiral pattern
  const isSpiralPatternLit = (row, col, frame) => {
    const centerRow = 3, centerCol = 7;
    // Calculate angle and distance from center
    const angle = Math.atan2(row - centerRow, col - centerCol);
    const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
    
    // Create spiral effect
    const spiralPhase = frame % 30;
    const spiralRotations = 2; // How many rotations in the spiral
    
    // Normalize angle to 0-2π
    const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
    const spiralPosition = (normalizedAngle / (2 * Math.PI) * spiralRotations + distance / 10) % 1;
    
    return spiralPosition > (spiralPhase / 30) - 0.1 && spiralPosition < (spiralPhase / 30);
  };
  
  // Pattern 4: Twinkle/random pattern
  const isTwinklePatternLit = (row, col, frame) => {
    // Use a pseudo-random function based on position and frame
    const seed = Math.sin(row * 100 + col * 10 + frame * 0.5) * 10000;
    const random = seed - Math.floor(seed);
    
    return random > 0.7; // Adjust threshold to control density of lit squares
  };

  // Check if a square should be lit in the current animation frame
  const isSquareLit = (row, col) => {
    const frame = animationFrame;
    
    // Select the pattern based on currentPattern
    switch(currentPattern) {
      case 0:
        return isV1PatternLit(row, col, frame);
      case 1:
        return isRipplePatternLit(row, col, frame);
      case 2:
        return isRainPatternLit(row, col, frame);
      case 3:
        return isSpiralPatternLit(row, col, frame);
      case 4:
        return isTwinklePatternLit(row, col, frame);
      default:
        return false;
    }
  };

  // Create a grid programmatically
  const renderGrid = () => {
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const rowSquares = [];
      for (let j = 0; j < cols; j++) {
        const lit = isSquareLit(i, j);
        
        // Get color based on current pattern and position
        let litColor, litBorder;
        
        if (lit) {
          switch(currentPattern) {
            case 0: // V1 Pattern - multiple greens
              // Use different shades of green based on position in the pattern
              const v1Index = v1Pattern.findIndex(pos => pos[0] === i && pos[1] === j);
              if (v1Index < v1Pattern.length / 3) {
                // First third - lighter green
                litColor = "#9AE6B4";
                litBorder = "#38A169";
              } else if (v1Index < (v1Pattern.length * 2) / 3) {
                // Middle third - medium green
                litColor = "#68D391";
                litBorder = "#2F855A";
              } else {
                // Last third - darker green
                litColor = "#38A169";
                litBorder = "#276749";
              }
              break;

            case 1: // Ripple Pattern - rainbow gradient
              const centerRow = 3, centerCol = 7;
              // Calculate distance from center to determine color
              const distance = Math.sqrt(Math.pow(i - centerRow, 2) + Math.pow(j - centerCol, 2));
              // Create a hue based on distance and frame
              const rippleHue = (distance * 30 + animationFrame * 5) % 360;
              litColor = `hsl(${rippleHue}, 80%, 65%)`;
              litBorder = `hsl(${rippleHue}, 80%, 45%)`;
              break;

            case 2: // Digital Rain Pattern - different greens/blues for head/middle/tail
              // Determine position in droplet
              const columnSpeed = ((j * 7 + 3) % 3) + 1;
              const dropletPosition = Math.floor((animationFrame * columnSpeed) % (rows * 2));
              const columnOffset = (j * 3) % 7;
              const dropletHead = dropletPosition - columnOffset;
              
              if (i === dropletHead % rows) {
                // Droplet head - bright cyan
                litColor = "#0BC5EA";
                litBorder = "#0987A0";
              } else if (i === (dropletHead - 1) % rows) {
                // Droplet middle - medium blue
                litColor = "#63B3ED";
                litBorder = "#3182CE";
              } else {
                // Droplet tail - darker blue
                litColor = "#4299E1";
                litBorder = "#2B6CB0";
              }
              break;

            case 3: // Spiral Pattern - color wheel
              const centerRowS = 3, centerColS = 7;
              // Use angle to create a color wheel effect
              const angle = Math.atan2(i - centerRowS, j - centerColS);
              // Normalize angle to 0-2π and convert to hue (0-360)
              const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
              const hue = (normalizedAngle / (2 * Math.PI) * 360 + animationFrame * 2) % 360;
              litColor = `hsl(${hue}, 85%, 60%)`;
              litBorder = `hsl(${hue}, 85%, 40%)`;
              break;

            case 4: // Twinkle Pattern - already multi-color, but enhance intensity
              const twinkleHue = (i * 50 + j * 30 + animationFrame * 5) % 360;
              // Use different saturations based on position to create more variety
              const saturation = 70 + ((i + j) % 3) * 10; // 70%, 80%, or 90% saturation
              const lightness = 50 + ((i * j) % 3) * 10; // 50%, 60%, or 70% lightness
              litColor = `hsl(${twinkleHue}, ${saturation}%, ${lightness}%)`;
              litBorder = `hsl(${twinkleHue}, ${saturation}%, ${Math.max(lightness - 20, 30)}%)`;
              break;

            default:
              litColor = "#38A169"; // Default to green
              litBorder = "#276749";
          }
        } else {
          // Unlit squares
          litColor = "#ebedf0";
          litBorder = "#d1d5da";
        }
        
        rowSquares.push(
          <div 
            key={`${i}-${j}`}
            style={{
              width: 16, 
              height: 16, 
              borderRadius: 4, 
              backgroundColor: litColor, 
              border: "1px solid " + litBorder,
              boxShadow: lit ? "none" : "0 0 4px 1px rgba(255, 255, 255, 0.7)",
            }}
          />
        );
      }
      grid.push(
        <div key={`row-${i}`} style={{display: "flex", flexDirection: "row", gap: 2}}>
          {rowSquares}
        </div>
      );
    }
    return grid;
  };

  // Handle resetting the component to initial state
  const resetComponent = () => {
    if (isV1Tapped) {
      setIsV1Tapped(false);
      setDisplayText("");
      setTypingComplete(false);
      setCountdown("");
    }
    setIsHovering(false);
    setAnimationFrame(0);
    setCurrentPattern(0);
  };

  return (
    <div
      className="panel-pop rainbow-glass-panel"
      style={{
        width: 332,
        marginTop: 8,
        borderRadius: 8,
        padding: 12,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
        cursor: isV1Tapped ? 'default' : 'pointer',
        transform: isHovering || isV1Tapped ? 'scaleY(1)' : 'scaleY(1.0)',
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease-in-out',
      }}
      onMouseEnter={() => !isV1Tapped && setIsHovering(true)}
      onMouseLeave={resetComponent}
      onClick={handleCardTap}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {!isV1Tapped ? (
          // Show the grid when not tapped
          <>
            <div style={{display: "flex", flexDirection: "column", gap: 2}}>
              {renderGrid()}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card tap handler from firing
                handleThirdChallengeOpen();
              }}
              disabled={userData.achievements.includes('v1_submitted')}
              style={{
                padding: '4px 12px',
                position: "absolute",
                right: -38,
                bottom: 48,
                backgroundColor: '#2dba4e',
                color: '#000',
                opacity: userData.achievements.includes('v1_submitted')
                  ? 0.7
                  : 1.0,
                border: '2px solid #000',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 'bold',
                transform: 'rotate(90deg)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {userData.achievements.includes('v1_submitted')
                ? 'Submitted V1'
                : 'Discover V1'}
            </button>
          </>
        ) : (
          // Show animated text when tapped
          <div style={{
            padding: '16px',
            fontSize: '16px',
            lineHeight: '1.0',
            height: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            color: '#276749', // Using the same green from our animation
            position: 'relative'
          }}>
            <p>{displayText}</p>
            
            {/* Show countdown after typing is complete */}
            {typingComplete && (
              <div style={{
                marginTop: '20px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                <p style={{fontSize: 14}}>{countdown}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 