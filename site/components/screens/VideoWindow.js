import React, { useEffect, useRef, useState } from 'react';

export default function VideoWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolume, setShowVolume] = useState(false);
    const [showSubtitles, setShowSubtitles] = useState(true);
    const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
    const [showPlaybackMenu, setShowPlaybackMenu] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const volumeBarRef = useRef(null);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentCue, setCurrentCue] = useState(null);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleDurationChange = () => setDuration(video.duration);
        const handlePlay = () => {
            setIsPlaying(true);
            const welcomeAudio = document.querySelector('audio[src="./cafe_sounds.mp3"]');
            if (welcomeAudio) {
                welcomeAudio.volume = 0;
            }
        };
        const handlePause = () => {
            setIsPlaying(false);
            const muteButton = document.querySelector('img[alt="Unmute"]');
            const welcomeAudio = document.querySelector('audio[src="./cafe_sounds.mp3"]');
            if (welcomeAudio && !muteButton) {
                welcomeAudio.volume = 0.5;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);

        const handleMouseMove = (e) => {
            if (isDraggingVolume && volumeBarRef.current) {
                const rect = volumeBarRef.current.getBoundingClientRect();
                const y = rect.bottom - e.clientY;
                const percentage = Math.max(0, Math.min(1, y / rect.height));
                setVolume(percentage);
                if (video) {
                    video.volume = percentage;
                }
            }
        };

        const handleMouseUp = () => {
            setIsDraggingVolume(false);
        };

        if (isDraggingVolume) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        const handleKeyPress = (e) => {
            // Only handle keyboard controls if we're focused and not in a button/input
            if (document.activeElement === container && 
                !['BUTTON', 'INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
                
                switch (e.code) {
                    case 'Space':
                        e.preventDefault(); // Prevent page scroll
                        e.stopPropagation(); // Prevent event bubbling
                        if (video.paused) {
                            video.play();
                        } else {
                            video.pause();
                        }
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        e.stopPropagation();
                        handleSkipBackward();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        e.stopPropagation();
                        handleSkipForward();
                        break;
                }
            }
        };

        container.addEventListener('keydown', handleKeyPress);

        // Handle subtitle cues
        const handleCueChange = () => {
            const track = video.textTracks[0];
            if (track && track.activeCues && track.activeCues.length > 0) {
                setCurrentCue(track.activeCues[0].text);
            } else {
                setCurrentCue(null);
            }
        };

        const track = video.textTracks[0];
        if (track) {
            track.mode = showSubtitles ? 'hidden' : 'disabled'; // Use hidden instead of showing
            track.addEventListener('cuechange', handleCueChange);
        }

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (track) {
                track.removeEventListener('cuechange', handleCueChange);
            }
        };
    }, [isDraggingVolume]); // Only depend on isDraggingVolume since it's used in the effect

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        if (videoRef.current) {
            videoRef.current.currentTime = percentage * duration;
        }
    };

    const handleVolumeMouseDown = (e) => {
        e.preventDefault();
        setIsDraggingVolume(true);
        const rect = volumeBarRef.current.getBoundingClientRect();
        const y = rect.bottom - e.clientY;
        const percentage = Math.max(0, Math.min(1, y / rect.height));
        setVolume(percentage);
        if (videoRef.current) {
            videoRef.current.volume = percentage;
        }
    };

    const handleStop = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleSkipBackward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
    };

    const handleSkipForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleSubtitles = () => {
        const track = videoRef.current?.textTracks[0];
        if (track) {
            track.mode = showSubtitles ? 'disabled' : 'showing';
            setShowSubtitles(!showSubtitles);
            setShowSubtitlesMenu(false);
        }
    };

    const handlePlaybackSpeed = (speed) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = speed;
            setPlaybackSpeed(speed);
        }
        setShowPlaybackMenu(false);
    };

    const toggleFullscreen = () => {
        const video = videoRef.current;
        if (!video) return;

        if (!document.fullscreenElement) {
            video.requestFullscreen().then(() => {
                setIsFullscreen(true);
            }).catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen().then(() => {
                setIsFullscreen(false);
            });
        }
    };

    const MenuDropdown = ({ show, onClose, style, children }) => {
        if (!show) return null;
        
        return (
            <div 
                style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #000',
                    boxShadow: 'none',
                    zIndex: 1000,
                    minWidth: '150px',
                    ...style
                }}
                onMouseLeave={onClose}
            >
                {children}
            </div>
        );
    };

    const MenuItem = ({ onClick, children, checked }) => (
        <button
            onClick={onClick}
            style={{
                display: 'block',
                width: '100%',
                padding: '4px 8px',
                textAlign: 'left',
                border: 'none',
                borderBottom: '1px solid #000',
                backgroundColor: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
                fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif",
                color: '#000',
                position: 'relative'
            }}
        >
            <span style={{
                position: 'absolute',
                left: '8px',
                visibility: checked ? 'visible' : 'hidden'
            }}>■</span>
            <span style={{marginLeft: '20px'}}>{children}</span>
        </button>
    );

    return (
        <div style={{
            position: "absolute",
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX,
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
        }}>
            <div
                ref={containerRef}
                onClick={handleWindowClick('video')}
                data-window-id="video"
                tabIndex={0}
                style={{
                    display: "flex",
                    
                    width: 640,
                    height: 460,
                    backgroundColor: "#232325",
                    borderRadius: 4,
                    border: "1px solid #000",
                    flexDirection: "column",
                    padding: 0,
                    justifyContent: "space-between",
                    userSelect: "none",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    outline: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                <style>
                    {`
                        ::cue {
                            opacity: 0 !important;
                            background: transparent !important;
                            color: transparent !important;
                        }
                    `}
                </style>

                {/* Title Bar */}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "1px solid #000",
                    backgroundColor: "#fff",
                    borderRadius: "4px 4px 0 0",
                    overflow: "visible"
                }}>
                    {/* Window Controls */}
                    <div
                        onMouseDown={handleMouseDown('video')}
                        style={{
                            display: "flex",
                            padding: "4px 8px",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: isDragging ? 'grabbing' : 'grab',
                            borderBottom: "1px solid #000"
                        }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDismiss('video'); }}
                            style={{
                                padding: 0,
                                width: 20,
                                height: 20,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff',
                                border: '1px solid #000',
                                borderRadius: 0
                            }}>x</button>
                        <p style={{ margin: 0, fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif", fontSize: "14px" }}>video.mp4</p>
                        <div style={{width: 20}}></div>
                    </div>

                    {/* Menu Bar */}
                    <div style={{
                        display: "flex",
                        padding: 0,
                        borderBottom: "1px solid #000",
                        position: "relative",
                    }}>
                        <button
                            onClick={() => {
                                setShowPlaybackMenu(!showPlaybackMenu);
                                setShowSubtitlesMenu(false);
                            }}
                            style={{
                                fontSize: "12px",
                                fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif",
                                cursor: "pointer",
                                background: "#fff",
                                border: "none",
                                borderRight: "1px solid #000",
                                padding: "4px 12px",
                                color: "#000",
                                margin: 0,
                                position: "relative",
                                hidden: "false"
                            }}>
                            Playback
                            {showPlaybackMenu && (
                                <MenuDropdown
                                    show={showPlaybackMenu}
                                    onClose={() => setShowPlaybackMenu(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        border: '1px solid #000',
                                        borderTop: 'none',
                                        zIndex: 999999999999999999999999
                                    }}
                                >
                                    <MenuItem onClick={() => handlePlaybackSpeed(0.25)} checked={playbackSpeed === 0.25}>
                                        0.25×
                                    </MenuItem>
                                    <MenuItem onClick={() => handlePlaybackSpeed(0.5)} checked={playbackSpeed === 0.5}>
                                        0.5×
                                    </MenuItem>
                                    <MenuItem onClick={() => handlePlaybackSpeed(1)} checked={playbackSpeed === 1}>
                                        Normal
                                    </MenuItem>
                                    <MenuItem onClick={() => handlePlaybackSpeed(1.5)} checked={playbackSpeed === 1.5}>
                                        1.5×
                                    </MenuItem>
                                    <MenuItem onClick={() => handlePlaybackSpeed(2)} checked={playbackSpeed === 2}>
                                        2×
                                    </MenuItem>
                                </MenuDropdown>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setShowSubtitlesMenu(!showSubtitlesMenu);
                                setShowPlaybackMenu(false);
                            }}
                            style={{
                                fontSize: "12px",
                                fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif",
                                cursor: "pointer",
                                background: "#fff",
                                border: "none",
                                borderRight: "1px solid #000",
                                padding: "4px 12px",
                                color: "#000",
                                margin: 0,
                                position: "relative"
                            }}>
                            Subtitles
                            {showSubtitlesMenu && (
                                <MenuDropdown
                                    show={showSubtitlesMenu}
                                    onClose={() => setShowSubtitlesMenu(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        border: '1px solid #000',
                                        borderTop: 'none',
                                        zIndex: 1001
                                    }}
                                >
                                    <MenuItem onClick={toggleSubtitles} checked={showSubtitles}>
                                        {showSubtitles ? 'Disable Subtitles' : 'Enable Subtitles'}
                                    </MenuItem>
                                </MenuDropdown>
                            )}
                        </button>
                    </div>
                </div>

                {/* Video Container */}
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#000",
                    borderRadius: "0 0 4px 4px",
                    overflow: "visible"
                }}>
                    <div style={{ flex: 1, position: "relative" }}>
                        <video
                            ref={videoRef}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                            }}
                            autoPlay
                            onClick={togglePlay}
                        >
                            <source src="./juice.mp4" type="video/mp4" />
                            <track label="English" kind="subtitles" srclang="en" src="./juice.vtt" default />
                            Your browser does not support the video tag.
                        </video>
                        {showSubtitles && currentCue && (
                            <div style={{
                                position: 'absolute',
                                bottom: '5%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                color: '#FFE600',
                                fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif",
                                fontSize: '18px',
                                textShadow: `-2px -2px 0 #000,
                                    2px -2px 0 #000,
                                    -2px 2px 0 #000,
                                    2px 2px 0 #000,
                                    -2px 0 0 #000,
                                    2px 0 0 #000,
                                    0 -2px 0 #000,
                                    0 2px 0 #000`,
                                textAlign: 'center',
                                maxWidth: '90%',
                                whiteSpace: 'pre-line',
                                fontWeight: 'normal'
                            }}>
                                {currentCue}
                            </div>
                        )}
                    </div>

                    {/* Control Bar */}
                    <div style={{
                        backgroundColor: "#fff",
                        borderTop: "1px solid #000",
                        padding: "4px",
                    }}>
                        {/* Timeline */}
                        <div
                            onClick={handleSeek}
                            style={{
                                height: "8px",
                                backgroundColor: "#fff",
                                marginBottom: "4px",
                                cursor: "pointer",
                                position: "relative",
                                border: "1px solid #000"
                            }}
                        >
                            <div style={{
                                height: "100%",
                                backgroundColor: "#000",
                                width: `${(currentTime / duration) * 100}%`,
                            }} />
                        </div>

                        {/* Controls */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                            padding: "0 4px"
                        }}>
                            <button
                                onClick={handleSkipBackward}
                                style={{
                                    background: "none",
                                    border: "1px solid #000",
                                    color: "#000",
                                    cursor: "pointer",
                                    padding: "2px",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif"
                                }}
                            >
                                ←10
                            </button>

                            <button
                                onClick={togglePlay}
                                style={{
                                    background: "none",
                                    border: "1px solid #000",
                                    color: "#000",
                                    cursor: "pointer",
                                    padding: "2px",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "16px",
                                    fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif"
                                }}
                            >
                                {isPlaying ? '⏸' : '▶'}
                            </button>

                            <button
                                onClick={handleSkipForward}
                                style={{
                                    background: "none",
                                    border: "1px solid #000",
                                    color: "#000",
                                    cursor: "pointer",
                                    padding: "2px",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif"
                                }}
                            >
                                10→
                            </button>

                            <div style={{
                                color: "#000",
                                fontSize: "12px",
                                fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif",
                                marginLeft: "8px"
                            }}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>

                            <div style={{ flex: 1 }} />

                            <div style={{ position: "relative" }}>
                                <button
                                    onMouseEnter={() => !isDraggingVolume && setShowVolume(true)}
                                    style={{
                                        background: "none",
                                        border: "1px solid #000",
                                        color: "#000",
                                        cursor: "pointer",
                                        padding: "2px",
                                        width: "24px",
                                        height: "24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "12px",
                                        fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif"
                                    }}
                                >
                                    {volume === 0 ? '×♪' : volume < 0.5 ? '♪' : '♪♪'}
                                </button>

                                {(showVolume || isDraggingVolume) && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            marginBottom: "8px",
                                            backgroundColor: "#fff",
                                            border: "1px solid #000",
                                            padding: "4px",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                        onMouseLeave={() => !isDraggingVolume && setShowVolume(false)}
                                    >
                                        <div
                                            ref={volumeBarRef}
                                            onMouseDown={handleVolumeMouseDown}
                                            style={{
                                                width: "24px",
                                                height: "80px",
                                                backgroundColor: "#fff",
                                                border: "1px solid #000",
                                                cursor: "pointer",
                                                position: "relative"
                                            }}
                                        >
                                            <div style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: `${volume * 100}%`,
                                                backgroundColor: "#000"
                                            }} />
                                            <div style={{
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                padding: "4px 0",
                                                pointerEvents: "none"
                                            }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} style={{
                                                        width: "100%",
                                                        borderTop: "1px solid #000",
                                                        opacity: 0.2
                                                    }} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={toggleFullscreen}
                                style={{
                                    background: "none",
                                    border: "1px solid #000",
                                    color: "#000",
                                    cursor: "pointer",
                                    padding: "2px",
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    fontFamily: "'Jersey 25', Arial, Helvetica, sans-serif"
                                }}
                            >
                                {isFullscreen ? '↙' : '↗'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
