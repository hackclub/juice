import { Canvas } from '@react-three/fiber'
import { Win7Shader } from './shaders/Win7Shader'
import { useState, useEffect, useRef } from 'react'
import Tilt from 'react-parallax-tilt'

export default function Win7PokemonCard() {
  const [isShaderReady, setIsShaderReady] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    // Give shader time to initialize with correct dimensions
    const timer = setTimeout(() => {
      setIsShaderReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const textStyle = {
    color: '#000000', // Black text
    textShadow: `-1px -1px 0 #fff,  
                  1px -1px 0 #fff,
                  -1px 1px 0 #fff,
                  1px 1px 0 #fff,
                  0px 2px 0 #fff,   /* Additional shadows for stronger outline */
                  2px 0px 0 #fff,
                  0px -2px 0 #fff,
                  -2px 0px 0 #fff`
  };

  return (
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
      <a 
        href="https://ewoudvv.itch.io/3d-worlds-hardest-game"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <div style={{
          aspectRatio: 6/8, 
          padding: 6, 
          height: 200, 
          border: "1px solid #000",
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000',
          borderRadius: 10,
          cursor: 'pointer'
        }}>
          {/* Shader Background */}
          <div 
            ref={containerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              transform: 'scale(2.5, 2)',  // Scale instead of size
              transformOrigin: '0 0'  // Scale from top-left
            }}
          >
            <Canvas
              gl={{ alpha: true }}
              orthographic
              camera={{
                zoom: 4.5,
                position: [0, 0, 50],
                near: 0.1,
                far: 1000
              }}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <Win7Shader onReady={() => setIsShaderReady(true)} />
            </Canvas>
          </div>

          {/* Card Content */}
          <div style={{position: 'relative', zIndex: 1}}>
            <p style={{fontSize: 10, margin: 0, ...textStyle}}>Hackámon x <span style={{fontSize: 8}}>3D World's Hardest Game</span></p>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <p style={{fontSize: 16, margin: 0, ...textStyle}}>Win7</p>
              <p style={{fontSize: 16, margin: 0, ...textStyle}}>50 HP</p>
            </div>
            <div style={{aspectRatio: 5/3, display: "flex", width: "100%", border: "1px solid #000"}}>
              <img src="./Win7.png" style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            <div style={{display: "flex", marginTop: 4, flexDirection: "column", gap: 4}}>
              <div>
                <p style={{fontSize: 14, ...textStyle}}>Win7 Noises</p>
                <p style={{fontSize: 10, ...textStyle}}>beep boop!</p>
              </div>
              <div>
                <p style={{fontSize: 14, ...textStyle}}>Secret Move</p>
                <p style={{fontSize: 10, ...textStyle}}>????</p>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Tilt>
  );
} 