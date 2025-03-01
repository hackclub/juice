import React, { useRef } from 'react';

export default function TamagotchiNotesWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const contentRef = useRef(null);

    return (
        <div style={{
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <div 
                onClick={handleWindowClick('tamagotchiNotes')}
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
                    onMouseDown={handleMouseDown}
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
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('tamagotchiNotes'); }}>x</button>
                    </div>
                    <p>wutTheEgg.txt</p>
                    <div></div>
                </div>
                <div 
                    ref={contentRef}
                    contentEditable
                    suppressContentEditableWarning
                    onClick={(e) => e.stopPropagation()}
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
                        <p>Why hello there! Thomas here.</p>
                        <p>You probably noticed the egg in your juice.</p>
                        <p>Over the next 10 days you can turn that egg in your juice into a Tamagotchi in your hands by making a habit of working on your game every day for at least 2 hours.</p>
                        <p>If you miss a day and don't juice/jungle for 2 hours, your Tamagotchi will die and we won't send it to you. Don't worry, you won't be doing this alone, you're alongside all of us juicing and jungling our games together :)</p>
                        <p>This is our opportunity to change who we are. We're no longer just hobbyists tinkering with game dev, we're game developers and our games need us every day otherwise they will die. Embrace becoming a game dev and start the habit of every day putting time toward making your game.</p>
                        <p>I challenge you (& I challenge myself) to have 30min of playable content, mid-to-high level of game fidelity, and support for Mac, Windows, and Linux, or just web. That's my challenge to you, but either way if you show up every day for these 10 days and work on your game, you'll get a Tamagotchi of your choosing shipped to your home.</p>
                        <p>~Thomas<br/><i>in life we are always learning</i></p>
                    </div>
                </div>
            </div>
        </div>
    );
} 