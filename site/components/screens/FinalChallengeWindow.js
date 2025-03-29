import React, { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js with no SSR
const ThreeScene = dynamic(() => import('./ThreeScene'), {
    ssr: false
});

export default function FinalChallengeWindow({ position, isDragging, isActive, handleMouseDown, handleDismiss, handleWindowClick, BASE_Z_INDEX, ACTIVE_Z_INDEX, userData, setUserData }) {
    const [submitStatus, setSubmitStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        // Three.js setup
        if (!canvasRef.current || currentPage !== 0 || !isActive) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#F4E753');
        const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
        
        // Add audio listener to the camera
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const renderer = new THREE.WebGLRenderer({ 
            canvas: canvasRef.current,
            antialias: false,
            alpha: true 
        });

        renderer.setSize(300, 424);
        camera.position.z = 5;

        // Create magazine geometry (A4 proportions with more thickness)
        const geometry = new THREE.BoxGeometry(2.8, 4, 0.4);
        
        // Load textures with pixelated settings
        const textureLoader = new THREE.TextureLoader();
        const frontTexture = textureLoader.load('/MagazineFront.png');
        const backTexture = textureLoader.load('/MagazineBack.png');
        const kudosTexture = textureLoader.load('/kudos.png');
        
        // Configure textures for pixelated rendering
        [frontTexture, backTexture, kudosTexture].forEach(texture => {
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            texture.generateMipmaps = false;
        });

        // Rainbow colors for trails
        const rainbowColors = [
            0xFF0000, // Red
            0xFF8800, // Orange
            0xFFFF00, // Yellow
            0x00FF00, // Green
            0x0088FF, // Blue
            0x8800FF, // Purple
            0xFF00FF  // Pink
        ];

        // Create materials with spine color
        const spineColor = new THREE.Color('#e0e0e0');
        const materials = [
            new THREE.MeshBasicMaterial({ color: spineColor }), // right
            new THREE.MeshBasicMaterial({ color: spineColor }), // left
            new THREE.MeshBasicMaterial({ color: spineColor }), // top
            new THREE.MeshBasicMaterial({ color: spineColor }), // bottom
            new THREE.MeshBasicMaterial({ map: frontTexture }), // front
            new THREE.MeshBasicMaterial({ map: backTexture }), // back
        ];

        const magazine = new THREE.Mesh(geometry, materials);
        scene.add(magazine);

        // Create kudos stars with trails
        const kudosStars = [];
        const trailsGroup = new THREE.Group();
        scene.add(trailsGroup);

        class KudosStar {
            constructor() {
                // Create main kudos (half size)
                const kudosGeometry = new THREE.PlaneGeometry(0.15, 0.15);
                this.mesh = new THREE.Mesh(
                    kudosGeometry,
                    new THREE.MeshBasicMaterial({
                        map: kudosTexture,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    })
                );

                // Add positional audio to the star
                this.sound = new THREE.PositionalAudio(listener);
                const audioLoader = new THREE.AudioLoader();
                audioLoader.load('/starSound.mp3', (buffer) => {
                    this.sound.setBuffer(buffer);
                    this.sound.setRefDistance(2); // Distance at which the volume is full
                    this.sound.setRolloffFactor(4); // How quickly the sound fades with distance
                    this.sound.setDistanceModel('exponential');
                    this.sound.setVolume(1.0); // Lower base volume since we have multiple stars
                    this.sound.setLoop(true);
                    this.sound.play();
                });

                this.mesh.add(this.sound);

                // Initialize trail particles
                this.trails = [];
                this.trailsContainer = new THREE.Group();
                trailsGroup.add(this.trailsContainer);

                // Assign a random color for this star's trails
                this.trailColor = Math.random() < 0.3 ? 0xFFFFFF : rainbowColors[Math.floor(Math.random() * rainbowColors.length)];

                // Orbital parameters
                this.orbitRadius = 2 + Math.random() * 1;
                this.orbitSpeed = 0.006 + Math.random() * 0.003;
                this.orbitOffset = Math.random() * Math.PI * 2;
                this.verticalOffset = (Math.random() - 0.5) * 4;
                this.phase = Math.random() * Math.PI * 2;

                // Position the star
                this.updatePosition(0);
                scene.add(this.mesh);
            }

            updatePosition(time) {
                const prevPosition = this.mesh.position.clone();
                
                // Calculate orbital position
                const angle = time * this.orbitSpeed + this.orbitOffset;
                this.mesh.position.x = Math.cos(angle) * this.orbitRadius;
                this.mesh.position.z = Math.sin(angle) * this.orbitRadius;
                this.mesh.position.y = this.verticalOffset + Math.sin(time * 0.01 + this.phase) * 0.5;

                // Create trail more frequently for faster movement
                if (Math.random() < 0.2) {
                    this.createTrailParticle();
                }

                // Rotate the kudos (much slower rotation)
                this.mesh.rotation.z += 0.02;
            }

            createTrailParticle() {
                const trailGeometry = new THREE.PlaneGeometry(0.02, 0.02);
                const trailMaterial = new THREE.MeshBasicMaterial({
                    color: this.trailColor,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide
                });

                const trail = new THREE.Mesh(trailGeometry, trailMaterial);
                trail.position.copy(this.mesh.position);
                trail.scale.set(1, 1, 1);
                this.trailsContainer.add(trail);
                this.trails.push({
                    mesh: trail,
                    birthTime: Date.now()
                });

                // Limit the number of trails per star to prevent memory issues
                if (this.trails.length > 50) {
                    const oldestTrail = this.trails.shift();
                    this.trailsContainer.remove(oldestTrail.mesh);
                    oldestTrail.mesh.geometry.dispose();
                    oldestTrail.mesh.material.dispose();
                }
            }

            dispose() {
                if (this.sound) {
                    this.sound.stop();
                    this.mesh.remove(this.sound);
                }
                scene.remove(this.mesh);
                this.trails.forEach(trail => {
                    this.trailsContainer.remove(trail.mesh);
                    trail.mesh.geometry.dispose();
                    trail.mesh.material.dispose();
                });
                trailsGroup.remove(this.trailsContainer);
                this.mesh.geometry.dispose();
                this.mesh.material.dispose();
            }
        }

        // Create kudos stars
        const numStars = 12;
        for (let i = 0; i < numStars; i++) {
            kudosStars.push(new KudosStar());
        }

        // Animation
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 1;

            // Rotate magazine
            magazine.rotation.y += 0.01;

            // Update each kudos star
            kudosStars.forEach(kudos => kudos.updatePosition(time));

            renderer.render(scene, camera);
        };

        animate();

        // Make canvas overflow visible
        if (canvasRef.current?.parentElement) {
            canvasRef.current.parentElement.style.overflow = 'visible';
        }

        sceneRef.current = { scene, camera, renderer, magazine };

        return () => {
            // Stop all sounds first
            kudosStars.forEach(kudos => {
                if (kudos.sound) {
                    kudos.sound.stop();
                    kudos.sound.disconnect();
                }
                kudos.dispose();
            });
            scene.remove(magazine);
            geometry.dispose();
            materials.forEach(material => material.dispose());
            camera.remove(listener);
            listener.context.close(); // Close the audio context
            renderer.dispose();
        };
    }, [currentPage, isActive]);

    // Extract GitHub username from URL if possible
    const extractGithubUsername = useCallback((url) => {
        try {
            if (!url) return '';
            const match = url.match(/github\.com\/([^\/]+)/);
            return match ? match[1] : '';
        } catch (e) {
            return '';
        }
    }, []);

    const [formData, setFormData] = useState(() => ({
        codeUrl: userData?.GitHubLink || '',
        playableUrl: '',
        videoURL: '',
        screenshot: null,
        firstName: '',
        lastName: '',
        description: '',
        githubUsername: extractGithubUsername(userData?.GitHubLink) || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateProvince: '',
        country: '',
        zipPostalCode: '',
        birthday: '',
        "How did you hear about this?": '',
        "What are we doing well?": '',
        "How can we improve?": ''
    }));

    const handleInputChange = useCallback((e) => {
        const { name, value, files } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: files ? files[0] : value
            };
            
            if (name === 'codeUrl') {
                const username = extractGithubUsername(value);
                if (username) {
                    newData.githubUsername = username;
                }
            }
            
            return newData;
        });
    }, [extractGithubUsername]);

    const handleTestSubmission = useCallback(async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsSubmitting(true);
        setSubmitStatus('Submitting...');
        
        try {
            // Handle screenshot upload if exists
            let screenshotUrl = '';
            if (formData.screenshot) {
                const formDataFile = new FormData();
                formDataFile.append('file', formData.screenshot);
                
                const uploadResponse = await fetch('/api/upload-s3', {  // Changed to use S3 upload endpoint
                    method: 'POST',
                    body: formDataFile,
                });
                
                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload screenshot');
                }
                
                const uploadData = await uploadResponse.json();
                screenshotUrl = uploadData.url;  // This will be an S3 URL
            }

            const submissionData = {
                codeUrl: formData.codeUrl,
                playableUrl: formData.playableUrl,
                videoURL: formData.videoURL,
                description: formData.description,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: userData?.email || 'test@test.com',
                githubUsername: formData.githubUsername,
                birthday: formData.birthday,
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                stateProvince: formData.stateProvince,
                country: formData.country,
                zipPostalCode: formData.zipPostalCode,
                screenshot: screenshotUrl,  // Now this will be an S3 URL
                "How did you hear about this?": formData["How did you hear about this?"],
                "What are we doing well?": formData["What are we doing well?"],
                "How can we improve?": formData["How can we improve?"]
            };

            const response = await fetch('/api/submit-final-ship', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                if (data.missingFields) {
                    let errorMessage = 'Missing required fields:\n\n';
                    Object.entries(data.missingFields).forEach(([page, fields]) => {
                        errorMessage += `Page ${page}:\n`;
                        fields.forEach(field => {
                            errorMessage += `• ${field}\n`;
                        });
                        errorMessage += '\n';
                    });
                    setSubmitStatus(errorMessage);
                } else {
                    const errorMessage = data.error?.message || data.message || data.error || 'Submission failed';
                    setSubmitStatus(`Error: ${errorMessage}`);
                }
                return;
            }
            
            setSubmitStatus('Test submission successful! 🎉');
            setIsSubmitted(true);
        } catch (err) {
            console.error('Error:', err.message);
            setSubmitStatus(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, userData?.email]);

    const handleFormClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    const InputField = useCallback(({ label, name, value, onChange, type = "text", readOnly = false, isTextArea = false, placeholder = "" }) => (
        <div style={{ width: '100%', marginBottom: '10px' }} onClick={e => e.stopPropagation()}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>{label}</label>
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: readOnly ? '#f0f0f0' : 'white',
                        minHeight: '200px',
                        fontSize: '14px',
                        resize: 'vertical',
                        lineHeight: '1.5'
                    }}
                />
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: readOnly ? '#f0f0f0' : 'white',
                        height: '36px',
                        fontSize: '14px'
                    }}
                />
            )}
        </div>
    ), []);

    const renderPage = () => {
        if (isSubmitted) {
            return (
                <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '24px',
                    backgroundColor: '#000',
                    margin: '-16px',
                    padding: '32px 16px',
                    height: '100%',
                    color: '#fff',
                    textAlign: 'center'
                }}>
                    <h2 style={{ 
                        fontSize: '24px', 
                        marginBottom: '16px',
                        lineHeight: 1.4
                    }}>
                        Congratulations soldier! I know that wasn't easy. You have reached the final level and for a moment you should enjoy being on the top of the world.
                    </h2>
                    <div style={{ 
                        width: '100%', 
                        maxWidth: '600px',
                        position: 'relative',
                        aspectRatio: '16/9',
                        overflow: 'hidden',
                        borderRadius: '8px'
                    }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        >
                            <source src="./top_of_the_world.mp4" type="video/mp4" />
                        </video>
                    </div>
                    <audio
                        autoPlay
                        loop
                        style={{ display: 'none' }}
                    >
                        <source src="./topworld.mp3" type="audio/mp3" />
                    </audio>
                </div>
            );
        }
        switch (currentPage) {
            case 0:
                return (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '20px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '24px',
                        backgroundColor: '#F4E753',
                        margin: '-16px',
                        height: '100%',
                        width: 'calc(100% + 32px)'
                    }}>
                        <h1 style={{ fontSize: '32px', marginTop: -16, marginBottom: -48, zIndex: 5 }}>Juice Magazine</h1>
                        <div style={{ width: 300, height: 395 }}>
                            {isActive && <ThreeScene />}
                        </div>
                        <p style={{ fontSize: '16px', lineHeight: '1.5', maxWidth: '500px', margin: 0 }}>
                            We're making a 150 page magazine! You can get a free copy by shipping your game to add it to the magazine <i>(100h not required)</i>! SHIP BY SUNDAY 
                        </p>
                    </div>
                );
            case 1:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', backgroundColor: '#fff' }}>
                        <h2>Game Submission Information</h2>
                        <p>To submit your game, you should share these 5 things (links will be put in the magazine as QR codes)</p>
                        <ul>
                            <li>Live Code URL - this is a link to your project's github that is up to date and public! All Juice games are open source and made with {"<3"}</li>

                            <li>Playable URL - this is a link that any person should be able to go to in order to play your game (e.g. itch or your own website). You should support all platforms (windows, linux, and mac) or have it playable from the web directly at the link. If you need help getting a mac build, please ask in <a href="https://hackclub.slack.com/archives/C08L6JD1D33">#juice-my-mac-game</a> for some help, link your project on github, and share what game engine you're using. I ask that you make sure the mac app is code signed so users can open it without getting security warnings.</li>

                            <li>Gameplay URL - This is a YouTube video that can be public or unlisted that will show gameplay of what it's like to play your game.</li>
                            
                            <li>Screenshot - this is an image that we will include the book showing your game! Please make it in a horizontal aspect ratio (16:9)</li>
                        
                            <li>Story - this is the written text that will go alongside your game (I'd suggest to make the first line as the title of your game)</li>
                        </ul>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <InputField 
                                label="Code URL" 
                                name="codeUrl" 
                                value={formData.codeUrl}
                                onChange={handleInputChange}
                                placeholder="https://github.com/yourusername/your-game (must be public)"
                            />
                            <InputField 
                                label="Playable URL" 
                                name="playableUrl" 
                                value={formData.playableUrl}
                                onChange={handleInputChange}
                                placeholder="Link to play your game (e.g., itch.io or web URL)"
                            />
                            <InputField 
                                label="Gameplay Video URL" 
                                name="videoURL" 
                                value={formData.videoURL}
                                onChange={handleInputChange}
                                placeholder="YouTube video link (can be unlisted)"
                            />
                            <div style={{ height: '100%' }}>
                                <InputField 
                                    label="Screenshot Image" 
                                    name="screenshot" 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    placeholder="Horizontal (16:9) screenshot of your game"
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                            <InputField 
                                label="Story of your game and the story of making it (goes in the magazine) (feel free to write in your own voice and first person)" 
                                name="description" 
                                value={formData.description}
                                onChange={handleInputChange}
                                isTextArea={true}
                                placeholder="Start with your game's title on the first line, then tell us about your game and the journey of making it..."
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fff' }}>
                        <h2>Your Information</h2>
                        <InputField 
                            label="GitHub Username" 
                            name="githubUsername" 
                            value={formData.githubUsername}
                            onChange={handleInputChange}
                            placeholder="Your GitHub username (without @)"
                        />
                        <InputField 
                            label="Email" 
                            name="email" 
                            value={userData?.email || 'test@test.com'}
                            readOnly
                        />
                        <InputField 
                            label="First Name" 
                            name="firstName" 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Your first name"
                        />
                        <InputField 
                            label="Last Name" 
                            name="lastName" 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Your last name"
                        />
                        <InputField 
                            label="Birthday" 
                            name="birthday" 
                            value={formData.birthday}
                            onChange={handleInputChange}
                            type="date"
                            placeholder="YYYY-MM-DD"
                        />
                    </div>
                );
            case 3:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fff' }}>
                        <h2>Shipping Address</h2>
                        <InputField 
                            label="Address Line 1" 
                            name="addressLine1" 
                            value={formData.addressLine1}
                            onChange={handleInputChange}
                            placeholder="Street address, P.O. box, company name"
                        />
                        <InputField 
                            label="Address Line 2" 
                            name="addressLine2" 
                            value={formData.addressLine2}
                            onChange={handleInputChange}
                            placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
                        />
                        <InputField 
                            label="City" 
                            name="city" 
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="City name"
                        />
                        <InputField 
                            label="State/Province" 
                            name="stateProvince" 
                            value={formData.stateProvince}
                            onChange={handleInputChange}
                            placeholder="State, province, region"
                        />
                        <InputField 
                            label="Country" 
                            name="country" 
                            value={formData.country}
                            onChange={handleInputChange}
                            placeholder="Country name"
                        />
                        <InputField 
                            label="ZIP/Postal Code" 
                            name="zipPostalCode" 
                            value={formData.zipPostalCode}
                            onChange={handleInputChange}
                            placeholder="ZIP or postal code"
                        />
                    </div>
                );
            case 4:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#fff' }}>
                        <h2>Feedback</h2>
                            <InputField 
                                label="How did you hear about this?" 
                                name="How did you hear about this?" 
                                value={formData["How did you hear about this?"]}
                                onChange={handleInputChange}
                                isTextArea={true}
                                placeholder="Tell us your story of discovering Juice..."
                            />
                            <InputField 
                                label="What are we doing well?" 
                                name="What are we doing well?" 
                                value={formData["What are we doing well?"]}
                                onChange={handleInputChange}
                                isTextArea={true}
                                placeholder="Share what you love about Juice..."
                            />
                            <InputField 
                                label="How can we improve?" 
                                name="How can we improve?" 
                                value={formData["How can we improve?"]}
                                onChange={handleInputChange}
                                isTextArea={true}
                                placeholder="Help us make Juice even better..."
                            />
                        </div>
                );
            default:
                return null;
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
            {currentPage === 0 && isActive && (
                <audio
                    src="/finalChallenge.mp3"
                    autoPlay
                    loop
                    style={{ display: 'none' }}
                />
            )}
            <div 
                style={{
                    display: "flex", 
                    width: 600,
                    height: 600,
                    color: isSubmitted ? '#fff' : 'black',
                    backgroundColor: "#fff", 
                    border: "1px solid #000", 
                    borderRadius: 4,
                    flexDirection: "column",
                    padding: 0,
                    userSelect: "none",
                    animation: "linear .3s windowShakeAndScale"
                }}>
                <div 
                    onMouseDown={handleMouseDown('finalChallenge')}
                    style={{
                        display: "flex", 
                        borderBottom: "1px solid #000", 
                        padding: 8, 
                        flexDirection: "row", 
                        justifyContent: "space-between", 
                        cursor: isDragging ? 'grabbing' : 'grab',
                        backgroundColor: isSubmitted ? "#000" : (currentPage === 0 ? "#F4E753" : "#fff"),
                        color: isSubmitted ? "#fff" : "black"
                    }}>
                    <div style={{display: "flex", flexDirection: "row", gap: 8}}>
                        <button onClick={(e) => { e.stopPropagation(); handleDismiss('finalChallenge'); }}>x</button>
                    </div>
                    <p>FinalChallenge.txt</p>
                    <div></div>
                </div>
                <div 
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        padding: 16,
                        overflowY: 'auto',
                        flex: 1,
                        backgroundColor: isSubmitted ? "#000" : (currentPage === 0 ? "#F4E753" : "#fff")
                    }}
                    onClick={handleFormClick}
                >
                    {renderPage()}
                    
                    {!isSubmitted && (
                        <>
                            <div style={{ 
                                display: 'flex',
                                justifyContent: currentPage === 0 ? 'center' : 'space-between',
                                alignItems: 'center',
                                marginTop: 'auto',
                                paddingTop: '20px',
                                backgroundColor: currentPage === 0 ? "#F4E753" : "#fff",
                                padding: '16px',
                                marginLeft: '-16px',
                                marginRight: '-16px',
                                marginBottom: '-16px',
                                borderTop: currentPage === 0 ? "none" : "1px solid #eee"
                            }}>
                                {currentPage !== 0 && (
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            minWidth: '80px'
                                        }}
                                    >
                                        Back
                                    </button>
                                )}
                                
                                {currentPage !== 0 && (
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#6c757d'
                                    }}>
                                        Page {currentPage + 1} of 5
                                    </div>
                                )}

                                {currentPage === 0 ? (
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentPage(1)}
                                        style={{
                                            padding: '16px 40px',
                                            backgroundColor: '#000',
                                            color: '#fff',
                                            border: '2px solid #000',
                                            borderRadius: '0px',
                                            cursor: 'pointer',
                                            fontSize: '18px',
                                            fontWeight: '800',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            marginTop: '-16px',
                                            animation: 'pulseAndFloat 3s infinite',
                                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                            transform: 'translateY(0) scale(1)',
                                            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(244, 231, 83, 0.3)',
                                            WebkitFontSmoothing: 'antialiased',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(244, 231, 83, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(244, 231, 83, 0.3)';
                                        }}
                                        onMouseDown={(e) => {
                                            e.currentTarget.style.transform = 'translateY(2px) scale(0.98)';
                                            e.currentTarget.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(244, 231, 83, 0.5)';
                                        }}
                                        onMouseUp={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2), 0 0 0 6px rgba(244, 231, 83, 0.4)';
                                        }}
                                    >
                                        <style>
                                            {`
                                            @keyframes pulseAndFloat {
                                                0% {
                                                    transform: translateY(0) scale(1);
                                                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(244, 231, 83, 0.3);
                                                }
                                                50% {
                                                    transform: translateY(-6px) scale(1.03);
                                                    box-shadow: 0 15px 24px rgba(0, 0, 0, 0.2), 0 0 0 8px rgba(244, 231, 83, 0.2);
                                                }
                                                100% {
                                                    transform: translateY(0) scale(1);
                                                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(244, 231, 83, 0.3);
                                                }
                                            }
                                            `}
                                        </style>
                                        CLAIM TREASURE MAGAZINE
                                    </button>
                                ) : currentPage < 4 ? (
                                    <button 
                                        type="button"
                                        onClick={() => setCurrentPage(prev => Math.min(4, prev + 1))}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            minWidth: '80px'
                                        }}
                                    >
                                        Next
                                    </button>
                                ) : (
                    <button 
                                        type="button"
                                        onClick={handleTestSubmission}
                        disabled={isSubmitting}
                        style={{
                            padding: '8px 16px',
                                            backgroundColor: isSubmitting ? '#ccc' : '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                            minWidth: '80px'
                        }}
                    >
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                                )}
                            </div>

                    {submitStatus && (
                        <p style={{
                            marginTop: 10,
                                    color: submitStatus.includes('Error') || submitStatus.includes('Missing') ? 'red' : 'green',
                                    whiteSpace: 'pre-line',
                                    fontSize: '14px',
                                    lineHeight: '1.5'
                        }}>
                            {submitStatus}
                        </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 