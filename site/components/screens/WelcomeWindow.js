import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { JuiceShader } from '../shaders/JuiceShader';
import { juiceboxBuilding } from '../../public/juiceboxbuilding.png';
import { JungleShader } from '../shaders/JungleShader';

export default function WelcomeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, setOpenWindows, setWindowOrder, openWindows, isLoggedIn, isVideoOpen, isJungle }) {
    const [selectedOption, setSelectedOption] = useState(0);
    const [executedOptions, setExecutedOptions] = useState(new Set());
    const [isHovered, setIsHovered] = useState(false);
    const audioRef = useRef(null);
    const fadeOutStartTimeRef = useRef(null);
    const [isMuted, setIsMuted] = useState(isLoggedIn);
    const options =  isJungle ? [isLoggedIn ? 'Start Foraging': 'Join Jam', 'Shop', 'Learn More', 'Exit'] : [isLoggedIn ? 'Start Juicing' : 'Join Jam', 'Learn More', 'Exit'];
    const logoStyle = { 
        width: isJungle ? '70%' : '110%',
        height: isJungle ? '70%' : '110%',
        imageRendering: 'pixelated', 
        marginLeft: isJungle ? '-30px' : '-70px',
        marginBottom: isJungle ? '-30px' : '50px',
        objectFit: 'contain',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        pointerEvents: 'none',
        draggable: false
    }

    useEffect(() => {
        // Start playing audio when component mounts and video is not open
        if (audioRef.current && !isVideoOpen) {
            audioRef.current.volume = isLoggedIn ? 0 : 0.5; // Set initial volume based on login status
            
            // Add timeupdate listener for fade out
            const handleTimeUpdate = () => {
                const audio = audioRef.current;
                if (!audio || isMuted) return;

                if (!fadeOutStartTimeRef.current && audio.duration) {
                    // Start fade out 20 seconds before the end
                    fadeOutStartTimeRef.current = audio.duration - 20;
                }

                if (fadeOutStartTimeRef.current && audio.currentTime >= fadeOutStartTimeRef.current) {
                    const timeLeft = audio.duration - audio.currentTime;
                    const newVolume = Math.max(0, (timeLeft / 20) * 0.5); // 0.5 is our initial volume
                    audio.volume = newVolume;
                }
            };

            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.play().catch(e => {
                console.log("Audio autoplay was prevented:", e);
            });

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                }
            };
        }
    }, [isVideoOpen]);

    // Stop audio when video window opens
    useEffect(() => {
        if (isVideoOpen && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0;
        }
    }, [isVideoOpen]);

    const handleKeyDown = (e) => {
        // Skip if focused on an input element
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowUp') {
            setSelectedOption((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'ArrowDown') {
            setSelectedOption((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'Enter' && isHovered) {  // Only check hover state for Enter key
            handleOptionClick(selectedOption);
        }
    };

    const handleOptionClick = (index) => {
        setExecutedOptions(prev => new Set([...prev, options[index]]));
        if (options[index] === 'Exit') {
            handleDismiss('welcomeWindow');
        } else if (options[index] === 'Learn More') {
            if(isJungle){
                setTimeout(() => {
                    document.getElementById("windowOpenAudio").currentTime = 0;
                    document.getElementById("windowOpenAudio").play();
                    setOpenWindows(prev => [...prev, 'wutIsJungle']);
                    setWindowOrder(prev => [...prev.filter(w => w !== 'wutIsJungle'), 'wutIsJungle']);
                }, 100);
            } else {
                if (audioRef.current) {
                    audioRef.current.volume = 0;
                    setIsMuted(true);
                }
                setTimeout(() => {
                    document.getElementById("windowOpenAudio").currentTime = 0;
                    document.getElementById("windowOpenAudio").play();
                    setOpenWindows(prev => [...prev, 'wutIsJuice']);
                    setWindowOrder(prev => [...prev.filter(w => w !== 'wutIsJuice'), 'wutIsJuice']);
                    
                    setTimeout(() => {
                        setOpenWindows(prev => [...prev, 'video']);
                        setWindowOrder(prev => [...prev.filter(w => w !== 'video'), 'video']);
                    }, 100);
                }, 100);
            }
        } else if (options[index] === 'Join Jam') {
            setTimeout(() => {
                setOpenWindows(prev => [...prev, 'register']);
                document.getElementById("windowOpenAudio").currentTime = 0;
                document.getElementById("windowOpenAudio").play();
                setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
            }, 100);
        } else if (options[index] === 'Start Juicing') {
            setTimeout(() => {
                document.getElementById("windowOpenAudio").currentTime = 0;
                document.getElementById("windowOpenAudio").play();
                setOpenWindows(prev => [...prev, 'juiceWindow']);
                setWindowOrder(prev => [...prev.filter(w => w !== 'juiceWindow'), 'juiceWindow']);
            }, 100);
        } else if (options[index] === 'Start Foraging') {
            setTimeout(() => {
                document.getElementById("windowOpenAudio").currentTime = 0;
                document.getElementById("windowOpenAudio").play();
                setOpenWindows(prev => [...prev, 'jungleWindow']);
                setWindowOrder(prev => [...prev.filter(w => w !== 'jungleWindow'), 'jungleWindow']);
            }, 100);
        } else if (options[index] === 'Shop'){
            setTimeout(() => {
                document.getElementById("windowOpenAudio").currentTime = 0;
                document.getElementById("windowOpenAudio").play();
                setOpenWindows(prev => [...prev, 'jungleShopWindow']);
                setWindowOrder(prev => [...prev.filter(w => w !== 'jungleShopWindow'), 'jungleShopWindow']);
            }, 100);
        }
    };

    const handleMuteToggle = () => {
        if (isVideoOpen) return; // Prevent toggle if video is open
        setIsMuted(!isMuted);
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = 0.5;
                audioRef.current.play();
            } else {
                audioRef.current.volume = 0;
                audioRef.current.pause();
            }
        }
    };

    // Update executedOptions when windows are closed
    useEffect(() => {
        if (!openWindows.includes('wutIsJuice') && !openWindows.includes('video')) {
            setExecutedOptions(prev => {
                const newSet = new Set(prev);
                newSet.delete('Learn More');
                return newSet;
            });
        }
        if (!openWindows.includes('register')) {
            setExecutedOptions(prev => {
                const newSet = new Set(prev);
                newSet.delete('Join Jam');
                return newSet;
            });
        }
    }, [openWindows]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedOption]);

    // Update video window observer
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const videoWindow = document.querySelector('[data-window-id="video"]');
                    if (audioRef.current) {
                        // If video window exists, check if video is playing
                        if (videoWindow) {
                            const video = videoWindow.querySelector('video');
                            if (video && !video.paused) {
                                audioRef.current.volume = 0;
                            }
                        } else {
                            // Only unmute if it wasn't manually muted before
                            if (!isMuted) {
                                audioRef.current.volume = 0.5;
                            }
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [isMuted]); // Add isMuted to dependencies

    return (
        <div 
            onClick={handleWindowClick('welcomeWindow')}
            onMouseDown={handleMouseDown('welcomeWindow')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 400,
                height: isJungle ? 320 : 300,
                backgroundColor: "transparent", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "row",
                padding: 16,
                justifyContent: "space-between",
                alignItems: "center",
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                userSelect: "none",
                cursor: isDragging ? 'grabbing' : 'grab',
                overflow: 'hidden'
            }}>
            {!isVideoOpen && (
                <img 
                    src={isMuted ? "/mute.png" : "/unmute.png"}
                    alt={isMuted ? "Unmute" : "Mute"}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMuteToggle();
                    }}
                    style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 24,
                        height: 24,
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                />
            )}
            <audio ref={audioRef}>
                <source src="./cafe_sounds.mp3" type="audio/mpeg" />
            </audio>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                background: 'transparent'
            }}>
                <Canvas
                    style={{ width: '100%', height: '100%' }}
                    camera={{ 
                        position: [0, 0, 1],
                        near: 0.1,
                        far: 1000,
                        zoom: 1
                    }}
                    gl={{ alpha: true }}
                >
                    <ambientLight intensity={1} />
                    {isJungle ? (<JungleShader/>) : (<JuiceShader/>)}
                </Canvas>
            </div>
            <style>{`
                @keyframes blink {
                    0%, 49% { opacity: 1; }
                    50%, 100% { opacity: 0; }
                }
            `}</style>
            <div style={{ flex: 1, paddingRight: 16 }}>
                <div style={{
                    margin: -16,
                    marginBottom: 8,
                    padding: 16,
                    paddingBottom: 0,
                    pointerEvents: 'none'
                }}>
                  <img src={isJungle ? "/jungle/jungleLogo.svg" : "./logo_transparent.svg"} alt="Logo" width={180} style={{ pointerEvents: 'none' }} />

                </div>
                <p style={{ 
                    pointerEvents: 'none', 
                    margin: '0 0 16px 0',
                    color: '#000',
                    textShadow: isJungle ? `
                        -1px -1px 0 #10c710,
                        1px -1px 0 #10c710,
                        -1px 1px 0 #10c710,
                        1px 1px 0 #10c710,
                        -2px 0 0 #10c710,
                        2px 0 0 #10c710,
                        0 -2px 0 #10c710,
                        0 2px 0 #10c710
                    ` : `
                        -1px -1px 0 #FFE135,
                        1px -1px 0 #FFE135,
                        -1px 1px 0 #FFE135,
                        1px 1px 0 #FFE135,
                        -2px 0 0 #FFE135,
                        2px 0 0 #FFE135,
                        0 -2px 0 #FFE135,
                        0 2px 0 #FFE135`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    lineHeight: 0.75
                }}>
                    <span>{isJungle ? "Start building your game" : "build a game in 2 months"}</span>
                    <span>{isJungle ? "earn fruit in the jungle" : "then run in-person popup"}</span>
                    <span>{isJungle ? "turn that fruit into money" : "game exhibit in China"}</span>
                    <i>{isJungle ? "To get assets and licenses" : "(Flight Stipends Available)"}</i>
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: "monospace", fontSize: "28px", marginTop: 'auto' }}>
                    {options.map((option, index) => (
                        <div
                            key={option}
                            onClick={() => handleOptionClick(index)}
                            onMouseEnter={() => setSelectedOption(index)}
                            style={{
                                cursor: 'pointer',
                                fontSize: 24,
                                color: selectedOption === index ? isJungle ? '#10c710' : '#FFE135' : '#000',
                                textShadow: selectedOption === index ? `
                                    -1px -1px 0 #000,
                                    1px -1px 0 #000,
                                    -1px 1px 0 #000,
                                    1px 1px 0 #000,
                                    -2px 0 0 #000,
                                    2px 0 0 #000,
                                    0 -2px 0 #000,
                                    0 2px 0 #000` : isJungle ? `
                                        -1px -1px 0 #10c710,
                                        1px -1px 0 #10c710,
                                        -1px 1px 0 #10c710,
                                        1px 1px 0 #10c710,
                                        -2px 0 0 #10c710,
                                        2px 0 0 #10c710,
                                        0 -2px 0 #10c710,
                                        0 2px 0 #10c710
                                    ` : `
                                    -1px -1px 0 #FFE135,
                                    1px -1px 0 #FFE135,
                                    -1px 1px 0 #FFE135,
                                    1px 1px 0 #FFE135,
                                    -2px 0 0 #FFE135,
                                    2px 0 0 #FFE135,
                                    0 -2px 0 #FFE135,
                                    0 2px 0 #FFE135`,
                                transition: 'all 0.2s',
                                fontWeight: 'bold',
                                letterSpacing: '0.2px',
                                minWidth: '200px'
                            }}
                        >
                            <span style={{
                                animation: selectedOption === index && !executedOptions.has(option) ? 'blink 1s step-end infinite' : 'none',
                                opacity: selectedOption === index && !executedOptions.has(option) ? 1 : 0
                            }}>{'>'}</span> {option}
                        </div>
                    ))}
                </div>
            </div>
            <img 
                src={isJungle ? "/jungle/jungleicon.png" : "/juiceboxbuilding.png"}
                alt={isJungle ? "Jungle Tree" : "Juicebox Building"} 
                style={logoStyle} 
                draggable="false"
            />
        </div>
    );
} 