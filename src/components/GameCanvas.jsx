import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GameCanvas({ wpm = 0, streak = 0, isCorrect = true, laserTrigger = 0 }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ wpm, streak, laserTrigger });

  // Update refs to read latest props inside render loop without re-running useEffect
  useEffect(() => {
    stateRef.current = { wpm, streak, laserTrigger };
  }, [wpm, streak, laserTrigger]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c16, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x22d3ee, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xf43f5e, 2, 50);
    pointLight.position.set(0, 0, -10);
    scene.add(pointLight);

    // 1. Warp Tunnel Geometry
    // We create a cylinder that is flipped inside out
    const tunnelRadius = 12;
    const tunnelLength = 120;
    const tunnelGeom = new THREE.CylinderGeometry(tunnelRadius, tunnelRadius, tunnelLength, 20, 30, true);
    // Rotate cylinder so its length is along the Z axis
    tunnelGeom.rotateX(Math.PI / 2);

    // Grid material
    const tunnelMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      side: THREE.BackSide
    });

    const tunnelMesh1 = new THREE.Mesh(tunnelGeom, tunnelMat);
    tunnelMesh1.position.z = -30;
    scene.add(tunnelMesh1);

    const tunnelMesh2 = tunnelMesh1.clone();
    tunnelMesh2.position.z = -30 - tunnelLength;
    scene.add(tunnelMesh2);

    // 2. Starfield Particles
    const starCount = 350;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      // Position stars in a hollow tube along Z axis
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * (tunnelRadius - 3);
      starPos[i] = Math.cos(angle) * radius;
      starPos[i + 1] = Math.sin(angle) * radius;
      starPos[i + 2] = -Math.random() * 120; // Spread out in front
      starSpeeds[i / 3] = 0.5 + Math.random() * 1.5;
    }

    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    // Particle texture
    const starMat = new THREE.PointsMaterial({
      color: 0x22d3ee,
      size: 0.12,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(starGeom, starMat);
    scene.add(starParticles);

    // 3. Procedural Spaceship (Player)
    const shipGroup = new THREE.Group();
    shipGroup.position.set(0, -1.8, 4.5);

    // Main hull
    const hullGeom = new THREE.ConeGeometry(0.5, 2, 4);
    hullGeom.rotateX(Math.PI / 2); // Point forward (Z is negative in ThreeJS)
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true
    });
    const hullMesh = new THREE.Mesh(hullGeom, hullMat);
    shipGroup.add(hullMesh);

    // Wing Left
    const wingGeom = new THREE.BoxGeometry(1.2, 0.1, 0.6);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      roughness: 0.3,
      metalness: 0.7
    });
    const wingLeft = new THREE.Mesh(wingGeom, wingMat);
    wingLeft.position.set(-0.7, -0.15, 0.2);
    wingLeft.rotation.z = -0.2;
    shipGroup.add(wingLeft);

    // Wing Right
    const wingRight = wingLeft.clone();
    wingRight.position.x = 0.7;
    wingRight.rotation.z = 0.2;
    shipGroup.add(wingRight);

    // Thruster glow (neon cylinder)
    const thrusterGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 8);
    thrusterGeom.rotateX(Math.PI / 2);
    const thrusterMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.9
    });
    const thruster = new THREE.Mesh(thrusterGeom, thrusterMat);
    thruster.position.set(0, -0.1, 1.1);
    shipGroup.add(thruster);

    scene.add(shipGroup);

    // Laser Lines (initially scale = 0 so invisible)
    const laserMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 2 });
    
    const laserLeftGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.7, -1.95, 4.5),
      new THREE.Vector3(-0.7, -1.5, -20)
    ]);
    const laserLeft = new THREE.Line(laserLeftGeom, laserMat);
    scene.add(laserLeft);
    laserLeft.visible = false;

    const laserRightGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.7, -1.95, 4.5),
      new THREE.Vector3(0.7, -1.5, -20)
    ]);
    const laserRight = new THREE.Line(laserRightGeom, laserMat);
    scene.add(laserRight);
    laserRight.visible = false;

    // Laser firing cooldowns
    let laserDuration = 0;

    // Particle explosion pool
    const explosionParticles = [];
    const createExplosion = (x, y, z) => {
      const pCount = 20;
      const geom = new THREE.BufferGeometry();
      const pos = new Float32Array(pCount * 3);
      const vel = [];

      for (let i = 0; i < pCount; i++) {
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
        vel.push({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
          z: (Math.random() - 0.5) * 4
        });
      }

      geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xfabf24,
        size: 0.25,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending
      });
      const points = new THREE.Points(geom, mat);
      scene.add(points);
      explosionParticles.push({ mesh: points, velocities: vel, life: 1.0 });
    };

    // Tracking last laser trigger
    let lastLaserTrigger = 0;

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Read current state
      const { wpm: currentWpm, streak: currentStreak, laserTrigger: currentLaserTrigger } = stateRef.current;

      // Base speeds mapping to WPM
      const speedMult = Math.min(2.5, 0.4 + (currentWpm / 60));
      const rotationSpeed = 0.08 * speedMult;
      const travelSpeed = 25 * speedMult; // virtual speed for stars

      // 1. Move/Rotate Tunnel meshes
      tunnelMesh1.rotation.z += rotationSpeed * delta;
      tunnelMesh2.rotation.z += rotationSpeed * delta;

      tunnelMesh1.position.z += travelSpeed * delta;
      tunnelMesh2.position.z += travelSpeed * delta;

      // Wrap tunnels
      if (tunnelMesh1.position.z > 30) {
        tunnelMesh1.position.z = tunnelMesh2.position.z - tunnelLength;
      }
      if (tunnelMesh2.position.z > 30) {
        tunnelMesh2.position.z = tunnelMesh1.position.z - tunnelLength;
      }

      // 2. Move Stars (hollow tube particles)
      const positions = starParticles.geometry.attributes.position.array;
      for (let i = 2; i < positions.length; i += 3) {
        positions[i] += travelSpeed * 1.5 * delta * starSpeeds[(i - 2) / 3];
        if (positions[i] > 10) {
          positions[i] = -120; // reset back deep in the screen
        }
      }
      starParticles.geometry.attributes.position.needsUpdate = true;

      // 3. Spaceship hover animation & react to streaks
      shipGroup.position.y = -1.8 + Math.sin(time * 3.5) * 0.06;
      shipGroup.position.x = Math.sin(time * 1.5) * 0.15;
      shipGroup.rotation.z = Math.sin(time * 1.5) * 0.05;
      
      // Thruster size pulsing based on streak
      const thrusterScale = 1.0 + Math.min(1.5, currentStreak * 0.06);
      thruster.scale.set(thrusterScale, thrusterScale, thrusterScale);
      
      // Update color based on combo streak
      if (currentStreak > 15) {
        thrusterMat.color.setHex(0x22d3ee); // Cyan thruster
        tunnelMat.color.setHex(0xf43f5e); // tunnel changes pink
      } else {
        thrusterMat.color.setHex(0xf43f5e); // Pink thruster
        tunnelMat.color.setHex(0x4f46e5); // Indigo tunnel
      }

      // 4. Trigger Lasers
      if (currentLaserTrigger !== lastLaserTrigger) {
        lastLaserTrigger = currentLaserTrigger;
        laserLeft.visible = true;
        laserRight.visible = true;
        laserDuration = 0.12; // visible for 120ms
        
        // Shake camera
        camera.position.x = (Math.random() - 0.5) * 0.2;
        camera.position.y = (Math.random() - 0.5) * 0.2;

        // Create particle blast at a distance
        createExplosion(shipGroup.position.x, shipGroup.position.y + 0.3, -15);
      }

      // Handle Laser visibility timer
      if (laserDuration > 0) {
        laserDuration -= delta;
        if (laserDuration <= 0) {
          laserLeft.visible = false;
          laserRight.visible = false;
          camera.position.set(0, 0, 8); // reset camera shake
        }
      }

      // Update Laser Start Points to align with ship movement
      if (laserLeft.visible) {
        const leftArr = laserLeft.geometry.attributes.position.array;
        leftArr[0] = shipGroup.position.x - 0.7;
        leftArr[1] = shipGroup.position.y - 0.15;
        laserLeft.geometry.attributes.position.needsUpdate = true;

        const rightArr = laserRight.geometry.attributes.position.array;
        rightArr[0] = shipGroup.position.x + 0.7;
        rightArr[1] = shipGroup.position.y - 0.15;
        laserRight.geometry.attributes.position.needsUpdate = true;
      }

      // 5. Update explosions
      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const exp = explosionParticles[i];
        exp.life -= delta * 1.8;
        const expPos = exp.mesh.geometry.attributes.position.array;

        for (let j = 0; j < expPos.length; j += 3) {
          expPos[j] += exp.velocities[j / 3].x * delta;
          expPos[j + 1] += exp.velocities[j / 3].y * delta;
          expPos[j + 2] += exp.velocities[j / 3].z * delta;
        }

        exp.mesh.geometry.attributes.position.needsUpdate = true;
        exp.mesh.material.opacity = exp.life;

        if (exp.life <= 0) {
          scene.remove(exp.mesh);
          exp.mesh.geometry.dispose();
          exp.mesh.material.dispose();
          explosionParticles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const w = currentMount.clientWidth || window.innerWidth;
      const h = currentMount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      tunnelGeom.dispose();
      tunnelMat.dispose();
      starGeom.dispose();
      starMat.dispose();
      hullGeom.dispose();
      hullMat.dispose();
      wingGeom.dispose();
      wingMat.dispose();
      thrusterGeom.dispose();
      thrusterMat.dispose();
      laserMat.dispose();
      laserLeftGeom.dispose();
      laserRightGeom.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}
