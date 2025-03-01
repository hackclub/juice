import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { AchievementsShader } from '../shaders/AchievementsShader';
import { WaterWavesShader } from '../shaders/WaterWavesShader';

export default function AchievementsWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, selectedRank, setSelectedRank, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData }) {
    const hasPRSubmitted = userData?.achievements?.includes('pr_submitted');
    const audioRef = useRef(null);

    useEffect(() => {
        // If they've unlocked rank 3, default to that
        if (userData?.achievements?.includes('poc_submitted')) {
            setSelectedRank(3);
        }
        // Otherwise if they've submitted PR, default to rank 2
        else if (hasPRSubmitted) {
            setSelectedRank(2);
        } 
        // Otherwise default to rank 1
        else {
            setSelectedRank(1);
        }
    }, [hasPRSubmitted, userData?.achievements, setSelectedRank]);

    // Handle rank switching sound
    const handleRankSwitch = (newRank) => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(console.error);
        }
        setSelectedRank(newRank);
    };

    // Get the correct fruit image based on rank
    const getFruitImage = (rank) => {
        switch(rank) {
            case 1:
                return "/apple.png";
            case 2:
                return "/orange.png";
            case 3:
                return "/lemon.png";
            default:
                return "/apple.png";
        }
    };

    return (
        <div 
            onClick={handleWindowClick('achievements')}
            style={{
                display: "flex", 
                position: "absolute", 
                zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
                width: 520,
                height: 320,
                backgroundColor: "#fff", 
                border: "1px solid #000", 
                borderRadius: 4,
                flexDirection: "column",
                padding: 0,
                color: 'black',
                justifyContent: "space-between",
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                top: "50%",
                left: "50%",
                userSelect: "none",
                overflow: "hidden"
            }}>
            <audio ref={audioRef} src="./achievementSwitch.mp3" />
            <div 
                onMouseDown={handleMouseDown('achievements')}
                style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab', backgroundColor: "#fff", zIndex: 2}}>
                <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('achievements'); }}>x</button>
                </div>
                
                <p>ACHIEVEMENTS</p>
                <div></div> 
            </div>
            <div style={{flex: 1, overflowY: 'auto', display: "flex"}}>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 8, width: "100%", cursor: "default", position: "relative"}}>
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 0
                    }}>
                        <Canvas
                            style={{ width: '100%', height: '100%' }}
                            camera={{ position: [0, 0, 1] }}
                        >
                            {selectedRank === 3 ? (
                                <WaterWavesShader />
                            ) : (
                                <AchievementsShader key={selectedRank} selectedRank={selectedRank} />
                            )}
                        </Canvas>
                    </div>
                    <div style={{position: "relative", zIndex: 1}}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: 160}}>
                            <div style={{position: "relative", width: 160, height: 160}}>
                                <Image
                                    src={selectedRank === 1 ? "/apple.png" : 
                                         selectedRank === 2 ? "/orange.png" : 
                                         selectedRank === 3 ? "/pineapple.png" :
                                         "/apple.png"}
                                    fill
                                    style={{imageRendering: "pixelated", marginTop: 24, objectFit: "contain"}}
                                    alt={`Rank ${selectedRank} fruit`}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{position: "relative", zIndex: 1}}>
                        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", color: "black", textShadow: "0 0 2px white"}}>
                            <p>Challenge Progress</p>
                            <p>{
                                selectedRank === 1 ? 
                                    (hasPRSubmitted ? "1/1" : "0/1") :
                                selectedRank === 2 ? 
                                    `${Math.min(userData?.totalJuiceHours || 0, 15).toFixed(2)}/15` :
                                selectedRank === 3 ? 
                                    `${Math.max(0, (userData?.totalJuiceHours || 0) - 15).toFixed(2)}/30` :
                                    "0/1"
                            }</p>
                        </div>
                        <div style={{width: "100%", backgroundColor: "#000", height: 1, marginTop: 4, marginBottom: 4}}></div>
                        {selectedRank === 1 ? (
                            <p style={{color: "black", textShadow: "0 0 2px white"}}>Add your game idea to the<br/> <a target="_blank" href="https://github.com/hackclub/juice" style={{color: "black", textShadow: "0 0 2px white"}}>Juice repo</a>, here's <a target="_blank" href="https://github.com/hackclub/juice/blob/main/games/README.md" style={{color: "black", textShadow: "0 0 2px white"}}>a guide</a></p>
                        ) : selectedRank === 2 ? (
                            <p style={{color: "black", textShadow: "0 0 2px white"}}>Spend 15+ hours building your proof of concept and then <a target="_blank" href="https://hackclub.slack.com/archives/C0M8PUPU6" style={{color: "black", textShadow: "0 0 2px white"}}>#ship</a> it</p>
                        ) : (
                            <div style={{color: "black", textShadow: "0 0 2px white"}}>
                                <p>1. Create 30min of playable content</p>
                                <p style={{marginTop: "4px"}}>2. Take a vertical slice and increase its fidelity</p>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{borderLeft: "1px solid #000", width: "100%", display: "flex", flexDirection: "column", height: "100%", padding: "2px", gap: "2px", backgroundColor: "#fff"}}>
                    <div 
                        onClick={() => handleRankSwitch(1)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: selectedRank === 1 ? "1px solid #000" : "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            cursor: "pointer"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 1</p>
                        </div>
                        <p>Gather your team and PR the idea for your game</p>
                    </div>
                    <div 
                        onClick={() => hasPRSubmitted && handleRankSwitch(2)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: selectedRank === 2 ? "1px solid #000" : "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: hasPRSubmitted ? 1 : 0.5,
                            cursor: hasPRSubmitted ? "pointer" : "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 2</p>
                            {!hasPRSubmitted && <Image src="/lock.svg" width={16} height={16} alt="locked" />}
                        </div>
                        <p>Make a proof of concept with no art just the core gameplay loop</p>
                    </div>
                    <div 
                        onClick={() => hasPRSubmitted && handleRankSwitch(3)}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: selectedRank === 3 ? "1px solid #000" : "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: hasPRSubmitted ? 1 : 0.5,
                            cursor: hasPRSubmitted ? "pointer" : "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 3</p>
                            {!hasPRSubmitted && <Image src="/lock.svg" width={16} height={16} alt="locked" />}
                        </div>
                        <p>More content + increase fidelity</p>
                    </div>
                    <div 
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: 0.5,
                            cursor: "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 4</p>
                            <Image src="/lock.svg" width={16} height={16} alt="locked" />
                        </div>
                        <p>Build the game</p>
                    </div>
                    <div 
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            padding: "0 12px",
                            border: "none",
                            borderRadius: 2,
                            backgroundColor: "transparent",
                            opacity: 0.5,
                            cursor: "default"
                        }}>
                        <div style={{display: "flex", alignItems: "center", gap: 8}}>
                            <p>Rank 5</p>
                            <Image src="/lock.svg" width={16} height={16} alt="locked" />
                        </div>
                        <p>Ship to Steam Store & make Juice Cafe in Shanghai</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 