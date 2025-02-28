import React, { useState, useEffect, useRef } from 'react';

export default function FirstChallengeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData }) {
    const [prLink, setPrLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
        
        // Check achievements from userData prop
        if (userData?.achievements?.includes('pr_submitted')) {
            setIsSuccess(true);
        }
    }, [userData]);

    const handleSubmitPR = async () => {
        if (!token) {
            setError('Please log in first');
            return;
        }

        if (!prLink) {
            setError('Please enter a PR link');
            return;
        }
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await fetch('/api/submit-pr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, prLink }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit PR');
            }
            
            // Play collect sound
            audioRef.current?.play();
            
            // Trigger the shake animation
            document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both');
            setTimeout(() => {
                document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'none');
            }, 600);

            // Update userData with new achievement
            setUserData({
                ...userData,
                achievements: [...(userData?.achievements || []), 'pr_submitted']
            });

            setIsSuccess(true);
            setPrLink(''); // Clear the input
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasPRSubmitted = userData?.achievements?.includes('pr_submitted') || isSuccess;

    return (
        <div style={{
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
        }}>
            <div 
                onClick={handleWindowClick('firstChallenge')}
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
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <audio ref={audioRef} src="/collect.mp3" />
                <div 
                    onMouseDown={handleMouseDown('firstChallenge')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('firstChallenge'); }}>x</button>
                    </div>
                    <p>FirstChallenge.txt</p>
                    <div></div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: 12, padding: 16}}>
                    <p>Your first challenge, should you choose to accept it, is to come up with your idea & add it to Juice repo games folder.</p>
                    <ol>
                        <li>write your idea in a markdown file <a target="_blank" href="https://github.com/hackclub/juice/blob/main/games/template/README.md">(template)</a></li>
                        <li>open a PR to the <a target="_blank" href="https://github.com/hackclub/juice">Juice repo</a> & add your idea <a target="_blank" href="https://youtu.be/7O4qYoWU54M?si=kyA3mdGAJMZnBbZe">(guide)</a></li>
                    </ol>
                    <p>Here's <a target="_blank" href="https://github.com/hackclub/juice/tree/main/games/mountainVille">the markdown file that Paolo & I made for our game</a>.</p>
                    <div>
                    <p>~Thomas Stubblefield</p>
                    <i>In life we are always learning</i>
                    </div>
                    <div style={{display: "flex", width: "100%", backgroundColor: "#000", height: 1}}></div>
                    {!hasPRSubmitted && (
                        <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                            <input 
                                placeholder="link to your team's pr" 
                                style={{width: 250}} 
                                value={prLink}
                                onChange={(e) => setPrLink(e.target.value)}
                            />
                            <button 
                                style={{width: 150}}
                                onClick={handleSubmitPR}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'complete challenge'}
                            </button>
                        </div>
                    )}
                    {error && <p style={{color: 'red', margin: 0}}>{error}</p>}
                    {hasPRSubmitted && (
                        <p style={{color: 'green', margin: 0}}>Challenge completed! Achievement unlocked: PR submitted 🎉</p>
                    )}
                    <p></p>
                </div>
            </div>
        </div>
    );
} 