import React, { useRef } from 'react';

export default function WutIsJuiceWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
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
                onClick={handleWindowClick('wutIsJuice')}
                style={{
                    display: "flex", 
                    width: 650,
                    color: 'black',
                    height: 490,
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <div 
                    onMouseDown={handleMouseDown('wutIsJuice')}
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
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('wutIsJuice'); }}>x</button>
                    </div>
                    <p>wutIsJuice.txt</p>
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
                        <p>Hello Hacker, <a href="https://hackclub.slack.com/team/U041FQB8VK2">Thomas</a> here</p>
                        <p>Every year, we organize wild adventures at Hack Club (see <a target="_blank" href="https://youtu.be/ufMUJ9D1fi8?feature=shared">Trail</a>, <a target="_blank" href="https://www.youtube.com/watch?v=KLx4NZZPzMc">Epoch</a>, <a target="_blank" href="https://youtu.be/2BID8_pGuqA?feature=shared">Zephyr</a>, etc).</p>
                        <p>This year we're organizing our wildest adventure yet. We will be working together online for two months, making our own games, shipping our games to the steam store, and then getting together in-person in Shanghai, China to run a popup cafe for people to come and play our games.</p>
                        <p>Every week we will get together on call, gain achievements, and play eachother's games. I'll be making my first real video game alongside all of you for these two months, and we'll learn together in the <a target="_blank" href="https://hackclub.slack.com/archives/C088UF12N1Z">#juice</a>.</p>
                        <p>We have travel stipends available to game devs who:</p>
                        <ul style={{marginLeft: 16}}>
                            <li>spend 100+ hours building their game</li>
                            <li>include no spoken or written words in their game (languageless)</li>
                            <li>ship their game to the Steam Store (30min playable content)</li>
                        </ul>
                        <p>You are invited & all of the tools are in your hands to make this adventure happen, so it's up to you. Do you want to make this adventure happen? If so, <a href="#" class="register-link">let's do this together</a></p>
                        <b style={{
                            animation: 'steamGrantFlash 1s infinite'
                        }}>ALL PARTICIPANTS THAT SHIP & MEET CRITERIA GET FREE STEAM LICENSE GRANT!</b>
                    </div>
                </div>
            </div>
        </div>
    );
} 
