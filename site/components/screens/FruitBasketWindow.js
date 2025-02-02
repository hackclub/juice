import React, { useState, useEffect, useRef } from 'react';

export default function FruitBasketWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData}) {
    const [fruitCollected, setFruitCollected] = useState({
        kiwis: 0,
        lemons: 0,
        oranges: 0,
        apples: 0,
        blueberries: 0,
    })
    const fileInputRef = useRef(null);
    const clickSoundRef = useRef(null);
    const expSoundRef = useRef(null);
    const congratsSoundRef = useRef(null);

    // Add play click function
    const playClick = () => {
        if (clickSoundRef.current) {
            clickSoundRef.current.currentTime = 0;
            clickSoundRef.current.play().catch(e => console.error('Error playing click:', e));
        }
    };

    const handleRedeemTokens = () => {
        alert("This feature will become available in " + Math.floor((new Date("2025-02-04T00:00:00").getTime() - new Date().getTime())/3600000) + " hours " + "and " + Math.round((new Date("2025-02-04T00:00:00").getTime() - new Date().getTime())/60000%60) + " minutes")
    }

    // Load data
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/load-fruit-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: userData.token
                    }),
                })
                if (!response.ok) {
                    throw new Error('Failed to load fruit data');
                }

                const data = await response.json()
                const kiwis = data.kiwisCollected == undefined ? 0 : data.kiwisCollected
                const lemons = data.lemonsCollected == undefined ? 0 : data.lemonsCollected
                const oranges = data.orangesCollected == undefined ? 0 : data.orangesCollected
                const apples = data.applesCollected == undefined ? 0 : data.applesCollected
                const blueberries = data.blueberriesCollected == undefined ? 0 : data.blueberriesCollected

                const fruitCollected = {
                    kiwis,
                    lemons,
                    oranges,
                    apples,
                    blueberries,
                }

                console.log(fruitCollected)

                setFruitCollected(fruitCollected);
                
            } catch (error) {
                console.error('Error Loading fruit data:', error);
            }
        }
        loadData()
    }, [])

    return (
        <div style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <audio ref={clickSoundRef} src="./click.mp3" />
            <audio ref={expSoundRef} src="./expSound.mp3" volume="0.5" />
            <audio ref={congratsSoundRef} src="./juicercongrats.mp3" />
            <div 
                onClick={handleWindowClick('fruitBasketWindow')}
                style={{
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
                    onMouseDown={handleMouseDown('fruitBasketWindow')}
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
                            handleDismiss('fruitBasketWindow'); 
                        }}>x</button>
                    </div>
                    <p>Fruit Basket</p>
                    <div></div>
                </div>
                <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8}}>
                    <>
                        <h1 style={{fontSize: 32, lineHeight: 1}}>Fruit Basket</h1>
                        <p>Here you can see all the fruit you foraged in the Jungle! After defeating your first boss in the jungle you can reedem this and buy assets for your game as well as publish it on other platforms! More details to come.</p>
                        
                        <div style={{display: "flex", flexDirection: "column", gap: 4}}>
                            <p><img style={{height:".8rem", imageRendering: "pixelated"}} src='/jungle/junglekiwi.png'/> Kiwis: {fruitCollected.kiwis}, {" "}
                            <img style={{height:".8rem", imageRendering: "pixelated"}} src='/jungle/junglelemon.png'/> Lemons: {fruitCollected.lemons}, {" "}
                            <img style={{height:".8rem", imageRendering: "pixelated"}} src='/jungle/jungleorange.png'/> Oranges: {fruitCollected.oranges} {" "}<br/>
                            <img style={{height:".8rem", imageRendering: "pixelated"}} src='/jungle/jungleapple.png'/> Apples: {fruitCollected.apples}, {" "}
                            <img style={{height:".8rem", imageRendering: "pixelated"}} src='/jungle/jungleblueberry.png'/> Blueberries: {fruitCollected.blueberries} <br/>
                            <img style={{height:".8rem", imageRendering: "pixelated"}} src='/jungle/token.png'/> Tokens: {userData.totalTokens}</p>
                        </div>

                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <img 
                                src={fruitCollected.apples == 0 && fruitCollected.blueberries == 0 && fruitCollected.kiwis == 0 && fruitCollected.lemons == 0 && fruitCollected.oranges == 0 ? "/jungle/basket.png" : "/jungle/fullbasket.png"}
                                alt="Basket"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    imageRendering: "pixelated",
                                    objectFit: "contain"
                                }}
                            />
                        </div>
                    </>
                    <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                        <button style={{
                            background: "linear-gradient(270deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)",
                            backgroundSize: "1400% 1400%",
                            animation: "rainbow 5s linear infinite",
                            color: "white",
                            padding: "10px 20px",
                        }} onClick={() => {
                            playClick();
                            handleRedeemTokens();
                        }}>
                            Redeem Your tokens!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 