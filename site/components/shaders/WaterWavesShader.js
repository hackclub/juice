import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const WaterWavesMaterial = shaderMaterial(
  {
    time: 0,
    iResolution: new THREE.Vector2(1, 1),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec2 iResolution;
    varying vec2 vUv;

    #define PIXEL_SIZE_FAC 50.0
    #define COLOR_LEVELS 4.0

    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 ip = floor(p);
      vec2 u = fract(p);
      u = u*u*(3.0-2.0*u);
      
      float res = mix(
          mix(rand(ip), rand(ip+vec2(1.0,0.0)), u.x),
          mix(rand(ip+vec2(0.0,1.0)), rand(ip+vec2(1.0,1.0)), u.x), u.y);
      return res*res;
    }
    
    void main() {
      // Pixelate the coordinates
      float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
      vec2 uv = (floor(vUv * iResolution.xy * (1.0 / pixel_size)) * pixel_size) / iResolution.xy;
      
      // Create multiple wave patterns with pixelation
      float wave1 = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
      float wave2 = sin(uv.y * 8.0 - time * 1.2) * 0.5 + 0.5;
      float wave3 = sin((uv.x + uv.y) * 5.0 + time * 0.8) * 0.5 + 0.5;
      
      // Add noise to the waves
      float n = noise(uv * 4.0 + time * 0.2);
      float waves = (wave1 + wave2 + wave3) / 3.0;
      waves = mix(waves, n, 0.2);
      
      // Pixelate the wave pattern
      waves = floor(waves * COLOR_LEVELS) / COLOR_LEVELS;
      
      // Create light green and white pattern
      vec3 lightGreen = vec3(0.85, 0.92, 0.85); // Light green instead of grey
      vec3 white = vec3(1.0); // Pure white
      vec3 color = mix(lightGreen, white, step(0.5, waves));
      
      // Add subtle variation
      float variation = noise(uv * 8.0 - time * 0.1) * 0.1;
      color += variation;
      
      // Final pixelation
      color = floor(color * COLOR_LEVELS) / COLOR_LEVELS;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ WaterWavesMaterial });

export function WaterWavesShader() {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.time = state.clock.elapsedTime;
      ref.current.iResolution.set(state.size.width, state.size.height);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <waterWavesMaterial ref={ref} />
    </mesh>
  );
} 