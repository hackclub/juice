import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision mediump float;

uniform float iTime;
uniform vec2 iResolution;

#define PIXEL_SIZE_FAC 100.0
#define PI 3.14159265359

vec3 palette(float t) {
    // Classic Windows pastel colors
    vec3 a = vec3(0.9, 0.9, 0.9);    // White base
    vec3 b = vec3(0.2, 0.2, 0.2);    // Subtle variation
    vec3 c = vec3(1.0, 1.0, 1.0);    // Pure white highlights
    vec3 d = vec3(0.6, 0.8, 1.0);    // Pastel blue/gray phase

    // Mix in some classic Windows pastel tones
    vec3 color = a + b*cos(6.28318*(c*t+d));
    
    // Add pastel tint
    color = mix(color, vec3(0.9, 0.95, 1.0), 0.5);
    return color;
}

float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdCircle(vec2 p, float r) {
    return length(p) - r;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Pixelate the coordinates first
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 pixelCoord = floor(fragCoord / pixel_size) * pixel_size;
    vec2 uv = (pixelCoord * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    
    // Scale UV for larger pattern
    uv *= 2.0;
    
    // Store original UV for vignette
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    // Create symmetrical pattern
    vec2 symmetryUV = abs(uv);
    float angle = atan(symmetryUV.y, symmetryUV.x);
    float radius = length(symmetryUV);
    
    // Rotating elements
    float rotSpeed = iTime * 0.2;
    vec2 rotUV = vec2(
        uv.x * cos(rotSpeed) - uv.y * sin(rotSpeed),
        uv.x * sin(rotSpeed) + uv.y * cos(rotSpeed)
    );
    
    // Create multiple layers of pattern
    for(float i = 0.0; i < 5.0; i++) {
        // Circular pattern
        float circle = sdCircle(rotUV, 0.5 + i * 0.2);
        circle = abs(sin(circle * 8.0 + iTime));
        
        // Box pattern
        float box = sdBox(rotUV, vec2(0.7 + sin(iTime * 0.5 + i) * 0.1));
        box = abs(sin(box * 6.0 - iTime));
        
        // Combine patterns
        float pattern = min(circle, box);
        
        // Add classic Windows pastel colors
        vec3 col = palette(pattern + i * 0.2 + iTime * 0.1);
        
        // Mix with classic Windows colors
        col = mix(col, vec3(
            0.95 + sin(iTime * 0.5) * 0.05,  // Slight white variation
            0.92 + sin(iTime * 0.4) * 0.05,  // Slight cream variation
            0.90 + sin(iTime * 0.3) * 0.05   // Slight gray variation
        ), 0.7);
        
        finalColor += col * (1.0 - pattern) * 0.3;
    }
    
    // Add subtle Windows-like gradients
    float windowsEffect = sin(uv0.x * 8.0 + iTime) * 0.3 + 0.7;
    windowsEffect *= sin(uv0.y * 6.0 - iTime * 0.5) * 0.3 + 0.7;
    finalColor = mix(finalColor, vec3(0.95, 0.95, 1.0), windowsEffect * 0.3);
    
    // Add classic Windows gray accents
    float accent = sin(uv0.x * 15.0 + uv0.y * 15.0 + iTime) * 0.5 + 0.5;
    finalColor = mix(finalColor, vec3(0.85, 0.85, 0.9), accent * 0.1);
    
    // Softer color quantization for pastel look
    finalColor = floor(finalColor * 4.0) / 4.0;
    
    // Ensure predominantly white
    finalColor = mix(finalColor, vec3(1.0), 0.4);
    
    fragColor = vec4(finalColor, 1.0);
}

varying vec2 vUv;

void main() {
    mainImage(gl_FragColor, vUv * iResolution);
}
`

export function Win7Shader({ onReady }) {
    const mesh = useRef()
    const { size } = useThree()
    
    const uniforms = useMemo(
        () => ({
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(size.width, size.height) }
        }),
        [size]
    )

    useEffect(() => {
        if (mesh.current) {
            mesh.current.material.uniforms.iResolution.value.set(size.width, size.height)
            onReady?.();
        }
    }, [size, onReady])

    useFrame((state) => {
        const { clock } = state
        if (mesh.current) {
            mesh.current.material.uniforms.iTime.value = clock.getElapsedTime()
        }
    })

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
            />
        </mesh>
    )
} 