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
uniform float iTime;
uniform vec2 iResolution;

#define PIXEL_SIZE_FAC 400.0
#define SPIN_EASE .1  // Doubled from .05
#define colour_1 vec4(0.0, 0.5, 0.1, 1.0)  // Deep jungle green
#define colour_2 vec4(0.3, 0.6, 0.2, 1.0)  // Lush moss green
#define colour_3 vec4(0.4, 0.3, 0.1, 1.0)  // Earthy jungle brown
#define spin_amount 1.5
#define contrast 0.9

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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Pixelate the coordinates
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(fragCoord.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * iResolution.xy) / length(iResolution.xy);
    
    // Create flowing liquid effect (2x speed)
    float time = iTime * SPIN_EASE * 2.0;  // Doubled the time factor
    vec2 p = uv;
    float nx = noise(p * 3.0 + time);
    float ny = noise(p * 3.0 - time);
    
    // Add some swirl
    float angle = atan(p.y, p.x) + time;
    float rad = length(p);
    
    // Combine noise and swirl
    vec2 distort = vec2(
        nx * cos(angle) - ny * sin(angle),
        nx * sin(angle) + ny * cos(angle)
    ) * rad * spin_amount;
    
    // Add liquid movement (2x speed)
    vec2 flow = vec2(
        noise(p * 4.0 + distort + time),  // Doubled from time * 0.5
        noise(p * 4.0 + distort - time)   // Doubled from time * 0.5
    );
    
    // Create color variations (2x speed)
    float pattern = noise(p * 2.0 + flow + time * 0.4) *  // Doubled from time * 0.2
                   noise(p * 4.0 - flow - time * 0.2) *   // Doubled from time * 0.1
                   noise(p * 8.0 + distort);
    
    // Enhance edges for pixel art feel
    pattern = floor(pattern * 8.0) / 8.0;
    
    // Color blending
    vec4 ret_col = mix(
        colour_1,
        mix(colour_2, colour_3, pattern),
        noise(p * 3.0 + time * 0.1)
    );
    
    // Add highlights
    float highlight = step(0.7, noise(p * 5.0 + flow));
    ret_col += highlight * 0.2;
    
    // Pixelate the final color
    ret_col = floor(ret_col * 8.0) / 8.0;
    
    fragColor = ret_col;
}

varying vec2 vUv;

void main() {
    mainImage(gl_FragColor, vUv * iResolution);
}
`

export function JungleShader() {
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
        }
    }, [size])

    useFrame((state) => {
        const { clock } = state
        if (mesh.current) {
            mesh.current.material.uniforms.iTime.value = clock.getElapsedTime()
        }
    })

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[4, 4]} />
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                depthTest={false}
            />
        </mesh>
    )
}