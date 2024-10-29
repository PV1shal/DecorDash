"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import itemTypes from "../../../../utils/ItemTypes";

export interface ModelProps {
  image: string;
}

function Model(props:ModelProps) {
  const { scene } = useGLTF(props.image);
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

const ModelComponent = (props:ModelProps) => {
  const {image} = props;
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
    console.log("Doggo being dragged-o")
  }, [isDragging]);

  return (
    <div ref={dragRef} className="w-64 h-full flex-shrink-0">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Model image={props.image}/>
      </Canvas>
    </div>
  );
};

export { ModelComponent };