import React, { useState, useEffect, useRef } from 'react';

export default function JungleShopWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setOpenWindows, setWindowOrder, isLoggedIn}) {
    const [fruitCollected, setFruitCollected] = useState({
        kiwis: 0,
        lemons: 0,
        oranges: 0,
        apples: 0,
        blueberries: 0,
    })
    const [hasClickedRedeem, setHasClickedRedeem] = useState(false)
    const [showList, setShowList] = useState(false)
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
    const openJungleApp = () => {
        setTimeout(() => {
            document.getElementById("windowOpenAudio").currentTime = 0;
            document.getElementById("windowOpenAudio").play();
            setOpenWindows(prev => [...prev, 'jungleWindow']);
            setWindowOrder(prev => [...prev.filter(w => w !== 'jungleWindow'), 'jungleWindow']);
        }, 100);
    }
    const redeemTokens = () => {
        setTimeout(() => {
            document.getElementById("windowOpenAudio").currentTime = 0;
            document.getElementById("windowOpenAudio").play();
            setOpenWindows(prev => [...prev, 'fruitBasketApp']);
            setWindowOrder(prev => [...prev.filter(w => w !== 'fruitBasketApp'), 'fruitBasketApp']);
        }, 100);
    }

    const signUp = () => {
        setTimeout(() => {
            document.getElementById("windowOpenAudio").currentTime = 0;
            document.getElementById("windowOpenAudio").play();
            setOpenWindows(prev => [...prev, 'register']);
            setWindowOrder(prev => [...prev.filter(w => w !== 'register'), 'register']);
        }, 100);
    }

    return (
        <div style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <style jsx>{`
    @keyframes redeemAnimation {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); } /* Moves half the width */
    }

    @keyframes shine {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
`}</style>
            <audio ref={clickSoundRef} src="./click.mp3" />
            <audio ref={expSoundRef} src="./expSound.mp3" volume="0.5" />
            <audio ref={congratsSoundRef} src="./juicercongrats.mp3" />
            <div 
                onClick={handleWindowClick('jungleShopWindow')}
                style={{
                    display: "flex", 
                    width: 450,
                    height: "fit-content",
                    color: 'black',
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    justifyContent: "space-between",
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale",
                }}>
                <div 
                    onMouseDown={handleMouseDown('jungleShopWindow')}
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
                            handleDismiss('jungleShopWindow'); 
                        }}>$$$</button>
                    </div>
                    <p style={{color: '#D4AF37'}}>Jungle Shop</p>
                    <div></div>
                </div>
                <div style={{ display: 'flex', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    <h1 style={{
                        fontSize: 32,
                        lineHeight: 1,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        minWidth: "200%",
                        animation: 'redeemAnimation 60s linear infinite, shine 5s infinite',
                        background: "linear-gradient(90deg, #D4AF37, rgb(227, 187, 56), #D4AF37)",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                        }}>
                            SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP SHOP 
                        </h1>
                    </div>
                    <h1 style={{fontSize: "2rem", marginLeft: "1rem"}}>Get all of these by working on your game in the <span style={{fontSize: "2rem", color: "green"}}>Jungle</span> app</h1>
                    { isLoggedIn ? (<>
                        <button style={{margin: ".5rem 1rem", height: "2.4rem", fontSize: "2rem"}} onClick={openJungleApp}>Open Jungle App</button>
                        <button style={{margin: ".5rem 1rem", height: "2.4rem", fontSize: "2rem"}} onClick={redeemTokens}>Redeem Tokens</button>
                        </>
                    ) : (
                        <button style={{margin: ".5rem 1rem", height: "2.4rem", fontSize: "2rem"}} onClick={signUp}>Sign Up</button>
                    )
                    }
                <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 8 , overflow: 'auto', maxHeight: 400}}>
                    
                    <div style={{display: "flex", flexDirection: "column", gap: ".5rem"}}>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "2rem"}}>
                            <video width={200} loop autoPlay muted>
                                <source src="https://cdn.hack.pet/slackcdn/6eec21d14fa375e64bd0b6a375b5893c.mp4" type='video/mp4'/>
                            </video>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <p>
                                    Assets from Unity Store <img src='unity.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                                </p>
                                <a style={{all: "unset"}} href='https://assetstore.unity.com/'><button>Unity Store</button></a>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "2rem"}}>
                            <img src='itch.gif' style={{width: 200}}></img>
                            <div style={{display: "flex", flexDirection: "column"}}>
                            <p style={{color: "#fa6261"}}>
                                Assets from Itch.io <img src='itch.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://itch.io/game-assets'><button>Itch.io</button></a>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", width: "100%" , gap: "2rem"}}>
                            <img src="steamShowcase.png" style={{width: 200}}/>
                            <div style={{display: "flex", flexDirection: "column"}}>
                            <p style={{color:"#66c0f4"}}>
                                Steam License (1060 tokens) <img src='steam.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://partner.steamgames.com/steamdirect'><button>Steam License</button></a>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", width: "100%", gap: "2rem"}}>
                            <img src="playstoreShowcase.png" style={{width: 200}}/>
                            <div style={{display: "flex", flexDirection: "column"}}>
                            <p style={{color: "#3caa59"}}>
                                Google Play License <img src='googlePlay.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://support.google.com/googleplay/android-developer/answer/6112435?hl=en'><button>Google Play</button></a>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", width: "100%", gap: "2rem"}}>
                            <img src="appstoreShowcase.jpg" style={{width: 200}}/>
                            <div style={{display: "flex", flexDirection: "column"}}>
                            <p>
                                Apple Developer Account <img src='appleLogo.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://developer.apple.com/'><button>Apple</button></a>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", width: "100%", gap: "2rem"}}>
                            <img src="epicGamesShowcase.png" style={{width: 200}}/>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <p>
                                Epic Games License <img src='epic.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://onlineservices.epicgames.com/en-US/licensing'><button>Epic Games License</button></a>
                            </div>
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "2rem"}}>
                        <video width={200} loop autoPlay muted>
                                <source src="https://cdn.hack.pet/slackcdn/b92649ecf530d334f968f0e04f85db71.mp4" type='video/mp4'/>
                            </video>
                            <div style={{display: "flex", flexDirection: "column"}}>
                            <p>
                                Game Maker 2 <img src='gamemaker.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://gamemaker.io/en/get'><button>GameMaker</button></a>
                            </div>
                            
                        </div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "2rem"}}>
                        <video width={200} loop autoPlay muted>
                                <source src="https://cdn.hackclubber.dev/slackcdn/7e85fb1ec88924a0aa33a004a19ff982.mp4" type='video/mp4'/>
                            </video>
                            <div style={{display: "flex", flexDirection: "column"}}>

                            <p style={{color: "#ed783d"}}>
                                FL Studio <img src='flStudio.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://www.image-line.com/'><button>FL Studio</button></a>
                            </div>
                            
                        </div>
                        
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", gap: "2rem"}}>
                        <video width={200} autoPlay loop muted>
                            <source src="https://cdn.hackclubber.dev/slackcdn/cbf6b4be43f18302ddb87f8b7c6ec2a0.mp4" type='video/mp4'/>
                        </video>
                        <div style={{display: "flex", flexDirection: "column"}}>

                            <p style={{color: "#685b65"}}>
                                Aseprite <img src='aseprite.png' style={{height: ".8rem", marginBottom: "-.1rem"}}/>
                            </p>
                            <a style={{all: "unset"}} href='https://www.aseprite.org/'><button>Aseprite</button></a>
                            </div>
                            
                        </div>
                        <a style={{all: "unset", width: "100%"}} href="https://hackclub.slack.com/docs/T0266FRGM/F08DU2K47EX"><button style={{width: "100%"}}>Request More Rewards</button></a>

                    </div>
                </div>
            </div>
        </div>
    );
} 