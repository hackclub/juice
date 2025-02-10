import React, { useRef } from 'react';

export default function WutIsJungleWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const contentRef = useRef(null);

    const handleRegisterClick = (e) => {
        if (e.target.classList.contains('register-link')) {
            e.preventDefault();
            e.stopPropagation();
            const registerButton = document.querySelector('button[data-register-button="true"]');
            if (registerButton) {
                registerButton.click();
            }
        }
    };

    return (
        <div style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <div 
                onClick={handleWindowClick('wutIsJungle')}
                style={{
                    display: "flex", 
                    width: 650,
                    color: 'black',
                    height: 470,
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <div 
                    onMouseDown={handleMouseDown('wutIsJungle')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #00000020", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        backgroundColor: '#f6e7ba',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('wutIsJungle'); }}>x</button>
                    </div>
                    <p>wutIsJungle.txt</p>
                    <div></div>
                </div>
                <div 
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRegisterClick(e);
                        
                        // Handle regular links
                        const clickedElement = e.target;
                        if (clickedElement.tagName === 'A' && !clickedElement.classList.contains('register-link')) {
                            e.preventDefault();
                            window.open(clickedElement.href, '_blank');
                        }
                    }}
                    style={{
                        flex: 1,
                        padding: 16,
                        outline: 'none',
                        overflowY: 'auto',
                        cursor: 'text',
                        userSelect: 'text'
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <p>Hey there! I'm <a href="https://hackclub.slack.com/team/U06GEGEHX16">Cosmin</a></p>
                        <p>Jungle is a Hackclub You Ship We Ship program for game developers, where you get to work on your game and earn assets and licenses throughout your development journey.</p>
                        <p>Some of the prizes include: Steam Developer License, and other publishing licenses, GameMaker Studio commercial license, any asset from Itch.io and the Unity Store, and, for music enthusiasts, FL Studio</p>
                        <p>In order to earn these prizes, open the Jungle app and start foraging! You'll receive a fruit every 5-10 minutes which will automatically be converted to tokens. After you defeat your first boss, you can redeem your tokens up until that point and get assets for your game to make it to the next boss! The bossfights are going to give you requirements for your game and you'll have to publish them in itch.io and github</p>
                        <p>The only requirement for games is that they are made in a Game Engine (Unity, Unreal, Godot, GameMaker - for other engines ask in #jungle channel first) and that they beat the bosses requirements - don't worry though, the Moss Golem is really easy.. But they get MORE and MORE dangerous as you progress</p>
                        <p>So hop into the jungle by registering and start collecting those delicious kiwis and slash those evil monsters!</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 