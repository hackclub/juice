import React from 'react';
import { BruceShader } from '../shaders/BruceShader';
import { JuiceShader } from '../shaders/JuiceShader';
import { JungleShader } from '../shaders/JungleShader';
import { OctagramShader } from '../shaders/OctagramShader';
import { WaterWavesShader } from '../shaders/WaterWavesShader';
import { Win7Shader } from '../shaders/Win7Shader';
import { Canvas } from '@react-three/fiber';
import styles from './CardCreatorWindow.module.css';
import Tilt from 'react-parallax-tilt';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';

const cardJiggleKeyframes = `
    @keyframes cardJiggle {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.995); opacity: 0.9; }
        100% { transform: scale(1); opacity: 1; }
    }
`;

export default function CardCreatorWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData }) {
    const [mounted, setMounted] = React.useState(false);
    
    // Move SCALE_FACTOR to component level
    const SCALE_FACTOR = 8;
    
    // Add states for card inputs
    const [gameTitle, setGameTitle] = React.useState('');
    const [characterName, setCharacterName] = React.useState('');
    const [hp, setHp] = React.useState('');
    const [moveName, setMoveName] = React.useState('');
    const [moveDescription, setMoveDescription] = React.useState('');
    const [specialMoveName, setSpecialMoveName] = React.useState('');
    const [specialMoveDescription, setSpecialMoveDescription] = React.useState('');
    const [itchLink, setItchLink] = React.useState('');
    const [selectedShader, setSelectedShader] = React.useState('none');
    const [cardImage, setCardImage] = React.useState(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [jiggle, setJiggle] = React.useState(false);

    // Shader component mapping
    const shaderComponents = {
        none: null,
        bruce: BruceShader,
        juice: JuiceShader,
        jungle: JungleShader,
        octagram: OctagramShader,
        waterWaves: WaterWavesShader,
        win7: Win7Shader
    };

    const ShaderComponent = shaderComponents[selectedShader];

    // Add text color mapping for each shader
    const shaderTextStyles = {
        none: {
            color: '#000',
            textShadow: 'none'
        },
        bruce: {
            color: '#fff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        },
        juice: {
            color: '#fff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        },
        jungle: {
            color: '#fff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        },
        octagram: {
            color: '#fff',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        },
        waterWaves: {
            color: '#000',
            textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
        },
        win7: {
            color: '#000',
            textShadow: '-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff'
        }
    };

    // Replace the existing textStyle with dynamic style based on selected shader
    const textStyle = shaderTextStyles[selectedShader];

    // Replace the existing image upload handler with S3 upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a local preview immediately
        const localPreview = URL.createObjectURL(file);
        setCardImage(localPreview);
        
        // Start upload process
        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            // Create form data for the upload
            const formData = new FormData();
            formData.append('file', file);
            
            // Upload directly to your server endpoint that handles S3 upload
            const response = await fetch('/api/upload/s3', {
                method: 'POST',
                body: formData
            });
            
            // Update progress manually since fetch doesn't support progress tracking
            setUploadProgress(50);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Upload error details:', errorData);
                throw new Error(`Failed to upload image: ${errorData.details || 'Unknown error'}`);
            }
            
            const data = await response.json();
            
            // Update the card image with the S3 URL
            setCardImage(data.imageUrl);
            setIsUploading(false);
            setUploadProgress(100);
            
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(`Failed to upload image: ${error.message}`);
            setIsUploading(false);
            // Keep the local preview for UX
        }
    };

    // Add this function to handle the jiggle animation
    const triggerJiggle = () => {
        setJiggle(true);
        setTimeout(() => setJiggle(false), 200); // Reset after animation
    };

    // Add useEffect to watch for state changes
    React.useEffect(() => {
        triggerJiggle();
    }, [gameTitle, characterName, hp, moveName, moveDescription, specialMoveName, specialMoveDescription, selectedShader, cardImage]);

    React.useEffect(() => {
        setTimeout(() => {
            setMounted(true);
        }, 50);
    }, []);

    // Add this function to handle card download
    const handleCardDownload = async () => {
        // Create a temporary div for rendering the download version
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        // Render a clean version of the card without tilt or shaders
        const cleanCard = (
            <div style={{
                aspectRatio: 6/8,
                padding: 12 * SCALE_FACTOR,
                height: 200 * SCALE_FACTOR,
                border: `${1 * SCALE_FACTOR}px solid #000`,
                position: 'relative',
                backgroundColor: shaderButtonStyles[selectedShader]?.backgroundColor || '#fff',
                borderRadius: 10 * SCALE_FACTOR,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <p style={{
                    fontSize: 10 * SCALE_FACTOR,
                    margin: 0,
                    color: shaderButtonStyles[selectedShader]?.color || '#000',
                    textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                        `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                         ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                         -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                         ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                        'none'
                }}>Hackámon x {gameTitle || 'Game Title'}</p>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <p style={{
                        fontSize: 16 * SCALE_FACTOR,
                        margin: 0,
                        color: shaderButtonStyles[selectedShader]?.color || '#000',
                        textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                            `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                             ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                             -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                             ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                            'none'
                    }}>{characterName || 'Character Name'}</p>
                    <p style={{
                        fontSize: 16 * SCALE_FACTOR,
                        margin: 0,
                        color: shaderButtonStyles[selectedShader]?.color || '#000',
                        textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                            `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                             ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                             -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                             ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                            'none'
                    }}>{hp || 'HP'}</p>
                </div>
                <div style={{
                    aspectRatio: 5/3,
                    width: "100%",
                    border: `${1 * SCALE_FACTOR}px solid #000`,
                    borderRadius: 4 * SCALE_FACTOR,
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    marginTop: 4 * SCALE_FACTOR
                }}>
                    {cardImage && (
                        <img 
                            src={cardImage} 
                            alt="Card" 
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    )}
                </div>
                <div style={{
                    display: "flex", 
                    marginTop: 4 * SCALE_FACTOR, 
                    flexDirection: "column", 
                    gap: 4 * SCALE_FACTOR
                }}>
                    <div>
                        <p style={{
                            fontSize: 14 * SCALE_FACTOR,
                            margin: 0,
                            color: shaderButtonStyles[selectedShader]?.color || '#000',
                            textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                                `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                                'none'
                        }}>{moveName || 'Move Name'}</p>
                        <p style={{
                            fontSize: 10 * SCALE_FACTOR,
                            margin: 0,
                            color: shaderButtonStyles[selectedShader]?.color || '#000',
                            textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                                `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                                'none'
                        }}>{moveDescription || 'Move Description'}</p>
                    </div>
                    <div>
                        <p style={{
                            fontSize: 14 * SCALE_FACTOR,
                            margin: 0,
                            color: shaderButtonStyles[selectedShader]?.color || '#000',
                            textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                                `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                                'none'
                        }}>{specialMoveName || 'Special Move'}</p>
                        <p style={{
                            fontSize: 10 * SCALE_FACTOR,
                            margin: 0,
                            color: shaderButtonStyles[selectedShader]?.color || '#000',
                            textShadow: shaderButtonStyles[selectedShader]?.color === '#fff' ? 
                                `-${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px -${SCALE_FACTOR}px 0 #000, 
                                 -${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000, 
                                 ${SCALE_FACTOR}px ${SCALE_FACTOR}px 0 #000` : 
                                'none'
                        }}>{specialMoveDescription || 'Special Move Description'}</p>
                    </div>
                </div>
            </div>
        );

        // Render the clean card to the temp div
        const root = ReactDOM.createRoot(tempDiv);
        root.render(cleanCard);

        // Wait a moment for the render to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const canvas = await html2canvas(tempDiv.firstChild, {
                scale: 2,
                backgroundColor: null,
                logging: false,
                useCORS: true,
                allowTaint: true,
                quality: 2
            });

            const link = document.createElement('a');
            link.download = `${characterName || 'card'}-hackamon.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Error generating card image:', err);
        } finally {
            // Clean up
            root.unmount();
            document.body.removeChild(tempDiv);
        }
    };

    // Add this mapping object near the top with other style mappings
    const shaderButtonStyles = {
        none: {
            backgroundColor: '#000',
            color: '#fff'
        },
        bruce: {
            backgroundColor: '#4169E1', // Royal blue for Bruce
            color: '#fff'
        },
        juice: {
            backgroundColor: '#FF4500', // Orange-red for Juice
            color: '#fff'
        },
        jungle: {
            backgroundColor: '#228B22', // Forest green for Jungle
            color: '#fff'
        },
        octagram: {
            backgroundColor: '#FFD700', // Gold for Octagram
            color: '#000'
        },
        waterWaves: {
            backgroundColor: '#00CED1', // Turquoise for Water
            color: '#fff'
        },
        win7: {
            backgroundColor: '#4682B4', // Steel blue for Win7
            color: '#fff'
        }
    };

    // Add audio ref
    const collectSoundRef = React.useRef(null);

    // Update handleAddToDeck to play sound on success
    const handleAddToDeck = async () => {
        if (!userData?.token) {
            alert('Please log in to add cards to your deck');
            return;
        }

        if (isUploading) {
            alert('Please wait for the image to finish uploading');
            return;
        }

        try {
            const response = await fetch('/api/deck/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                body: JSON.stringify({
                    gameTitle,
                    characterName,
                    HP: hp,
                    moveName,
                    moveDescription,
                    specialMoveName,
                    specialMoveDescription,
                    itchLink,
                    shader: selectedShader,
                    image: cardImage
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add card to deck');
            }

            // Play collect sound
            if (collectSoundRef.current) {
                collectSoundRef.current.play();
            }

            // Show success feedback
            alert('Card added to deck!');
            
            // Clear form
            setGameTitle('');
            setCharacterName('');
            setHp('');
            setMoveName('');
            setMoveDescription('');
            setSpecialMoveName('');
            setSpecialMoveDescription('');
            setItchLink('');
            setSelectedShader('none');
            setCardImage(null);
            setUploadProgress(0);

        } catch (error) {
            console.error('Error adding card to deck:', error);
            alert('Failed to add card to deck. Please try again.');
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
            {/* Add audio element */}
            <audio ref={collectSoundRef} src="./collect.mp3" />
            
            <style>{cardJiggleKeyframes}</style>
            <div 
                onClick={handleWindowClick('cardCreator')}
                style={{
                    display: "flex", 
                    width: 500,
                    height: 350,
                    color: 'black',
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <div 
                    onMouseDown={handleMouseDown('cardCreator')}
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
                            handleDismiss('cardCreator'); 
                        }}>x</button>
                    </div>
                    <p>Card Creator</p>
                    <div></div>
                </div>
                <div style={{
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column"
                }}>
                    {/* Two Column Layout */}
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        padding: "0px 8px 0 8px"
                    }}>
                        {/* Left Column - Card Preview */}
                        <div style={{
                            width: "40%",
                            minWidth: "180px",
                            paddingRight: 0,
                            paddingLeft: 0,
                            marginLeft: -8,
                            borderRight: "1px solid #000",
                            display: "flex",
                            backgroundColor: "#eee",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {/* Wrap the card in Tilt component */}
                            <Tilt
                                tiltMaxAngleX={15}
                                tiltMaxAngleY={20}
                                perspective={1000}
                                scale={1.0}
                                transitionSpeed={1000}
                                gyroscope={false}
                                glareEnable={true}
                                glareMaxOpacity={0.5}
                                glareColor="#ffffff"
                                glarePosition="all"
                            >
                                <div 
                                    id="downloadable-card"
                                    onClick={handleCardDownload}
                                    style={{
                                        aspectRatio: 6/8,
                                        padding: 6,
                                        height: 200,
                                        border: "1px solid #000",
                                        position: 'relative',
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        overflow: 'hidden',
                                        animation: jiggle ? 'cardJiggle 0.2s ease-in-out' : 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {/* Shader Background Layer */}
                                    {selectedShader !== 'none' && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            zIndex: 0,
                                            transform: ['juice', 'jungle', 'waterWaves'].includes(selectedShader) ? 'scale(2.5)' : 'none'
                                        }}>
                                            <Canvas 
                                                style={{
                                                    width: '100%',
                                                    height: '100%'
                                                }}
                                                camera={{ 
                                                    position: ['juice', 'jungle', 'waterWaves'].includes(selectedShader) ? [0, 0, 2] : [0, 0, 5],
                                                    fov: ['juice', 'jungle', 'waterWaves'].includes(selectedShader) ? 75 : 45
                                                }}
                                            >
                                                <ShaderComponent timeScale={2.5} />
                                            </Canvas>
                                        </div>
                                    )}
                                    
                                    {/* Card Content Layer */}
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%'
                                    }}>
                                        <p style={{fontSize: 10, margin: 0, ...textStyle}}>Hackámon x {gameTitle || 'Game Title'}</p>
                                        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                                            <p style={{fontSize: 16, margin: 0, ...textStyle}}>{characterName || 'Character Name'}</p>
                                            <p style={{fontSize: 16, margin: 0, ...textStyle}}>{hp || 'HP'}</p>
                                        </div>
                                        <div style={{
                                            aspectRatio: 5/3,
                                            width: "100%",
                                            border: "1px solid #000",
                                            borderRadius: 4,
                                            backgroundColor: '#fff',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            {cardImage ? (
                                                <img 
                                                    src={cardImage} 
                                                    alt="Card" 
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                        <div style={{display: "flex", marginTop: 4, flexDirection: "column", gap: 4}}>
                                            <div>
                                                <p style={{
                                                    fontSize: 14,
                                                    margin: 0,
                                                    ...textStyle
                                                }}>{moveName || 'Move Name'}</p>
                                                <p style={{
                                                    fontSize: 10,
                                                    margin: 0,
                                                    ...textStyle
                                                }}>{moveDescription || 'Move Description'}</p>
                                            </div>
                                            <div>
                                                <p style={{
                                                    fontSize: 14,
                                                    margin: 0,
                                                    ...textStyle
                                                }}>{specialMoveName || 'Special Move'}</p>
                                                <p style={{
                                                    fontSize: 10,
                                                    margin: 0,
                                                    ...textStyle
                                                }}>{specialMoveDescription || 'Special Move Description'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tilt>
                        </div>

                        {/* Right Column - Form Controls */}
                        <div style={{
                            flex: 1,
                            paddingLeft: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                            marginTop: 8,
                            overflowY: "auto"
                        }}>
                            {/* <h1 style={{fontSize: 24, margin: "0 0 8px 0"}}>Card Creator</h1> */}
                            <div style={{display: "flex", flexDirection: "column", gap: 16}}>
                                {/* Game Title Row - Updated to include game link */}
                                <div style={{display: 'flex', gap: 12, alignItems: 'flex-end'}}>
                                    <div>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Game Title</label>
                                        <input 
                                            type="text"
                                            value={gameTitle}
                                            onChange={(e) => setGameTitle(e.target.value)}
                                            maxLength={20}
                                            placeholder="Drift Metal"
                                            style={{
                                                width: "140px",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                    <div style={{flex: 1}}>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Game Itch Link</label>
                                        <input 
                                            type="text"
                                            value={itchLink}
                                            onChange={(e) => setItchLink(e.target.value)}
                                            placeholder="https://maxwell-mph.itch.io/driftmetal"
                                            style={{
                                                width: "100%",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Character Name and HP Row */}
                                <div style={{display: 'flex', gap: 12, alignItems: 'flex-end'}}>
                                    <div>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Character Name</label>
                                        <input 
                                            type="text"
                                            value={characterName}
                                            onChange={(e) => setCharacterName(e.target.value)}
                                            maxLength={20}
                                            placeholder="Bruce"
                                            style={{
                                                width: "140px",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>HP</label>
                                        <input 
                                            type="number"
                                            value={hp}
                                            onChange={(e) => setHp(e.target.value)}
                                            max={999}
                                            placeholder="50"
                                            style={{
                                                width: "60px",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Move Section */}
                                <div style={{display: 'flex', gap: 12, alignItems: 'flex-end'}}>
                                    <div>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Move Name</label>
                                        <input 
                                            type="text"
                                            value={moveName}
                                            onChange={(e) => setMoveName(e.target.value)}
                                            maxLength={30}
                                            placeholder="Bruce Noises"
                                            style={{
                                                width: "120px",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                    <div style={{flex: 1}}>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Move Description</label>
                                        <input 
                                            type="text"
                                            value={moveDescription}
                                            onChange={(e) => setMoveDescription(e.target.value)}
                                            maxLength={50}
                                            placeholder="woof woof!"
                                            style={{
                                                width: "100%",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Special Move Section */}
                                <div style={{display: 'flex', gap: 12, alignItems: 'flex-end'}}>
                                    <div>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Special Move Name</label>
                                        <input 
                                            type="text"
                                            value={specialMoveName}
                                            onChange={(e) => setSpecialMoveName(e.target.value)}
                                            maxLength={30}
                                            placeholder="Secret Move"
                                            style={{
                                                width: "120px",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                    <div style={{flex: 1}}>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Special Move Description</label>
                                        <input 
                                            type="text"
                                            value={specialMoveDescription}
                                            onChange={(e) => setSpecialMoveDescription(e.target.value)}
                                            maxLength={50}
                                            placeholder="????"
                                            style={{
                                                width: "100%",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Shader Dropdown */}
                                <div style={{display: 'flex', gap: 12, alignItems: 'flex-end'}}>
                                    <div style={{flex: 1}}>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>Background Shader</label>
                                        <select
                                            value={selectedShader}
                                            onChange={(e) => setSelectedShader(e.target.value)}
                                            style={{
                                                width: "100%",
                                                fontSize: 12,
                                                padding: '4px 8px'
                                            }}
                                        >
                                            <option value="none">None</option>
                                            <option value="bruce">Bruce Shader</option>
                                            <option value="juice">Juice Shader</option>
                                            <option value="jungle">Jungle Shader</option>
                                            <option value="octagram">Octagram Shader</option>
                                            <option value="waterWaves">Water Waves</option>
                                            <option value="win7">Windows 7</option>
                                        </select>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <label style={{fontSize: 12, display: 'block', marginBottom: 2}}>
                                            Card Image {isUploading ? `(Uploading: ${uploadProgress}%)` : ''}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{
                                                width: "100%",
                                                fontSize: 12
                                            }}
                                            disabled={isUploading}
                                        />
                                        {isUploading && (
                                            <div style={{
                                                width: '100%', 
                                                height: 4, 
                                                backgroundColor: '#eee',
                                                marginTop: 4,
                                                borderRadius: 2,
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${uploadProgress}%`,
                                                    height: '100%',
                                                    backgroundColor: shaderButtonStyles[selectedShader]?.backgroundColor || '#000',
                                                    transition: 'width 0.3s ease'
                                                }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Full Width Button at Bottom */}
                    <div style={{
                        marginTop: 0,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderTop: '1px solid #000',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <button 
                            onClick={handleAddToDeck}
                            disabled={isUploading}
                            style={{
                                padding: '12px 16px',
                                fontSize: 16,
                                fontWeight: 'bold',
                                height: "calc(100% - 16px)",
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                ...shaderButtonStyles[selectedShader],
                                border: "2px solid #000",
                                borderRadius: 4,
                                cursor: isUploading ? 'not-allowed' : 'pointer',
                                opacity: isUploading ? 0.7 : 1,
                                width: '100%'
                            }}
                        >
                            {isUploading ? `Uploading Image (${uploadProgress}%)` : 'Add to Deck'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 