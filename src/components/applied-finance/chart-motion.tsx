'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './infographics.module.css';
/** Content remains readable without JS; motion runs once on entering the viewport. */
export function ChartMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
    }, { threshold: .15 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={styles.motion} data-visible={visible}>{children}</div>;
}
