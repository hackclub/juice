import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { ColorManagement } from 'three';
import { ACESFilmicToneMapping } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import { useThree } from "@react-three/fiber";
import gsap from 'gsap';
import Lights from "../3d/Lights";
import Wall from "../3d/Wall";
import Desk from "../3d/Desk";
import MacModel from "../3d/MacModel";
import Disk from "../3d/Disk";
import Sprig from "../3d/Sprig";
import Orpheus from "../3d/Orpheus";
import Bonsai from "../3d/Bonsai";
import Lamp from "../3d/Lamp";
import Cup from "../3d/Cup";
import SummitScroll from "../3d/SummitScroll";
import InterstellaPoster from "../3d/InterstellaPoster";
import Book from "../3d/Book";

ColorManagement.enabled = true;

function CameraController({ isZooming }) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (isZooming) {
      gsap.to(camera, {
        fov: 5,
        duration: 2.5,
        ease: "power2.in",
        onUpdate: () => camera.updateProjectionMatrix()
      });
    }
  }, [isZooming, camera]);
  
  return null;
}

export default function ThreeDWorld({ onDiskInserted }) {
  const [isZooming, setIsZooming] = useState(false);

  const handleDiskInserted = () => {
    setIsZooming(true);
    setTimeout(() => {
      onDiskInserted();
    }, 2500);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas 
        camera={{ 
          position: [0, -1.0, 17.5],
          fov: 70
        }}
        shadows
        gl={{
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 2.2,
          outputEncoding: 'sRGB'
        }}
      >
        <color attach="background" args={['#ffffff']} />
        <ambientLight intensity={1.4} color="#FFF5E1" />
        <pointLight position={[0, 10, 10]} intensity={0.2} color="#FFE4B5" />
        <pointLight position={[-10, 5, 0]} intensity={1.0} color="#FFF5E1" />
        <CameraController isZooming={isZooming} />
        <Suspense fallback={null}>
          <Wall />
          <Desk />
          <MacModel />
          <Disk onInserted={handleDiskInserted} />
          <Sprig />
          <Orpheus />
          <Bonsai />
          <Lamp />
          <Cup />
          <SummitScroll />
          <InterstellaPoster />
          <Book />
          <EffectComposer>
            <Bloom
              intensity={0.1}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.6}
            />
            <HueSaturation
              saturation={0.5}
            />
            <BrightnessContrast
              brightness={0.2}
              contrast={0.40}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
} 