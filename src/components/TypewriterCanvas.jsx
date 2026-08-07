import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const KEYBOARD_LAYOUT = [
  { row: 0, keys: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"], xOffset: -4.5 },
  { row: 1, keys: ["A", "S", "D", "F", "G", "H", "J", "K", "L"], xOffset: -4.0 },
  { row: 2, keys: ["Z", "X", "C", "V", "B", "N", "M"], xOffset: -3.0 }
];

export default function TypewriterCanvas({ lastKeyPressed = "" }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ lastKeyPressed });

  useEffect(() => {
    stateRef.current = { lastKeyPressed };
  }, [lastKeyPressed]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c16, 0.025);

    // Camera - angled overhead view of the keyboard
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4.5, 7.5);
    camera.lookAt(0, -0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyboardGlow = new THREE.PointLight(0x818cf8, 3, 20);
    keyboardGlow.position.set(0, 2, 0);
    scene.add(keyboardGlow);

    const activeKeyGlow = new THREE.PointLight(0x22d3ee, 0, 8);
    activeKeyGlow.position.set(0, 1, 0);
    scene.add(activeKeyGlow);

    // Keyboard Base plate
    const baseGeom = new THREE.BoxGeometry(11, 0.4, 4.2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111326,
      roughness: 0.5,
      metalness: 0.7
    });
    const basePlate = new THREE.Mesh(baseGeom, baseMat);
    basePlate.position.set(0, -0.4, 0.2);
    scene.add(basePlate);

    // Keycaps generator
    const keysMap = {};
    const keyGeom = new THREE.BoxGeometry(0.75, 0.4, 0.75);
    
    // Spacebar Geometry
    const spacebarGeom = new THREE.BoxGeometry(4.5, 0.4, 0.75);

    // Create standard key meshes
    KEYBOARD_LAYOUT.forEach((rowInfo, rowIndex) => {
      rowInfo.keys.forEach((char, charIndex) => {
        // Compute x, y, z positions for QWERTY rows
        const x = rowInfo.xOffset + charIndex * 1.0;
        const z = -1.2 + rowIndex * 1.0;
        
        // Custom key color based on row
        const keyColor = rowIndex === 0 ? 0xf43f5e : rowIndex === 1 ? 0x818cf8 : 0x22d3ee;
        const keyMat = new THREE.MeshStandardMaterial({
          color: 0x1f2240,
          roughness: 0.4,
          metalness: 0.6,
          emissive: keyColor,
          emissiveIntensity: 0.15
        });

        const keyMesh = new THREE.Mesh(keyGeom, keyMat);
        keyMesh.position.set(x, 0, z);
        scene.add(keyMesh);

        // Store reference and original height
        keysMap[char.toLowerCase()] = {
          mesh: keyMesh,
          origY: 0,
          targetY: 0,
          emissiveColor: keyColor
        };
      });
    });

    // Create Spacebar
    const spaceMat = new THREE.MeshStandardMaterial({
      color: 0x1f2240,
      roughness: 0.4,
      metalness: 0.6,
      emissive: 0x818cf8,
      emissiveIntensity: 0.15
    });
    const spaceMesh = new THREE.Mesh(spacebarGeom, spaceMat);
    spaceMesh.position.set(0, 0, 1.8);
    scene.add(spaceMesh);
    keysMap[" "] = {
      mesh: spaceMesh,
      origY: 0,
      targetY: 0,
      emissiveColor: 0x818cf8
    };

    // Keep track of the active keys to trigger animations
    let processedKey = "";

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Check for typing input
      const { lastKeyPressed } = stateRef.current;
      if (lastKeyPressed && lastKeyPressed !== processedKey) {
        processedKey = lastKeyPressed;
        const keyChar = lastKeyPressed.toLowerCase();
        
        const targetKey = keysMap[keyChar];
        if (targetKey) {
          // Push down key
          targetKey.targetY = -0.25;
          targetKey.mesh.material.emissiveIntensity = 2.0; // intense light on click
          
          // Move the active key glow point light to this key
          activeKeyGlow.position.copy(targetKey.mesh.position);
          activeKeyGlow.position.y += 0.5;
          activeKeyGlow.intensity = 4.0;
        }
      }

      // Smoothly animate keys back to resting state
      Object.keys(keysMap).forEach((char) => {
        const item = keysMap[char];
        // Spring logic (simple lerp)
        item.mesh.position.y += (item.targetY - item.mesh.position.y) * 0.3;
        
        // Decay the target Y back to normal
        item.targetY += (item.origY - item.targetY) * 0.2;
        
        // Decay emissive brightness
        item.mesh.material.emissiveIntensity += (0.15 - item.mesh.material.emissiveIntensity) * 0.1;
      });

      // Decay keypress helper light
      activeKeyGlow.intensity += (0 - activeKeyGlow.intensity) * 0.1;

      // Slow idle movement for the keyboard to feel alive
      const time = Date.now() * 0.001;
      basePlate.position.y = -0.4 + Math.sin(time * 0.8) * 0.03;
      Object.keys(keysMap).forEach((char) => {
        const item = keysMap[char];
        // Shift original height slightly with idle wave
        item.origY = Math.sin(time * 0.8 + item.mesh.position.x * 0.2) * 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = currentMount.clientWidth || window.innerWidth;
      const h = currentMount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose
      baseGeom.dispose();
      baseMat.dispose();
      keyGeom.dispose();
      spacebarGeom.dispose();
      spaceMat.dispose();
      Object.keys(keysMap).forEach((char) => {
        keysMap[char].mesh.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}
