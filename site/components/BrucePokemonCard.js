import { Canvas } from '@react-three/fiber'
import { BruceShader } from './shaders/BruceShader'
import { useRef, useState } from 'react'
import Tilt from 'react-parallax-tilt'

export default function BrucePokemonCard() {
  const textStyle = {
    color: '#fff',
    textShadow: `-1px -1px 0 #000,  
                  1px -1px 0 #000,
                  -1px 1px 0 #000,
                  1px 1px 0 #000`
  };

  const containerRef = useRef(null)
  const [isShaderReady, setIsShaderReady] = useState(false)

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
        href="https://maxwell-mph.itch.io/driftmetal"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <div style={{
          aspectRatio: 6/8, 
          padding: 6, 
          height: 200, 
          border: "1px solid #000",
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000',
          borderRadius: 10
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
              transform: 'scale(2.5, 2)',
              transformOrigin: '0 0'
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
              <BruceShader onReady={() => setIsShaderReady(true)} />
            </Canvas>
          </div>

          {/* Card Content */}
          <div style={{position: 'relative', zIndex: 1}}>
            <p style={{fontSize: 10, margin: 0, ...textStyle}}>Hackámon x Drift Metal</p>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
              <p style={{fontSize: 16, margin: 0, ...textStyle}}>Bruce</p>
              <p style={{fontSize: 16, margin: 0, ...textStyle}}>50 HP</p>
            </div>
            <div style={{aspectRatio: 5/3, display: "flex", width: "100%", border: "1px solid #000", borderRadius: 4}}>
              <img src="./Bruce.png" style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </div>
            <div style={{display: "flex", marginTop: 4, flexDirection: "column", gap: 4}}>
              <div>
                <p style={{fontSize: 14, ...textStyle}}>Bruce Noises</p>
                <p style={{fontSize: 10, ...textStyle}}>woof woof!</p>
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