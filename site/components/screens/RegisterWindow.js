import React, { useEffect, useRef, useState } from 'react';

export default function RegisterWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, isLoggedIn, setIsLoggedIn, setUserData }) {
    const inputRef = useRef(null);
    const audioRef = useRef(null);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');
    const [showTokenUpload, setShowTokenUpload] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [tokenStatus, setTokenStatus] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const [pixelCrumble, setPixelCrumble] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current && !showTokenUpload) {
            inputRef.current.focus();
        }
    }, [showTokenUpload]);

    const handleSubmit = async () => {
        if (!email || email === "nevergonna@giveyouup.com" || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/
)) {
          window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
          return;
        }

        setStatus('loading');
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            setStatus('success');
            setEmail('');
            setShowTokenUpload(true);
        } catch (error) {
            console.error('Registration error:', error);
            setStatus('error');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingFile(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDraggingFile(false);

        const file = e.dataTransfer.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            // Validate the token first
            const response = await fetch('https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com/api/user', {
                headers: {
                    'Authorization': `Bearer ${text.trim()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            
            // Get user data from response
            const data = await response.json();
            
            // Only set token and logged in state if validation succeeds
            localStorage.setItem('token', text.trim());
            setTokenStatus('success');
            // Update userData in parent component with the correct nested structure
            if (data.userData) {
                setUserData(data.userData);
            }
            // Play collect sound
            audioRef.current?.play();
            // Trigger the shake animation in the parent
            document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both');
            
            // Start disintegration animation
            setTimeout(() => {
                setPixelCrumble(true);
                // Wait for animation to complete before setting logged in
                setTimeout(() => {
                    document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'none');
                    setIsLoggedIn(true);
                    handleDismiss('register'); // Dismiss the window after animation
                }, 1200); // Adjusted to match new animation duration
            }, 600);
        } catch (error) {
            console.error('Error reading token file:', error);
            setTokenStatus('error');
            setIsLoggedIn(false);
            localStorage.removeItem('token');
        }
    };

    const handleFileSelect = async (file) => {
        if (!file) return;

        try {
            const text = await file.text();
            // Validate the token first
            const response = await fetch('https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com/api/user', {
                headers: {
                    'Authorization': `Bearer ${text.trim()}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Invalid token');
            }
            
            // Get user data from response
            const data = await response.json();
            
            // Only set token and logged in state if validation succeeds
            localStorage.setItem('token', text.trim());
            setTokenStatus('success');
            // Update userData in parent component with the correct nested structure
            if (data.userData) {
                setUserData(data.userData);
            }
            // Play collect sound
            audioRef.current?.play();
            // Trigger the shake animation in the parent
            document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'shake 0.6s cubic-bezier(.36,.07,.19,.97) both');
            
            // Start disintegration animation
            setTimeout(() => {
                setPixelCrumble(true);
                // Wait for animation to complete before setting logged in
                setTimeout(() => {
                    document.querySelector('div[data-shake-container="true"]')?.style.setProperty('animation', 'none');
                    setIsLoggedIn(true);
                    handleDismiss('register'); // Dismiss the window after animation
                }, 1200); // Adjusted to match new animation duration
            }, 600);
        } catch (error) {
            console.error('Error reading token file:', error);
            setTokenStatus('error');
            setIsLoggedIn(false);
            localStorage.removeItem('token');
        }
    };

    return (
        <div style={{
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            position: "absolute", 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
        }}>
            <div 
                onClick={handleWindowClick('register')}
                className={pixelCrumble ? 'pixel-crumble' : ''}
                style={{
                    display: "flex", 
                    width: 400,
                    height: 200,
                    color: 'black',
                    backgroundColor: "#fff", 
                    border: "2px solid transparent", 
                    borderRadius: 4,
                    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82, #f79533)",
                    backgroundSize: "100% 100%, 200% 100%",
                    backgroundOrigin: "border-box",
                    backgroundClip: "content-box, border-box",
                    animation: "borderRotate 4s linear infinite",
                    flexDirection: "column",
                    padding: 0,
                    justifyContent: "space-between",
                    userSelect: "none",
                    transformOrigin: "center center",
                    animation: "linear .3s windowShakeAndScale",

                }}>
                <style jsx>{`
                    @keyframes borderRotate {
                        0% {
                            background-position: 100% 0%, 0% 0%;
                        }
                        100% {
                            background-position: 100% 0%, 200% 0%;
                        }
                    }

                    .rainbow-border {
                        background-image: linear-gradient(90deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82, #f79533);
                        background-size: 200% 100%;
                        animation: borderRotate 4s linear infinite;
                    }

                    @keyframes pixelCrumble {
                        0% {
                            -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            -webkit-mask-size: 100% 100%;
                            mask-size: 100% 100%;
                            transform: translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(1) rotate(0deg);
                            opacity: 1;
                            filter: brightness(1);
                        }
                        15% {
                            transform: translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(1.1) rotate(-2deg);
                            opacity: 0.95;
                            filter: brightness(1.2);
                        }
                        40% {
                            -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.35' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            transform: translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(0.9) rotate(5deg);
                            opacity: 0.8;
                            filter: brightness(1.4);
                        }
                        70% {
                            -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            transform: translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(0.7) rotate(-8deg) translateY(-20px);
                            opacity: 0.5;
                            filter: brightness(1.6);
                        }
                        100% {
                            -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
                            transform: translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(0.4) rotate(12deg) translateY(-40px);
                            opacity: 0;
                            filter: brightness(2);
                        }
                    }

                    @keyframes pixelFloat {
                        0% {
                            background-position: 50% 50%;
                        }
                        100% {
                            background-position: 51% 51%;
                        }
                    }

                    .pixel-crumble {
                        animation: pixelCrumble 1.2s cubic-bezier(.22,.68,0,.97) forwards !important;
                        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 200' width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E") !important;
                        background-size: calc(100% + 20px) calc(100% + 20px) !important;
                    }

                    .pixel-crumble::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: inherit;
                        filter: brightness(1.5);
                        mix-blend-mode: screen;
                        pointer-events: none;
                    }

                    .rainbow-button {
                        background-image: linear-gradient(
                            238deg,
                            #0000ff 0%,
                            #4400ff 4%,
                            #8800ff 8%,
                            #cc00ff 12%,
                            #ff00ff 16%,
                            #ff00cc 20%,
                            #ff0088 24%,
                            #ff0044 28%,
                            #ff0000 32%,
                            #ff4400 36%,
                            #ff8800 40%,
                            #ffcc00 44%,
                            #ffff00 48%,
                            #ccff00 52%,
                            #88ff00 56%,
                            #44ff00 60%,
                            #00ff00 64%,
                            #00ff44 68%,
                            #00ff88 72%,
                            #00ffcc 76%,
                            #00ffff 80%,
                            #00ccff 84%,
                            #0088ff 88%,
                            #0044ff 92%,
                            #0000ff 96%,
                            #4400ff 100%
                        );
                        background-size: 400% 400%;
                        animation: gradient 6s linear infinite;
                        image-rendering: pixelated;
                    }

                    @keyframes gradient {
                        0% {
                            background-position: 0% center;
                        }
                        100% {
                            background-position: -400% center;
                        }
                    }

                    .rainbow-dashed {
                        background-image: linear-gradient(90deg, 
                            #f79533 50%, transparent 50%),
                            linear-gradient(90deg, transparent 50%, #f37055 50%),
                            linear-gradient(0deg, #ef4e7b 50%, transparent 50%),
                            linear-gradient(0deg, transparent 50%, #a166ab 50%);
                        background-size: 16px 2px, 16px 2px, 2px 16px, 2px 16px;
                        background-position: 0 0, 0 100%, 0 0, 100% 0;
                        background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
                        animation: dash 4s linear infinite;
                    }

                    @keyframes dash {
                        to {
                            background-position: 100% 0, -100% 100%, 0 -100%, 100% 100%;
                        }
                    }

                    .rainbow-dashed:hover {
                        background-image: linear-gradient(90deg, 
                            #5073b8 50%, transparent 50%),
                            linear-gradient(90deg, transparent 50%, #1098ad 50%),
                            linear-gradient(0deg, #07b39b 50%, transparent 50%),
                            linear-gradient(0deg, transparent 50%, #6fba82 50%);
                    }

                    .drag-active {
                        background-color: rgba(74, 144, 226, 0.1);
                    }
                `}</style>
                <audio ref={audioRef} src="/collect.mp3" />
                <div 
                    onMouseDown={handleMouseDown('register')}
                    style={{
                        display: "flex", 
                        borderBottom: "none", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        position: 'relative'
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('register'); }}>x</button>
                    </div>
                    <p>{showTokenUpload ? 'Upload Your Special Key' : 'Register'}</p>
                    <div></div>
                    <div 
                        className="rainbow-border"
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '2px'
                        }}
                    />
                </div>
                <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12}}>
                    {!showTokenUpload ? (
                        <>
                            <p><i>Adventure Calls...</i> signing up means joining our team and committing to making your game.</p>
                            <div style={{display: "flex", height: 24, flexDirection: "row", gap: 8}}>
                                <input 
                                    ref={inputRef}
                                    style={{height: 24, width: 210, padding: "2px 4px"}}
                                    placeholder='nevergonna@giveyouup.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                />
                                <button 
                                    className="rainbow-button"
                                    style={{
                                        height: 24,
                                        padding: "2px 12px",
                                        border: "2px solid rgba(255, 255, 255, 0.8)",
                                        borderRadius: 4,
                                        cursor: status === 'loading' ? "wait" : "pointer",
                                        fontWeight: "800",
                                        fontSize: "14px",
                                        transition: "transform 0.2s ease, border-color 0.2s ease",
                                        position: "relative",
                                        overflow: "hidden",
                                        color: "white",
                                        textShadow: `
                                            -1px -1px 0 #000,  
                                            1px -1px 0 #000,
                                            -1px 1px 0 #000,
                                            1px 1px 0 #000,
                                            0 0 8px rgba(0,0,0,0.5)
                                        `,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                        opacity: status === 'loading' ? 0.7 : 1
                                    }}
                                    onClick={handleSubmit}
                                    disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? 'Emailing Key...' : 'signup'}
                                </button>
                            </div>
                            {status === 'success' && <p style={{color: 'green'}}>Thanks! Check your email soon.</p>}
                            {status === 'error' && <p style={{color: 'red'}}>Oops! Something went wrong. Please try again.</p>}
                            {(!(status === "error" || status === "success")) && (
                                <p>I will immediately email you a <b>special key</b> to get your game started & start juicing.</p>
                            )}
                        </>
                    ) : (
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={isDraggingFile ? 'drag-active' : 'rainbow-dashed'}
                            style={{
                                flex: 1,
                                borderRadius: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 16,
                                backgroundColor: isDraggingFile ? 'rgba(74, 144, 226, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {tokenStatus === 'success' ? (
                                <p style={{color: 'green'}}>Special key accepted...</p>
                            ) : tokenStatus === 'error' ? (
                                <p style={{color: 'red'}}>Error reading the key file. Please try again.</p>
                            ) : (
                                <p style={{textAlign: "center"}}>Drag and drop your special key file here
                                    <br/>
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileSelect(e.target.files[0])}
                                    />
                                    <i style={{fontSize: 14, marginTop: 8, display: "flex", gap: 16, justifyContent: "center"}}><span style={{fontSize: 14, cursor: "pointer", color: "blue", textDecoration: "underline"}} onClick={() => {
                                        fileInputRef.current?.click();
                                    }}>select token</span>
                                    <span style={{fontSize: 14, cursor: "pointer", color: "blue", textDecoration: "underline"}} onClick={() => {
                                        setShowTokenUpload(false)
                                        setStatus("")
                                    }}>resend token?</span>
                                    
                                    </i>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 