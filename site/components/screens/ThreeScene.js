import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeScene() {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);

    useEffect(() => {
        // Three.js setup
        if (!canvasRef.current) return;

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
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            style={{
                width: '100%', 
                height: '100%', 
                imageRendering: 'pixelated',
                transform: 'scale(1.0)',
                transformOrigin: 'center center'
            }} 
        />
    );
} 