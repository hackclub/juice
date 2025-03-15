import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ItineraryWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const contentRef = useRef(null);
    const [itineraryData, setItineraryData] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        // Load the itinerary data from the JSON file
        fetch('/itinerary.json')
            .then(response => response.json())
            .then(data => {
                setItineraryData(data);
            })
            .catch(error => console.error('Error loading itinerary data:', error));
    }, []);

    // Add ESC key handler for closing the detail view
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                setSelectedActivity(null);
            }
        };

        if (selectedActivity) {
            document.addEventListener('keydown', handleEscKey);
        }

        // Clean up the event listener when component unmounts or selectedActivity changes
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [selectedActivity]);

    // Group activities by day
    const getActivitiesByDay = (dayStr) => {
        const activities = itineraryData.filter(activity => activity.activityDay === dayStr);
        // Sort activities by start time
        return activities.sort((a, b) => {
            const timeA = a.activityStartTime.replace(':', '');
            const timeB = b.activityStartTime.replace(':', '');
            return parseInt(timeA) - parseInt(timeB);
        });
    };

    // Function to get background color based on activity type
    const getActivityBackgroundColor = (activity) => {
        const name = activity.activityName.toLowerCase();
        const desc = activity.activityDescription.toLowerCase();
        
        // Subtle food & breakfast activities (pale yellow-green)
        if (name.includes('fruit run') || name.includes('breakfast') || 
            name.includes('wash fruits') || name.includes('picnic') || 
            name.includes('dinner')) {
            return '#f0f7e6';
        }
        
        // Setup & preparation activities (pale blue)
        if (name.includes('setup') || name.includes('preparation') || 
            name.includes('decoration') || name.includes('wash') || 
            desc.includes('preparation')) {
            return '#e6f2fd';
        }
        
        // Customer & promotion activities (pale orange)
        if (name.includes('customer') || name.includes('promotion') || 
            desc.includes('ticket holders') || desc.includes('promotes')) {
            return '#fff2e6';
        }
        
        // Cleanup & closing activities (pale gray)
        if (name.includes('cleanup') || name.includes('closing') || 
            desc.includes('cleanup') || desc.includes('end of day')) {
            return '#f0f0f0';
        }
        
        // Venue change & moving activities (pale purple)
        if (name.includes('venue') || name.includes('moving') || 
            desc.includes('moving') || desc.includes('change')) {
            return '#f4e6ff';
        }
        
        // Adventurous & tourism activities, including ??? (pale pink-purple)
        if (name.includes('museum') || name.includes('bund') || name.includes('???') ||
            name.includes('exploration') || name.includes('walk') || name.includes('park') ||
            desc.includes('visit') || desc.includes('cultural') || 
            desc.includes('open evening') || desc.includes('suggest activities')) {
            return '#f9e6f0';
        }
        
        // Default color (very pale blue-gray)
        return '#f7f9fa';
    };

    // Define the days in the itinerary with their corresponding dates
    const days = [
        { name: "Friday", date: "April-4-2025" },
        { name: "Saturday", date: "April-5-2025" },
        { name: "Sunday", date: "April-6-2025" },
        { name: "Monday", date: "April-7-2025" },
        { name: "Tuesday", date: "April-8-2025" },
        { name: "Wednesday", date: "April-9-2025" },
        { name: "Thursday", date: "April-10-2025" },
        { name: "Friday", date: "April-11-2025" }
    ];

    // Format time to more readable format
    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}${minutes !== '00' ? ':' + minutes : ''} ${ampm}`;
    };

    // Handle activity click to show detail view
    const handleActivityClick = (activity) => {
        setSelectedActivity(activity);
    };

    // Close the detail view
    const closeDetailView = () => {
        setSelectedActivity(null);
    };

    // Simple markdown formatter (for demo purposes)
    const formatMarkdown = (markdown) => {
        if (!markdown) return '';
        
        let html = markdown
            // Headers
            .replace(/## (.*)\n/g, '<h2>$1</h2>')
            .replace(/### (.*)\n/g, '<h3>$1</h3>')
            .replace(/#### (.*)\n/g, '<h4>$1</h4>')
            
            // Bold and Italic
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            
            // Lists
            .replace(/^\* (.*)/gm, '<li>$1</li>')
            .replace(/<\/li>\n<li>/g, '</li><li>')
            .replace(/<li>(.*)/g, '<ul><li>$1')
            .replace(/<\/li>\n\n/g, '</li></ul>\n\n')
            
            // Links
            .replace(/\[(.*)\]\((.*)\)/g, '<a href="$2" target="_blank">$1</a>')
            
            // Images
            .replace(/!\[(.*)\]\((.*)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;">')
            
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            
            // Line breaks
            .replace(/\n/g, '<br>');
        
        return '<p>' + html + '</p>';
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
                onClick={handleWindowClick('itineraryWindow')}
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
                    animation: "linear .3s windowShakeAndScale",
                    position: "relative"
                }}>
                <div 
                    onMouseDown={handleMouseDown('itineraryWindow')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #00000020", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        backgroundColor: '#e0f0e0',
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('itineraryWindow'); }}>x</button>
                    </div>
                    <p>itinerary.csv</p>
                    <div></div>
                </div>
                <div 
                    ref={contentRef}
                    style={{
                        flex: 1,
                        padding: 0,
                        outline: 'none',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        cursor: 'text',
                        userSelect: 'text',
                        height: 'calc(100% - 60px)',
                        position: 'relative'
                    }}
                >
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        width: '100%',
                        height: '100%'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            overflowX: 'auto',
                            width: '100%',
                            height: '100%'
                        }}>
                            <table style={{ 
                                borderCollapse: 'collapse', 
                                width: '1200px',
                                tableLayout: 'fixed',
                                height: '100%'
                            }}>
                                <thead>
                                    <tr>
                                        {days.map((day, index) => (
                                            <th key={index} style={{ 
                                                padding: '0', 
                                                textAlign: 'left', 
                                                borderRight: index < days.length - 1 ? '0.5px solid #ddd' : 'none',
                                                width: '150px',
                                                borderBottom: '2px solid #333',
                                                fontWeight: 'bold'
                                            }}>
                                                {day.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ height: '100%' }}>
                                        {days.map((day, index) => {
                                            const dayActivities = getActivitiesByDay(day.date);
                                            
                                            return (
                                                <td key={index} style={{ 
                                                    padding: '0', 
                                                    verticalAlign: 'top',
                                                    borderRight: index < days.length - 1 ? '0.5px solid #ddd' : 'none',
                                                    height: '100%'
                                                }}>
                                                    {dayActivities.map((activity, actIndex) => {
                                                        const backgroundColor = getActivityBackgroundColor(activity);
                                                        
                                                        return (
                                                            <div 
                                                                key={actIndex} 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActivityClick(activity);
                                                                }}
                                                                style={{
                                                                    margin: '4px',
                                                                    padding: '6px',
                                                                    backgroundColor: backgroundColor,
                                                                    borderRadius: '2px',
                                                                    border: '1px solid #0000001a',
                                                                    fontSize: '12px',
                                                                    overflow: 'hidden',
                                                                    minHeight: '60px',
                                                                    boxSizing: 'border-box',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s ease',
                                                                    position: 'relative'
                                                                }}
                                                                onMouseOver={(e) => {
                                                                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                                                                    e.currentTarget.style.borderColor = '#0000004d';
                                                                }}
                                                                onMouseOut={(e) => {
                                                                    e.currentTarget.style.boxShadow = 'none';
                                                                    e.currentTarget.style.borderColor = '#0000001a';
                                                                }}
                                                            >
                                                                <div style={{ 
                                                                    fontWeight: 'bold',
                                                                    marginBottom: '2px'
                                                                }}>{activity.activityName}</div>
                                                                <div style={{
                                                                    marginBottom: '2px'
                                                                }}>{formatTime(activity.activityStartTime)} - {formatTime(activity.activityStopTime)}</div>
                                                                <div style={{ 
                                                                    fontSize: '11px', 
                                                                    color: '#555',
                                                                    flex: '1'
                                                                }}>
                                                                    {activity.activityDescription}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    {/* Detail View */}
                    {selectedActivity && (
                        <div 
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: '#fff',
                                zIndex: 1000,
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '10px 12px',
                                overflow: 'auto'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '4px'
                            }}>
                                <h2 style={{ 
                                    margin: 0, 
                                    fontSize: '18px',
                                    fontWeight: 'bold' 
                                }}>{selectedActivity.activityName}</h2>
                                <button 
                                    onClick={() => setSelectedActivity(null)}
                                    style={{
                                        border: '2px solid #333',
                                        background: '#e0f0e0',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                    }}
                                >
                                    Back (esc)
                                </button>
                            </div>
                            
                            <div style={{ 
                                fontSize: '14px',
                                marginBottom: '6px',
                                color: '#555'
                            }}>
                                {formatTime(selectedActivity.activityStartTime)} - {formatTime(selectedActivity.activityStopTime)}
                            </div>
                            
                            <div className="markdown-content" style={{
                                flex: 1,
                                overflow: 'auto',
                                fontSize: '14px',
                                lineHeight: '1.2'
                            }}>
                                {selectedActivity.activityDetailedContent ? (
                                    <div style={{ 
                                            lineHeight: '1.2',
                                            marginTop: '0'
                                        }} 
                                            dangerouslySetInnerHTML={{ 
                                                __html: formatMarkdown(selectedActivity.activityDetailedContent)
                                                    .replace('<h2>' + selectedActivity.activityName + '</h2>', '') // Remove duplicate title
                                                    .replace(/<p>/g, '<p style="margin: 4px 0;">') // Reduce paragraph margins
                                                    .replace(/<ul>/g, '<ul style="margin: 2px 0; padding-left: 16px;">') // Adjust list spacing
                                                    .replace(/<li>/g, '<li style="margin-bottom: 2px;">') // Reduce space between list items
                                                    .replace(/<h3>/g, '<h3 style="margin: 6px 0 2px 0; font-size: 16px;">') // Compact headings
                                                    .replace(/<h4>/g, '<h4 style="margin: 4px 0 2px 0; font-size: 15px;">') // Compact subheadings
                                            }} 
                                        />
                                    ) : (
                                        <p style={{ margin: '4px 0' }}>{selectedActivity.activityDescription}</p>
                                    )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 