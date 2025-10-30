import React, { useState, useEffect, useRef } from 'react';

export default function GalleryWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX }) {
    const [moments, setMoments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState(['Web', 'Linux', 'Mac', 'Windows']);
    const containerRef = useRef(null);

    useEffect(() => {
        const cachedMoments = sessionStorage.getItem('cachedGallery');

        if (1==2) {
            const uniqueMoments = filterDuplicates(JSON.parse(cachedMoments));
            setMoments(uniqueMoments);
            setLoading(false);
        } else {
            const fetchMoments = async () => {
                try {
                    const response = await fetch('/api/get-gallery');
                    if (!response.ok) {
                        throw new Error('Failed to fetch gallery');
                    }
                    const data = await response.json();
                    
                    const uniqueMoments = filterDuplicates(data);
                    sessionStorage.setItem('cachedGallery', JSON.stringify(uniqueMoments));
                    setMoments(uniqueMoments);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchMoments();
        }
    }, []);

    const filterDuplicates = (moments) => {
        const uniqueUrls = new Set();
        const uniqueNames = new Set();
        const uniqueMoments = moments.filter(moment => {
            // Skip if we've seen this URL or game name before
            if (uniqueUrls.has(moment?.itchurl) || uniqueNames.has(moment?.gamename)) {
                return false;
            }
            uniqueUrls.add(moment?.itchurl);
            uniqueNames.add(moment?.gamename);
            return true;
        });

        // Sort moments: ones with valid thumbnails first
        return uniqueMoments.sort((a, b) => {
            // Check if thumbnail exists and is not empty/null
            const hasValidThumbnailA = a.thumbnail && a.thumbnail.trim().length > 0;
            const hasValidThumbnailB = b.thumbnail && b.thumbnail.trim().length > 0;
            
            // If a has valid thumbnail and b doesn't, a comes first
            if (hasValidThumbnailA && !hasValidThumbnailB) return -1;
            // If b has valid thumbnail and a doesn't, b comes first
            if (!hasValidThumbnailA && hasValidThumbnailB) return 1;
            // If both have or don't have valid thumbnails, keep original order
            return 0;
        });
    };

    const filteredMoments = moments.filter(moment => {
        const matchesSearch = 
            moment?.gamename?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            moment?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
        
        const matchesPlatform = selectedPlatforms.some(platform => 
            moment?.platforms?.includes(platform)
        );

        return matchesSearch && (selectedPlatforms.length === 0 || matchesPlatform);
    });

    const handlePlatformToggle = (platform) => {
        setSelectedPlatforms(prev => {
            if (prev.includes(platform)) {
                return prev.filter(p => p !== platform);
            } else {
                return [...prev, platform];
            }
        });
    };

    return (
        <div style={{
            position: "absolute", 
            transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
            top: "50%",
            left: "50%",
            zIndex: isActive ? ACTIVE_Z_INDEX : BASE_Z_INDEX, 
        }}>
            <div 
                onClick={handleWindowClick('Gallery')}
                style={{
                    display: "flex", 
                    width: 650,
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
                    onMouseDown={handleMouseDown('Gallery')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #000", 
                        padding: 8, 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}>
                    <button onClick={(e) => { e.stopPropagation(); handleDismiss('Gallery'); }}>x</button>
                    <p>Gallery</p>
                    <div></div>
                </div>

                <div 
                    ref={containerRef}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        padding: 16,
                        height: "calc(100% - 37px)", 
                        overflow: "auto",
                    }}>
                    <h2 style={{ margin: 0 }}>Games made by fellow hackclubbers:</h2>
                    
                    <div style={{
                        display: 'flex',
                        gap: 16,
                        alignItems: 'center'
                    }}>
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                width: '200px'
                            }}
                        />
                        
                        <div style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center'
                        }}>
                            {['Web', 'Linux', 'Mac', 'Windows'].map(platform => (
                                <label
                                    key={platform}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        backgroundColor: selectedPlatforms.includes(platform) ? '#e0e0e0' : 'transparent',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes(platform)}
                                        onChange={() => handlePlatformToggle(platform)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    {platform}
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    {loading && <p>Loading moments...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    
                    {!loading && !error && (
                        moments.length === 0 ? (
                            <p>No games shared yet! Be the first, I dare u ;)</p>
                        ) : (
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: 16,
                                width: "100%"
                            }}>
                                {filteredMoments.map(moment => (
                                    <div key={moment?.id} style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                        position: "relative"
                                    }}>
                                        <a href={moment?.itchurl}>
                                            <div style={{
                                                width: "100%", 
                                                height: 100,
                                                borderRadius: 4,
                                                backgroundColor: "#000",
                                                overflow: "hidden"
                                            }}>
                                                {moment?.thumbnail && (
                                                    <img 
                                                        src={moment?.thumbnail}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                        style={{
                                                            width: "100%", 
                                                            height: "100%",
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <div style={{
                                                fontSize: "0.9em",
                                            }}>
                                                <p style={{ 
                                                    margin: "4px 0", 
                                                    fontSize: 14,
                                                    lineHeight: "1.2em"
                                                }}>{moment?.description}</p>
                                                <p style={{ margin: "4px 0", fontSize: "0.8em" }}>
                                                    {moment?.gamename}
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}