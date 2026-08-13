"use client";

import { useEffect, useRef } from "react";

export default function ParticleWaveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 380);
    let height = (canvas.height = 380);

    // Generate 3D Particle Matrix Sphere
    const numParticles = 320;
    const particles: {
      theta: number;
      phi: number;
      radius: number;
      baseRadius: number;
      size: number;
      speed: number;
    }[] = [];

    const baseR = 120;

    for (let i = 0; i < numParticles; i++) {
      // Golden spiral distribution over sphere
      const theta = Math.acos(1 - (2 * (i + 0.5)) / numParticles);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;
      const size = Math.random() * 1.8 + 1.2;

      particles.push({
        theta,
        phi,
        radius: baseR,
        baseRadius: baseR,
        size,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    let rotY = 0;
    let rotX = 0.3;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;
      rotY += 0.006;

      const cx = width / 2;
      const cy = height / 2;

      // Draw faint background ambient glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 160);
      glowGrad.addColorStop(0, "rgba(196, 241, 53, 0.12)");
      glowGrad.addColorStop(0.6, "rgba(16, 185, 129, 0.04)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 160, 0, Math.PI * 2);
      ctx.fill();

      // Project and draw dots sorted by depth (Z-buffer effect)
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply audio-wave pulsation displacement
        const wave = Math.sin(p.phi * 4 + p.theta * 6 + time) * 12 + Math.cos(p.theta * 3 + time * 1.5) * 8;
        const currentR = p.baseRadius + wave;

        // 3D Spherical coordinates to Cartesian
        let x = currentR * Math.sin(p.theta) * Math.cos(p.phi);
        let y = currentR * Math.sin(p.theta) * Math.sin(p.phi);
        let z = currentR * Math.cos(p.theta);

        // Rotation around Y axis
        let x1 = x * Math.cos(rotY) - z * Math.sin(rotY);
        let z1 = x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotation around X axis
        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Perspective Projection
        const perspective = 300 / (300 + z2);
        const px = cx + x1 * perspective;
        const py = cy + y2 * perspective;
        const alpha = Math.max(0.1, (z2 + currentR) / (2 * currentR));
        const dotRadius = p.size * perspective;

        projected.push({ px, py, alpha, dotRadius, z2 });
      }

      // Sort dots so back dots render behind front dots
      projected.sort((a, b) => a.z2 - b.z2);

      // Render matrix dots in lime green
      for (const pt of projected) {
        ctx.fillStyle = `rgba(196, 241, 53, ${pt.alpha * 0.95})`;
        ctx.shadowColor = "#C4F135";
        ctx.shadowBlur = pt.alpha > 0.6 ? 6 : 0;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, pt.dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw active status ring in center
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(196, 241, 53, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="particle-globe-wrapper">
      <canvas ref={canvasRef} width={380} height={380} className="particle-canvas" />
      <style jsx>{`
        .particle-globe-wrapper {
          position: relative;
          width: 380px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .particle-canvas {
          width: 380px;
          height: 380px;
          pointer-events: none;
        }
        @media (max-width: 960px) {
          .particle-globe-wrapper, .particle-canvas {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}
