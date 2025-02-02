import React from 'react';

export default function ThanksWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    return (
        <div style={{
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
        }}>
            <div 
                onClick={handleWindowClick('thanks')}
                style={{
                    display: "flex", 
                    width: 400,
                    height: 300,
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
                    onMouseDown={handleMouseDown('thanks')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #000", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        userSelect: "none"
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { 
                            e.stopPropagation(); 
                            handleDismiss('thanks'); 
                        }}>x</button>
                    </div>
                    <p>Thanks</p>
                    <div></div>
                </div>
                <div style={{
                    flex: 1, 
                    padding: 16, 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 8,
                    cursor: "text"
                }}>
                    <p style={{fontSize: 24, lineHeight: 1}}>Thanks to:</p>
                    <p>AdventureX - China Distribution Partner</p>
                    <a><img src="./AdventureX.png" style={{width: 150}}/></a>
                </div>
            </div>
        </div>
    );
} 