import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackground Component
 * 
 * High-performance 3D ambient canvas powered by Three.js.
 * Renders floating geometric tech objects, glowing wireframes, digital particle field,
 * and dynamic blue/violet lighting.
 * 
 * Includes:
 * - WebGL capability detection & graceful CSS fallback
 * - Reduced motion support (prefers-reduced-motion)
 * - Mobile responsive particle scaling
 * - Automatic pause when tab is inactive
 * - Comprehensive memory cleanup on unmount
 */
export const ThreeBackground = () => {
  const containerRef = useRef(null);
  const [webGLAvailable, setWebGLAvailable] = useState(true);

  useEffect(() => {
    // 1. WebGL Feature Detection
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGLAvailable(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // 2. Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3. Setup Scene, Camera & Renderer
    const scene = new THREE.Scene();
    // Midnight fog to seamlessly blend objects into the deep background
    scene.fog = new THREE.FogExp2(0x020817, 0.035);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 18;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x020817, 0); // Transparent so CSS gradients shine through
      container.appendChild(renderer.domElement);
    } catch {
      setWebGLAvailable(false);
      return;
    }

    // 4. Lighting System (Electric Blue, Neon Cyan, Violet)
    const ambientLight = new THREE.AmbientLight(0x071b3d, 1.2);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00d9ff, 3, 30);
    cyanLight.position.set(8, 6, 5);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0x713bff, 3.5, 30);
    violetLight.position.set(-8, -6, 4);
    scene.add(violetLight);

    const blueDirLight = new THREE.DirectionalLight(0x087bff, 1.5);
    blueDirLight.position.set(0, 10, 10);
    scene.add(blueDirLight);

    // 5. Digital Particle Field
    const particleCount = isMobile ? 80 : 220;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00d9ff);
    const colorViolet = new THREE.Color(0x713bff);
    const colorBlue = new THREE.Color(0x087bff);
    const palette = [colorCyan, colorViolet, colorBlue];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread across deep 3D volume
      positions[i3] = (Math.random() - 0.5) * 35;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;

      const chosenColor = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.12 : 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Floating Geometric Objects
    const objects = [];

    // Glowing Wireframe Cube
    const cubeGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x071b3d,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.6
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);
    const cubeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(cubeGeo),
      new THREE.LineBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0.8 })
    );
    cube.add(cubeEdges);
    cube.position.set(-9, 4, -4);
    scene.add(cube);
    objects.push({ mesh: cube, rotSpeedX: 0.003, rotSpeedY: 0.005, baseY: 4, floatSpeed: 0.8 });

    // Orbital Torus (Neon Cyan / Violet)
    const torusGeo = new THREE.TorusGeometry(2.8, 0.12, 16, 64);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x713bff,
      emissive: 0x3d1599,
      roughness: 0.2,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(10, -3, -6);
    scene.add(torus);
    objects.push({ mesh: torus, rotSpeedX: 0.004, rotSpeedY: 0.002, baseY: -3, floatSpeed: 0.6 });

    // Tech Octahedron
    if (!isMobile) {
      const octaGeo = new THREE.OctahedronGeometry(1.6);
      const octaMat = new THREE.MeshStandardMaterial({
        color: 0x087bff,
        emissive: 0x043d80,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const octa = new THREE.Mesh(octaGeo, octaMat);
      octa.position.set(7, 7, -8);
      scene.add(octa);
      objects.push({ mesh: octa, rotSpeedX: 0.005, rotSpeedY: 0.006, baseY: 7, floatSpeed: 1.1 });

      // Geometric Icosahedron
      const icoGeo = new THREE.IcosahedronGeometry(1.4);
      const icoMat = new THREE.MeshStandardMaterial({
        color: 0x00d9ff,
        emissive: 0x004754,
        wireframe: true,
        transparent: true,
        opacity: 0.65
      });
      const ico = new THREE.Mesh(icoGeo, icoMat);
      ico.position.set(-8, -7, -5);
      scene.add(ico);
      objects.push({ mesh: ico, rotSpeedX: 0.003, rotSpeedY: 0.004, baseY: -7, floatSpeed: 0.9 });
    }

    // 7. Subtle Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    };

    if (!isMobile && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    let isTabVisible = true;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        clock.start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isTabVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Slow particle drift
        particles.rotation.y = elapsedTime * 0.02;
        particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

        // Floating geometric objects
        objects.forEach((item, index) => {
          item.mesh.rotation.x += item.rotSpeedX;
          item.mesh.rotation.y += item.rotSpeedY;
          // Natural vertical floating wave
          item.mesh.position.y = item.baseY + Math.sin(elapsedTime * item.floatSpeed + index) * 0.45;
        });

        // Dynamic light drifting
        cyanLight.position.x = 8 + Math.sin(elapsedTime * 0.4) * 2;
        cyanLight.position.y = 6 + Math.cos(elapsedTime * 0.3) * 2;
        violetLight.position.x = -8 + Math.cos(elapsedTime * 0.35) * 2;
        violetLight.position.y = -6 + Math.sin(elapsedTime * 0.45) * 2;

        // Smooth camera parallax
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;
        camera.position.x = currentMouseX;
        camera.position.y = -currentMouseY;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    };

    window.addEventListener('resize', handleResize);

    // 10. Comprehensive Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Geometries & Materials
      particleGeometry.dispose();
      particleMaterial.dispose();
      cubeGeo.dispose();
      cubeMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-bg-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {/* Graceful CSS Fallback when WebGL is unavailable */}
      {!webGLAvailable && (
        <div className="three-fallback-layer">
          <div className="fallback-glow-orb-cyan" />
          <div className="fallback-glow-orb-violet" />
        </div>
      )}
    </div>
  );
};

export default ThreeBackground;
