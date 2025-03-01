import React, { useState, useEffect, useRef } from 'react';

export default function SecondChallengeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData }) {
    const [itchLink, setItchLink] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isInReview, setIsInReview] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        // Check achievements from userData prop
        if (userData?.achievements?.includes('second_challenge_completed')) {
            setIsSuccess(true);
        }
    }, [userData]);

    const handleSubmit = async () => {
        if (!token) {
            alert('Please log in first');
            return;
        }

        if (!itchLink) {
            alert('Please enter a Itch link');
            return;
        }

        if (selectedPlatforms.length === 0) {
            alert('Please select at least one platform');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch('/api/submit-second-challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, itchLink, platforms: selectedPlatforms }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit');
            }
            
            // Play collect sound
            audioRef.current?.play();
            
            setIsInReview(true);
            setItchLink(''); // Clear the input
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePlatform = (platform) => {
        setSelectedPlatforms(prev => 
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const hasCompleted = userData?.achievements?.includes('second_challenge_completed') || isSuccess;

    return (
        <div style={{
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            transform: `translate(${position.x}px, ${position.y}px)`,
            left: 0,
            top: 0,
        }}>
            <div 
                onClick={handleWindowClick('secondChallenge')}
                style={{
                    display: "flex", 
                    width: 500,
                    color: 'black',
                    height: 300,
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale",
                    cursor: isDragging ? 'grabbing' : 'default'
                }}>
                <audio ref={audioRef} src="/collect.mp3" />
                <div 
                    onMouseDown={handleMouseDown('secondChallenge')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('secondChallenge'); }}>x</button>
                    </div>
                    <p>SecondChallenge.txt</p>
                    <div></div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: 12, padding: 16}}>
                    <p>Hey, Thomas here!</p>
                    <p>Your challenge this week is to make a proof of concept for the core mechanic of your game. Your game doesn't have to look beautiful, have any assets, or even a start/stop menu. All you need is a little bit of playable content for the core mechanic of your game.</p>
                    <p>Once you have that core game play, you can ship it to <a href="https://itch.io/developers" target="_blank" rel="noopener noreferrer">itch.io</a> & then your game will be reviewed & if it works you'll get the 2nd achievement. Deploy to as many platforms as you'd like</p>
                    {!hasCompleted && !isInReview && (
                        <>
                            <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                                <input 
                                    placeholder="link to your itch.io" 
                                    style={{width: 250}} 
                                    value={itchLink}
                                    onChange={(e) => setItchLink(e.target.value)}
                                />
                                <button 
                                    style={{width: 150}}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'complete challenge'}
                                </button>
                            </div>
                            <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                                <label style={{display: "flex", alignItems: "center", gap: 4}}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes('Windows')}
                                        onChange={() => togglePlatform('Windows')}
                                    />
                                    Windows
                                </label>
                                <label style={{display: "flex", alignItems: "center", gap: 4}}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes('Linux')}
                                        onChange={() => togglePlatform('Linux')}
                                    />
                                    Linux
                                </label>
                                <label style={{display: "flex", alignItems: "center", gap: 4}}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes('Mac')}
                                        onChange={() => togglePlatform('Mac')}
                                    />
                                    Mac
                                </label>

                                <label style={{display: "flex", alignItems: "center", gap: 4}}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes('Web')}
                                        onChange={() => togglePlatform('Web')}
                                    />
                                    Web
                                </label>
                            </div>
                        </>
                    )}
                    {isInReview && (
                        <p style={{color: 'blue', margin: 0}}>Itch.io link submitted! I'll check out your project & let you know if it works. Keep juicing ~Thomas <i>(in life we are always learning)</i></p>
                    )}
                    {error && <p style={{color: 'red', margin: 0}}>{error}</p>}
                    {hasCompleted && (
                        <p style={{color: 'green', margin: 0}}>Challenge completed! Achievement unlocked: Second Challenge Complete 🎉</p>
                    )}
                </div>
            </div>
        </div>
    );
} 