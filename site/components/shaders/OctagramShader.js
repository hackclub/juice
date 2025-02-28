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
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

#define PIXEL_SIZE_FAC 250.0  // Changed from 400.0 to 100.0 for more pixelation

float gTime = 0.;
const float REPEAT = 5.0;

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float box(vec3 pos, float scale) {
    pos *= scale;
    float base = sdBox(pos, vec3(.4,.4,.1)) /1.5;
    pos.xy *= 5.;
    pos.y -= 3.5;
    pos.xy *= rot(.75);
    float result = -base;
    return result;
}

float box_set(vec3 pos, float iTime) {
    vec3 pos_origin = pos;
    pos = pos_origin;
    pos.y += sin(gTime * 0.4) * 2.5;
    pos.xy *= rot(.8);
    float box1 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
    pos = pos_origin;
    pos.y -= sin(gTime * 0.4) * 2.5;
    pos.xy *= rot(.8);
    float box2 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);
    pos = pos_origin;
    pos.x += sin(gTime * 0.4) * 2.5;
    pos.xy *= rot(.8);
    float box3 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);    
    pos = pos_origin;
    pos.x -= sin(gTime * 0.4) * 2.5;
    pos.xy *= rot(.8);
    float box4 = box(pos,2. - abs(sin(gTime * 0.4)) * 1.5);    
    pos = pos_origin;
    pos.xy *= rot(.8);
    float box5 = box(pos,.5) * 6.;    
    pos = pos_origin;
    float box6 = box(pos,.5) * 6.;    
    float result = max(max(max(max(max(box1,box2),box3),box4),box5),box6);
    return result;
}

float map(vec3 pos, float iTime) {
    vec3 pos_origin = pos;
    float box_set1 = box_set(pos, iTime);
    return box_set1;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Add pixelation to coordinates like in JuiceShader
    float pixel_size = length(iResolution.xy) / PIXEL_SIZE_FAC;
    vec2 uv = (floor(fragCoord.xy * (1.0 / pixel_size)) * pixel_size) / iResolution.xy;
    vec2 p = (uv * 2.0 - 1.0) * vec2(iResolution.x/iResolution.y, 1.0);
    
    vec3 ro = vec3(0., -0.2, iTime * 4.);
    vec3 ray = normalize(vec3(p, 1.5));
    ray.xy = ray.xy * rot(sin(iTime * .03) * 5.);
    ray.yz = ray.yz * rot(sin(iTime * .05) * .2);
    float t = 0.1;
    vec3 col = vec3(0.);
    float ac = 0.0;

    for (int i = 0; i < 99; i++) {
        vec3 pos = ro + ray * t;
        pos = mod(pos-2., 4.) -2.;
        gTime = iTime - float(i) * 0.01;
        
        float d = map(pos, iTime);
        d = max(abs(d), 0.01);
        ac += exp(-d*23.);
        t += d* 0.55;
    }

    col = vec3(ac * 0.02);
    col += vec3(
        0.5 + 0.3 * abs(sin(iTime)),  // Red component for yellow
        0.5 + 0.3 * abs(sin(iTime)),  // Green component for both yellow and green
        0.2 * abs(sin(iTime))         // Blue component (kept low for yellow/green mix)
    );
    
    // Pixelate the final color
    col = floor(col * 8.0) / 8.0;
    
    // Use 1.0 for alpha to make it fully opaque
    fragColor = vec4(col, 1.0);
}

varying vec2 vUv;

void main() {
    mainImage(gl_FragColor, vUv * iResolution);
}
`

export function OctagramShader({ onReady }) {
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