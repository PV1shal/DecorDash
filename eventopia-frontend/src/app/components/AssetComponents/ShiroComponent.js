"use client";

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";

function Model() {
  const { scene } = useGLTF("/model/shiba_glb/scene.glb");
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (hovered && modelRef.current) {
      modelRef.current.rotation.y += delta * 2;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={[2, 2, 2]} // Adjust these values to change the size
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

const ShiroComponent = () => {
  return (
    <div className="w-64 h-full flex-shrink-0">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Model />
      </Canvas>
    </div>
  );
};

export { ShiroComponent };
