import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import gsap from 'gsap';
import PillButton from '@/components/PillButton';
import { ChevronDownIcon } from '@/components/icons';

export default function HeroSection() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const nameRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Three.js Particle Sphere
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 1);

    // Create particle sphere
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);

    const radius = 2.5;
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 0.8;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      velocities[i] = Math.random() * 0.3 + 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x000000,
      size: 0.015,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Inner glow sphere (subtle)
    const glowGeo = new THREE.SphereGeometry(radius * 0.6, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0F62FE,
      transparent: true,
      opacity: 0.03,
    });
    const glowSphere = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowSphere);

    // Mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation
    let time = 0;
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      time += delta;

      // Rotate sphere
      points.rotation.y += 0.001;
      points.rotation.x = Math.sin(time * 0.1) * 0.05;

      // Mouse parallax
      const targetRotY = mouseRef.current.x * 0.15;
      const targetRotX = -mouseRef.current.y * 0.15;
      points.rotation.y += (targetRotY - points.rotation.y) * 0.02;
      points.rotation.x += (targetRotX - points.rotation.x) * 0.02;

      // Undulate particles
      const posArray = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const v = velocities[i];
        const noise = Math.sin(time * v + i) * 0.05;
        posArray[idx] = originalPositions[idx] + noise;
        posArray[idx + 1] = originalPositions[idx + 1] + Math.cos(time * v * 0.8 + i) * 0.03;
        posArray[idx + 2] = originalPositions[idx + 2] + Math.sin(time * v * 0.6 + i) * 0.04;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Hero entrance animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 1.8 });

    // Name reveal with mask slide
    if (nameRef.current) {
      const chars = nameRef.current.querySelectorAll('.char');
      gsap.set(chars, { yPercent: 100 });
      tl.to(chars, {
        yPercent: 0,
        duration: 1.5,
        ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        stagger: 0.03,
      });
    }

    // Tagline fade in
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0, y: 20 });
      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
      }, '-=0.8');
    }

    // CTA buttons fade in
    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll('button');
      gsap.set(buttons, { opacity: 0, y: 20 });
      tl.to(buttons, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
        stagger: 0.1,
      }, '-=0.6');
    }

    return () => { tl.kill(); };
  }, []);

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const nameChars = t('hero.name').split('');

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col justify-end overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      <div className="relative z-[2] px-6 pb-12 md:pb-16 lg:px-12">
        <div ref={nameRef} className="overflow-hidden mb-4">
          <h1 className="text-display text-black tracking-tight flex">
            {nameChars.map((char, i) => (
              <span key={i} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
        </div>

        <p
          ref={taglineRef}
          className="text-body text-black max-w-[500px] mb-8 opacity-0"
        >
          {t('hero.tagline')}
        </p>

        <div ref={ctaRef} className="flex gap-4 mb-12">
          <PillButton onClick={scrollToContact}>
            {t('hero.ctaProject')}
          </PillButton>
          <PillButton onClick={scrollToWork}>
            {t('hero.ctaWork')}
          </PillButton>
        </div>

        <button
          onClick={scrollToWork}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-pulse-opacity cursor-pointer"
          aria-label="Scroll down"
        >
          <ChevronDownIcon color="#000000" size={24} />
        </button>
      </div>
    </section>
  );
}
