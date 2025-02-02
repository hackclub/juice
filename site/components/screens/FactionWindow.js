import React from 'react';

const ticketShakeKeyframes = `
    @keyframes ticketShake {
        0% { transform: rotate(0deg) scale(1); }
        15% { transform: rotate(-0.5deg) scale(0.998); }
        30% { transform: rotate(0.8deg) scale(1.001); }
        45% { transform: rotate(-0.7deg) scale(0.999); }
        60% { transform: rotate(0.3deg) scale(1.002); }
        75% { transform: rotate(-0.5deg) scale(0.998); }
        85% { transform: rotate(0.4deg) scale(1.001); }
        100% { transform: rotate(0deg) scale(1); }
    }
`;

const TICKETS = [
    { id: 'orange', image: '/orangeticket.png' },
    { id: 'kiwi', image: '/kiwiticket.png' },
    { id: 'apple', image: '/appleticket.png' }
];

export default function FactionWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData }) {
    const availableTickets = userData?.invitesAvailable?.length || 0;

    React.useEffect(() => {
        if (isActive && availableTickets === 0) {
            handleDismiss('faction');
        }
    }, [availableTickets, isActive]);

    const handleSendInvite = async (ticketId) => {
        const email = window.prompt("Enter friend's email address:");
        if (email) {
            try {
                const response = await fetch('/api/invite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    },
                    body: JSON.stringify({
                        invitedParticipantEmail: email,
                        flavor: ticketId
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to send invite');
                }

                // Update userData locally to remove the used ticket
                setUserData(prev => ({
                    ...prev,
                    invitesAvailable: prev.invitesAvailable.filter(id => id !== ticketId)
                }));
            } catch (error) {
                alert('Failed to send invite. Please try again.');
            }
        }
    };

    return (
        <div style={{
            position: "absolute", 
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
        }}>
            <style>{ticketShakeKeyframes}</style>
            <div 
                onClick={handleWindowClick('faction')}
                style={{
                    display: "flex", 
                    width: 400,
                    height: 300,
                    color: 'black',
                    overflow: "hidden",
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
                    onMouseDown={handleMouseDown('faction')}
                    style={{display: "flex", borderBottom: "1px solid #000", padding: 8, flexDirection: "row", justifyContent: "space-between", cursor: isDragging ? 'grabbing' : 'grab'}}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('faction'); }}>x</button>
                    </div>
                    <p>Special Tickets</p>
                    <div></div>
                </div>
                <div style={{flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12}}>
                    <p>ooo... you have {availableTickets} juice tickets to invite your friends to join you on this adventure</p>
                    <div style={{display: "flex", flexDirection: "row", gap: 16}}>
                        {TICKETS.map((ticket) => {
                            const isUsed = !userData?.invitesAvailable?.includes(ticket.id);
                            return (
                                <div 
                                    key={ticket.id}
                                    style={{
                                        backgroundColor: "#fff",
                                        position: "relative", 
                                        height: 120, 
                                        width: 90, 
                                        display: "flex", 
                                        flexDirection: "column", 
                                        alignItems: "center", 
                                        justifyContent: "flex-start", 
                                        paddingBottom: 8,
                                        opacity: isUsed ? 0.4 : 1,
                                    }}>
                                    <img 
                                        src={ticket.image} 
                                        alt={ticket.id} 
                                        style={{ 
                                            width: '100%', 
                                            height: 'auto', 
                                            imageRendering: 'pixelated',
                                            animation: isUsed ? 'none' : 'ticketShake 1.2s linear infinite',
                                            transformOrigin: '50% 50%'
                                        }} 
                                    />
                                    <div style={{
                                        color: '#000',
                                        fontSize: 20,
                                        textTransform: 'uppercase',
                                        marginTop: 4
                                    }}>
                                        {ticket.id}
                                    </div>
                                    <button 
                                        style={{fontSize: 16}}
                                        onClick={() => !isUsed && handleSendInvite(ticket.id)}
                                    >
                                        {isUsed ? "Ticket Sent" : "Send Invite"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
} 