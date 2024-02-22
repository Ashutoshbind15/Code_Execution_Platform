"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
// import { SmileOutlined } from "@ant-design/icons";
import { renderToString } from "react-dom/server";
import { SmileOutlined } from "@ant-design/icons";

const IconTexture = ({ icon }) => {
  const texture = useRef();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const size = 128; // Canvas size
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    // Ensure the background is transparent for the canvas
    ctx.fillStyle = "rgba(255, 255, 255, 0)";
    ctx.fillRect(0, 0, size, size);

    // Convert the Ant Design icon to SVG markup and draw it on the canvas
    const svgMarkup = renderToString(icon);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      texture.current.needsUpdate = true;
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgMarkup)}`;

    texture.current = new THREE.CanvasTexture(canvas);
  }, [icon]);

  return <meshBasicMaterial attach="material" map={texture.current} />;
};

const IconSprite = ({ position }) => {
  return (
    <sprite position={position}>
      <IconTexture icon={<SmileOutlined className="text-xl font-black" />} />
    </sprite>
  );
};

const Scene = () => {
  // Generate random positions for icons
  const positions = [...Array(10)].map(() => {
    const phi = Math.acos(-1 + Math.random() * 2);
    const theta = Math.sqrt(Math.random()) * 2 * Math.PI;
    return [
      5 * Math.sin(phi) * Math.cos(theta),
      5 * Math.sin(phi) * Math.sin(theta),
      5 * Math.cos(phi),
    ];
  });

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {positions.map((pos, index) => (
        <IconSprite key={index} position={pos} />
      ))}
    </Canvas>
  );
};

export default Scene;
