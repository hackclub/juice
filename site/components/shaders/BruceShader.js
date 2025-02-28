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

#define PIXEL_SIZE_FAC 250.0

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263,0.416,0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Add pixelation
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(fragCoord.xy * (1.0 / pixel_size)) * pixel_size) / iResolution.y;
    vec2 uv0 = uv;
    vec3 finalColor = vec3(0.0);
    
    for (float i = 0.0; i < 4.0; i++) {
        uv = fract(uv * 1.5) - 0.5;

        float d = length(uv) * exp(-length(uv0));

        vec3 col = palette(length(uv0) + i*.4 + iTime*.4);

        d = sin(d*8. + iTime)/8.;
        d = abs(d);

        d = pow(0.01 / d, 1.2);

        finalColor += col * d;
    }
    
    // Pixelate the final color
    finalColor = floor(finalColor * 8.0) / 8.0;
        
    fragColor = vec4(finalColor, 1.0);
}

varying vec2 vUv;

void main() {
    mainImage(gl_FragColor, vUv * iResolution);
}
`

export function BruceShader({ onReady }) {
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