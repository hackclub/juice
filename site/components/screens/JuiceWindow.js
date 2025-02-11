import React, { useState, useEffect, useRef } from 'react';

export default function JuiceWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData, startJuicing, playCollectSound, isJuicing }) {
    const [isJuicingLocal, setIsJuicingLocal] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [currentStretchId, setCurrentStretchId] = useState(null);
    const [timeJuiced, setTimeJuiced] = useState('0:00');
    const [startTime, setStartTime] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stopTime, setStopTime] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [totalPauseTimeSeconds, setTotalPauseTimeSeconds] = useState(0)
    const [isWhisperEnabled, setIsWhisperEnabled] = useState(true);
    const fileInputRef = useRef(null);
    const clickSoundRef = useRef(null);
    const expSoundRef = useRef(null);
    const congratsSoundRef = useRef(null);
    const whisperAudioRefs = useRef([]);


    // temporary whisper audio files
    const whisperAudioFiles = [
        './whisper1.mp3',
        './whisper2.mp3',
        './whisper3.mp3',
        './whisper4.mp3',
        './whisper5.mp3',
        './whisper6.mp3',
        './whisper7.mp3',
        './whisper8.mp3',
        './whisper11.mp3',
        './whisper12.mp3',
        './whisper13.mp3',
        './whisper14.mp3',
        './whisper15.mp3'
    ];
    const [juicerImage, setJuicerImage] = useState('/juicerRest.png');

    // Add play click function
    const playClick = () => {
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(e => console.error('Error playing click:', e));
        }
    };

    const playExp = () => {
        if (expSoundRef.current) {
            expSoundRef.current.volume = 0.5;
            expSoundRef.current.currentTime = 0;
            expSoundRef.current.play().catch(e => console.error('Error playing exp:', e));
        }
    };

    const playCongratsSound = () => {
        if (congratsSoundRef.current) {
            congratsSoundRef.current.currentTime = 0;
            congratsSoundRef.current.play().catch(e => console.error('Error playing congrats sound:', e));
        }
    };

    const toggleWhisper = () => {
        setIsWhisperEnabled(!isWhisperEnabled);
    };

    useEffect(() => {
        whisperAudioRefs.current = whisperAudioFiles.map((file) => {
            const audio = new Audio(file);
            audio.volume = 0.5;
            return audio;
        });
    }, []);

    const playRandomWhisper = () => {
        const randomIndex = Math.floor(Math.random() * whisperAudioRefs.current.length);
        const selectedAudio = whisperAudioRefs.current[randomIndex];
        selectedAudio.currentTime = 0;
        selectedAudio.play().catch(e => console.error('Error playing whisper audio (whisper to yourself for now :P) :', e));
    };

    useEffect(() => {
        let interval;
        let saveInterval;
        let whisperInterval;
        if (isJuicingLocal && startTime && !stopTime && !isPaused) {
            interval = setInterval(() => {
                const now = new Date();
                const diff = Math.floor((now - startTime) / 1000 - totalPauseTimeSeconds);
                const minutes = Math.floor(diff / 60);
                const seconds = diff % 60;
                setTimeJuiced(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            }, 1000);
            // Update pausedTimeStart without actually pausing so if the broswer closes unexpectedly you can resume your progress
        if (isJuicingLocal && startTime && !stopTime && !isPaused){
            saveInterval = setInterval(async () => {
                try {
                    const response = await fetch('/api/pause-juice-stretch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: userData.token,
                            stretchId: currentStretchId
                        }),
                    });
        
                    if (!response.ok) {
                        throw new Error('Failed to pause juice stretch');
                    }
                } catch (error) {
                    console.error('Error pausing juice stretch:', error);
                }
            }, 10000);
            if (isWhisperEnabled) {
                whisperInterval = setInterval(() => {
                    playRandomWhisper();
                }, 15 * 60 * 1000);
            }
        }
        }
        return () => {
            clearInterval(interval)
            clearInterval(saveInterval)
            clearInterval(whisperInterval)
        };
    }, [isJuicingLocal, startTime, stopTime, isPaused, isWhisperEnabled]);

    // Load data
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/load-juice-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: userData.token
                    }),
                })
                if (!response.ok) {
                    throw new Error('Failed to pause juice stretch');
                }

                const data = await response.json()
                if(data.id == undefined) return;
                setIsJuicingLocal(true);
                setCurrentStretchId(data.id);
                const startTimeDate = new Date(data.startTime)
                setStartTime(startTimeDate);
                setIsPaused(true);
                setTotalPauseTimeSeconds(data.totalPauseTimeSeconds);
                const now = new Date();
                const diff = Math.floor((now - startTimeDate) / 1000 - data.totalPauseTimeSeconds);
                const minutes = Math.floor(diff / 60);
                const seconds = diff % 60;
                setTimeJuiced(`${minutes}:${seconds.toString().padStart(2, '0')}`);
                
            } catch (error) {
                console.error('Error pausing juice stretch:', error);
            }
        }
        loadData()
    }, [])

    const handleStartJuicing = async () => {
        if (!confirm("Just to confirm, you have your game editor ready and you're ready to start working on your game?")) {
            return;
        }

        try {
            const response = await fetch('/api/start-juice-stretch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start juice stretch');
            }

            const data = await response.json();
            setCurrentStretchId(data.stretchId);
            setIsJuicingLocal(true);
            setStartTime(new Date());
            setStopTime(null);
            setSelectedVideo(null);
            setDescription('');
            playCongratsSound();
            setIsPaused(false);
            setTotalPauseTimeSeconds(0);
            setJuicerImage('/juicerAnimation.gif');

        } catch (error) {
            console.error('Error starting juice stretch:', error);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                alert('Please select a video file');
                return;
            }
            
            // // Check file size (4MB = 4 * 1024 * 1024 bytes)
            // if (file.size > 4 * 1024 * 1024) {
            //     alert("I'm sorry, we have a 4mb limit on file uploads rn. I am fixing this! ~Thomas");
            //     return;
            // }
            
            setSelectedVideo(file);
            setStopTime(new Date());
        }
    };

    const handleEndStretch = async () => {
        if (!selectedVideo || !description.trim()) {
            alert('Please upload a video and add a description');
            return;
        }

        setIsSubmitting(true);
        try {
            // Upload video and create OMG moment through Express server
            const formData = new FormData();
            formData.append('video', selectedVideo);
            formData.append('description', description);
            formData.append('token', userData.token);
            formData.append('stretchId', currentStretchId);
            formData.append('stopTime', stopTime.toISOString());
            formData.append("isJuice", true);

            const uploadResponse = await fetch('https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com/api/video/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload video');
            }

            try {
                const response = await fetch('/api/resume-juice-stretch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: userData.token,
                        stretchId: currentStretchId
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to resume juice stretch');
                }
                const data = await response.json();
                setTotalPauseTimeSeconds(data.newPauseTime)
                setIsPaused(false);
            } catch (error) {
                console.error('Error resuming juice stretch:', error);
            }

            // Fetch updated user data to get new total time
            const userResponse = await fetch('https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com/api/user', {
                headers: {
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            
            if (userResponse.ok) {
                const { userData: updatedUserData } = await userResponse.json();
                setUserData(updatedUserData);
            }

            // Play collect sound when successful
            playCollectSound();

            setIsJuicingLocal(false);
            setCurrentStretchId(null);
            setStartTime(null);
            setStopTime(null);
            setSelectedVideo(null);
            setDescription('');
            setTimeJuiced('0:00');
            setIsPaused(false);
            setJuicerImage('/juicerRest.png');
        } catch (error) {
            console.error('Error creating OMG moment:', error);
            alert('Failed to create OMG moment. Please try again with a smaller file or refresh  the page');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelStretch = async () => {
        if (!confirm("Are you sure you want to cancel this juice stretch? Your time won't be logged.")) {
            return;
        }
        try {
            const response = await fetch('/api/cancel-juice-stretch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    stretchId: currentStretchId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to pause juice stretch');
            }

            setIsJuicingLocal(false);
            setCurrentStretchId(null);
            setStartTime(null);
            setStopTime(null);
            setSelectedVideo(null);
            setDescription('');
            setTimeJuiced('0:00');
            setIsPaused(false);
            setJuicerImage('/juicerRest.png');
        } catch (error) {
            console.error('Error pausing juice stretch:', error);
        }
    };

    const handlePauseStretch = async () => {
        if (!confirm("Are you sure you want to pause this juice stretch?")) {
            return;
        }

        try {
            const response = await fetch('/api/pause-juice-stretch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    stretchId: currentStretchId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to pause juice stretch');
            }
            setIsPaused(true);
            setJuicerImage('/juicerRest.png');
        } catch (error) {
            console.error('Error pausing juice stretch:', error);
        }
    };

    const handleResumeStretch = async () => {
        if (!confirm("Are you sure you want to resume this juice stretch?")) {
            return;
        }

        try {
            const response = await fetch('/api/resume-juice-stretch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: userData.token,
                    stretchId: currentStretchId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to resume juice stretch');
            }
            const data = await response.json();
            console.log(data.newPauseTime)
            setTotalPauseTimeSeconds(data.newPauseTime)
            setIsPaused(false);
            setJuicerImage('/juicerAnimation.gif');
            playCongratsSound();
        } catch (error) {
            console.error('Error resuming juice stretch:', error);
        }
    };

    return (
        <div onClick={handleWindowClick('juiceWindow')}
            style={{
                position: "absolute", 
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            }}>
            <audio ref={clickSoundRef} src="./click.mp3" />
            <audio ref={expSoundRef} src="./expSound.mp3" volume="0.5" />
            <audio ref={congratsSoundRef} src="./juicercongrats.mp3" />
            <div style={{
                display: "flex", 
                width: 400,
                height: "fit-content",
                color: 'black',
                backgroundColor: "#fff", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "column",
                padding: 0,
                justifyContent: "space-between",
                userSelect: "none",
                animation: "linear .3s windowShakeAndScale"
            }}>
                <div 
                    onMouseDown={handleMouseDown('juiceWindow')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #000", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { 
                            e.stopPropagation(); 
                            playClick();
                            handleDismiss('juiceWindow'); 
                        }}>x</button>
                    </div>
                    <p>Juicer (v0.3)</p>
                    <div></div>
                </div>
                <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8}}>
                    {!showExplanation ? (
                        <>
                            <h1 style={{fontSize: 32, lineHeight: 1}}>Juicer (v0.3)</h1>
                            {isJuicing &&
                            <p>Log your time working on a feature then share "OMG IT WORKS" moment when you make it work</p>
                            }
                            <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                                <p>Current Session: {timeJuiced}</p>
                                <p>Total Time Juiced: {userData?.totalJuiceHours ? 
                                    `${Math.floor(userData.totalJuiceHours)} hours ${Math.round((userData.totalJuiceHours % 1) * 60)} min` : 
                                    "0 hours 0 min"}</p>
                            </div>
                            
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                margin: "10px 0",
                            }}>
                                <img 
                                    src={juicerImage}
                                    alt="Juicer"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        imageRendering: "pixelated",
                                        objectFit: "contain"
                                    }}
                                />
                            </div>

                            {!isJuicingLocal &&
                            <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                <button onClick={() => {
                                    playClick();
                                    handleStartJuicing();
                                }}>
                                    Start Juicing
                                </button>
                                <button onClick={() => {
                                    playClick();
                                    setShowExplanation(true);
                                }}>
                                    What is this?
                                </button>
                            </div>}
                            {isJuicingLocal &&
                            <div style={{padding: 8, display: 'flex', gap: 4, flexDirection: "column", border: "1px solid #000"}}>
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                />
                                <p 
                                    onClick={handleUploadClick}
                                    style={{
                                        cursor: 'pointer', 
                                        textAlign: "center", 
                                        width: "100%", 
                                        padding: 4, 
                                        border: "1px solid #000", 
                                        textDecoration: 'underline'
                                    }}
                                >
                                    {selectedVideo ? selectedVideo.name : 'Upload Video'}
                                </p>
                                <textarea 
                                    style={{width: "100%", padding: 2}} 
                                    placeholder="wut works?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <button 
                                    onClick={() => {
                                        playClick();
                                        handleEndStretch();
                                    }}
                                    disabled={isSubmitting}
                                    style={{width: "100%"}}
                                >
                                    {isSubmitting ? 'Juicing...' : 'End Stretch with your "OMG IT WORKS" moment'}
                                </button>
                                <div style={{width: "100%", display: "flex"}}>
                                    {isPaused ? (
                                        <button 
                                        onClick={() => {
                                            playClick();
                                            handleResumeStretch();
                                        }}
                                        style={{width: "100%", borderRight: "none"}}
                                    >
                                        Resume Juice Stretch
                                    </button>
                                    ) : (
                                         <button 
                                         onClick={() => {
                                             playClick();
                                             handlePauseStretch();
                                         }}
                                         style={{width: "100%", borderRight: "none"}}
                                     >
                                         Pause Juice Stretch
                                     </button>
                                    )}
                                   
                                    <button 
                                        onClick={() => {
                                            playClick();
                                            handleCancelStretch();
                                        }}
                                        style={{width: "100%", backgroundColor: "#ffebee", color: "#d32f2f"}}
                                    >
                                        Cancel Juice Stretch
                                    </button>
                                </div>
                                <button 
                                    onClick={() => {
                                        playClick();
                                        toggleWhisper();
                                    }}
                                    style={{width: "100%", marginTop: 8}}
                                >
                                    {isWhisperEnabled ? 'Disable Whisper Audio' : 'Enable Whisper Audio'}
                                </button>
                            </div>
                            }
                        </>
                    ) : (
                        <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                            <p>Juicer is a way to gamify your process making mini-ships for your game & to log the time you spend making them. When you start working on your game, open the Juicer and "Start Juicing". Once you have an "OMG IT WORKS MOMENT" capture that beautiful moment & share it with the Juice community. We'll come and give kudos to congratulate you & you'll get credit for that time :) <br/><br/>The Juicer is how you will log your time to hit the 100 hour game achievement.</p>
                            <button onClick={() => {
                                playClick();
                                setShowExplanation(false);
                            }}>
                                Return to Juicer
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}