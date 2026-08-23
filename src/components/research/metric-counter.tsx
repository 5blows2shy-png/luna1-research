"use client";

import { useEffect, useRef, useState } from "react";

type MetricCounterProps = {
  value: number;
  suffix?: string;
  prefix?: string;
};

export function MetricCounter({
  value,
  suffix = "%",
  prefix = "~",
}: MetricCounterProps) {
  const element = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState<number | null>(null);

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let frame = 0;
    let started = false;
    const duration = 750;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [value]);

  return (
    <span ref={element} aria-label={`${prefix}${value}${suffix}`}>
      {prefix}
      {displayValue ?? value}
      {suffix}
    </span>
  );
}
