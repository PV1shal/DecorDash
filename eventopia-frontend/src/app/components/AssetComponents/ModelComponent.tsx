"use client";
import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { useGLTF, OrthographicCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import itemTypes from "../../../../utils/ItemTypes";
import * as THREE from "three";

export interface ModelProps {
  image: string;
}

function Model(props: ModelProps) {
  const { scene } = useGLTF(props.image);
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Auto-rotate when hovered
  useFrame((state, delta) => {
    if (hovered && modelRef.current) {
      modelRef.current.rotation.y += delta * 2;
    }
  });

  // Center and adjust the model on load
  useEffect(() => {
    if (modelRef.current) {
      // Center the model
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Calculate scale to fit the view
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scale = 1.5 / maxDimension; // Adjust this value to change how much of the view the model fills
      
      modelRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      modelRef.current.scale.setScalar(scale);
    }
  }, [scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    />
  );
}

const ModelComponent = (props: ModelProps) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: itemTypes.ASSET,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    []
  );

  useEffect(() => {
    console.log("Doggo being dragged-o");
  }, [isDragging]);

  return (
    <div ref={dragRef} className="w-64 h-64 flex-shrink-0">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1}
          intensity={0.8}
        />
        <Model image={props.image} />
      </Canvas>
    </div>
  );
};

export { ModelComponent };