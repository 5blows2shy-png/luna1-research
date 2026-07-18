"use client";

import { useEffect, useRef } from "react";

export function ParticleField({
  active,
  reduced,
}: {
  active: boolean;
  reduced: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element || reduced || !active) return;
    const context = element.getContext("2d");
    if (!context) return;
    let animation = 0;
    const points = Array.from({ length: 46 }, (_, index) => ({
      x: (index * 83) % 997,
      y: (index * 47) % 541,
      z: 0.25 + (index % 9) / 10,
    }));
    const draw = () => {
      const rect = element.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio, 2);
      if (element.width !== rect.width * ratio) {
        element.width = rect.width * ratio;
        element.height = rect.height * ratio;
      }
      context.clearRect(0, 0, element.width, element.height);
      for (const point of points) {
        point.y -= 0.08 + point.z * 0.22;
        point.x += 0.03 * point.z;
        if (point.y < 0) point.y = rect.height;
        const x = (point.x % rect.width) * ratio;
        const y = point.y * ratio;
        context.beginPath();
        context.arc(
          x,
          y,
          Math.max(0.5, point.z * 1.25) * ratio,
          0,
          Math.PI * 2,
        );
        context.fillStyle = `rgba(34,211,238,${0.08 + point.z * 0.22})`;
        context.fill();
      }
      animation = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animation);
  }, [active, reduced]);
  return <canvas ref={canvas} className="particle-field" aria-hidden="true" />;
}
