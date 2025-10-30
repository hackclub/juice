import React, { useState, useEffect, useRef } from 'react';

export default function PostcardWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData }) {
    const [displayText, setDisplayText] = useState('');
    const [showWaves, setShowWaves] = useState(false);
    const [currentWave, setCurrentWave] = useState(1);
    const [signatureText, setSignatureText] = useState('');
    const [imageOpacity, setImageOpacity] = useState(0);
    const [showPostcard, setShowPostcard] = useState(false);
    const [postcardOpacity, setPostcardOpacity] = useState(0);
    const [lastColorIndex, setLastColorIndex] = useState(0);
    const [bgColor, setBgColor] = useState('#fff');
    const fullText = 'Welcome';
    const signatureFullText = 'from thomas';
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];

    // Add audio ref
    const audioRef = useRef(new Audio('./song.mp3'));
    
    // Get first postcard image URL
    const postcardImageUrl = userData?.Postcards?.[0]?.postcardScan?.[0]?.url;

    // Update the state to track the address
    const [mailingAddress, setMailingAddress] = useState('');

    // Add new state for initial mount animation
    const [mounted, setMounted] = useState(false);

    // Set up audio when component mounts
    useEffect(() => {
        audioRef.current.volume = 0.2; // Set to 20% volume
        
        return () => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, []);

    // Handle audio based on window active state
    useEffect(() => {
        if (isActive) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isActive]);

    // Initial text animation
    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setDisplayText(prevText => ({
                        text: fullText,
                        colorIndex: -1
                    }));
                    setTimeout(() => {
                        setShowWaves(true);
                        // Fade in the image
                        setImageOpacity(1);
                        // Delay signature animation
                        setTimeout(() => {
                            let sigIndex = 0;
                            const sigInterval = setInterval(() => {
                                if (sigIndex <= signatureFullText.length) {
                                    setSignatureText(signatureFullText.slice(0, sigIndex));
                                    if (sigIndex > 0) {
                                        setLastColorIndex(prev => (prev + 1) % colors.length);
                                    }
                                    sigIndex++;
                                } else {
                                    clearInterval(sigInterval);
                                    // Small delay then turn everything black
                                    setTimeout(() => {
                                        setSignatureText(signatureFullText); // Set full text
                                        setLastColorIndex(-1); // Use this as a flag to make everything black
                                    }, 100);
                                }
                            }, 37.5);
                        }, 1000);
                    }, 100);
                }, 50);
            }
        }, 25);

        return () => clearInterval(interval);
    }, []);

    // Wave animation
    useEffect(() => {
        if (showWaves) {
            const waveInterval = setInterval(() => {
                setCurrentWave(prev => prev === 1 ? 2 : 1);
            }, 500);

            return () => clearInterval(waveInterval);
        }
    }, [showWaves]);

    // Update the postcard transition effect
    useEffect(() => {
        if (showWaves) {
            const timer = setTimeout(() => {
                setBgColor('#000'); // Darken the background
                setShowPostcard(true);
                // Start from 0 and animate to 1 for both scale and opacity
                setPostcardOpacity(0);
                setTimeout(() => {
                    setPostcardOpacity(1);
                }, 100);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showWaves]);

    // Add effect to trigger mount animation
    useEffect(() => {
        // Small delay to ensure transition works
        setTimeout(() => {
            setMounted(true);
        }, 50);
    }, []);

    return (
        <div 
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${mounted ? 1 : 0})`,
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy effect
            }}>
            <div 
                onClick={handleWindowClick('postcard')}
                onMouseDown={handleMouseDown('postcard')}
                style={{
                    display: "flex",
                    width: 600,
                    height: 500,
                    color: 'black',
                    backgroundColor: bgColor,
                    border: "1px solid #000",
                    borderRadius: 4,
                    padding: 32,
                    justifyContent: "center",
                    alignItems: "center",
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale",
                    boxShadow: "0 2px 30px rgba(0, 0, 0, 0.2)",
                    flexDirection: "column",
                    gap: 16,
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative'
                }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent window click event
                        handleDismiss('postcard');
                    }}
                    style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        padding: '2px 6px',
                        cursor: 'pointer'
                    }}
                >
                    x
                </button>
                {!showWaves ? (
                    <div style={{ 
                        display: 'flex',
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease-in-out'
                    }}>
                        {typeof displayText === 'string' ? 
                            displayText.split('').map((letter, index) => (
                                <span 
                                    key={index} 
                                    style={{
                                        fontSize: 24,
                                        color: index === displayText.length - 1 ? 
                                            colors[index % colors.length] : 'black',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    {letter}
                                </span>
                            ))
                            :
                            displayText.text.split('').map((letter, index) => (
                                <span 
                                    key={index} 
                                    style={{
                                        fontSize: 24,
                                        color: 'black',
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    {letter}
                                </span>
                            ))
                        }
                    </div>
                ) : (
                    <>
                        {!showPostcard ? (
                            <>
                                <img 
                                    src={`/wave${currentWave}.jpg`}
                                    alt="Wave"
                                    style={{
                                        width: 200,
                                        height: 'auto',
                                        opacity: imageOpacity,
                                        transition: 'all 0.5s ease-in-out',
                                        transform: `scale(${imageOpacity})`,
                                    }}
                                />
                                <div style={{ 
                                    display: 'flex',
                                    opacity: signatureText.length ? 1 : 0,
                                    transform: `translateY(${signatureText.length ? 0 : 10}px)`,
                                    transition: 'all 0.3s ease-in-out'
                                }}>
                                    <i>
                                        {signatureText.split('').map((letter, index) => (
                                            <span 
                                                key={index} 
                                                style={{
                                                    fontSize: 16,
                                                    color: lastColorIndex === -1 ? 'black' : // If animation is done, everything black
                                                        (index === signatureText.length - 1 ? // Otherwise, only last letter colored
                                                            colors[index % colors.length] : 'black'),
                                                    transition: 'all 0.2s ease-in-out',
                                                    opacity: 1,
                                                    transform: 'translateY(0)'
                                                }}
                                            >
                                                {letter}
                                            </span>
                                        ))}
                                    </i>
                                </div>
                            </>
                        ) : (
                            <>
                                <img 
                                    src={postcardImageUrl}
                                    alt="Postcard"
                                    style={{
                                        width: '90%',
                                        height: 'auto',
                                        marginBottom: 16,
                                        opacity: postcardOpacity,
                                        transition: 'all 1s ease-in-out',
                                        transform: `scale(${postcardOpacity})`,
                                    }}
                                />
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    width: '90%',
                                    opacity: postcardOpacity,
                                    transition: 'all 1s ease-in-out',
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Home Address"
                                        value={mailingAddress}
                                        onChange={(e) => setMailingAddress(e.target.value)}
                                        style={{ 
                                            flex: 2,
                                            padding: '4px 8px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        onClick={async () => {
                                            if (!mailingAddress.trim()) {
                                                alert('Please enter your home address first');
                                                return;
                                            }
                                            
                                            const confirmed = window.confirm(
                                                `Just to confirm, does: "${mailingAddress}" contain your address, city, zipcode, state, country, etc?`
                                            );
                                            
                                            if (confirmed) {
                                                try {
                                                    const response = await fetch('/api/submit-address', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({
                                                            token: userData.token,
                                                            mailingAddress: mailingAddress
                                                        })
                                                    });

                                                    const data = await response.json();
                                                    
                                                    if (data.success) {
                                                        alert('Address submitted successfully! We\'ll mail your postcard soon.');
                                                        handleDismiss('postcard');
                                                    } else {
                                                        throw new Error(data.message);
                                                    }
                                                } catch (error) {
                                                    alert('Error submitting address: ' + error.message);
                                                }
                                            }
                                        }}
                                        style={{ 
                                            flex: 1,
                                            whiteSpace: 'nowrap',
                                            padding: '4px 8px',
                                            fontSize: '14px',
                                            backgroundColor: '#ff0000',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        mail it to my home 💮
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 