"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MarketNoiseIntro } from "./market-noise-intro";
import { PrismLightAnimation } from "./prism-light-animation";
import { ProductScreenMontage } from "./product-screen-montage";
import { FounderIdentityFrame } from "./founder-identity-frame";
import { ClosingLogoFrame } from "./closing-logo-frame";

const DURATION = 25;
const sceneStarts = [0, 5.2, 10.4, 17.1, 21.2];
const captions = ["Markets create noise.", "Research creates clarity.", "One process. Multiple perspectives.", "Shyheim Lee — U.S. Army Veteran, SDSU Finance, Aspiring Investment Professional.", "Luna1 Research. Discipline. Evidence. Evolution."];

export type CommercialMedia = { mp4?: string; webm?: string; poster?: string };

function sceneForTime(time: number) { let scene = 0; sceneStarts.forEach((start, index) => { if (time >= start) scene = index; }); return scene; }

export function LunaCommercial({ compact = false, media }: { compact?: boolean; media?: CommercialMedia }) {
  const reducedMotion = useReducedMotion();
  const hasVideo = Boolean(media?.mp4 || media?.webm);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const video = useRef<HTMLVideoElement>(null);
  const activeScene = reducedMotion ? 4 : sceneForTime(time);

  const pause = useCallback(() => { setPlaying(false); video.current?.pause(); }, []);
  const play = useCallback(() => { if (reducedMotion) return; if (time >= DURATION) setTime(0); setPlaying(true); if (video.current) video.current.play().catch(() => setPlaying(false)); }, [reducedMotion, time]);
  const restart = useCallback(() => { setTime(0); if (video.current) video.current.currentTime = 0; if (!reducedMotion) setPlaying(true); }, [reducedMotion]);

  useEffect(() => { if (!playing || hasVideo) return; const timer = window.setInterval(() => { setTime(current => { const next = Math.min(current + .1, DURATION); if (next >= DURATION) window.setTimeout(() => setPlaying(false), 0); return next; }); }, 100); return () => window.clearInterval(timer); }, [playing, hasVideo]);

  const scenes = [<MarketNoiseIntro active key="market"/>, <PrismLightAnimation active key="prism"/>, <ProductScreenMontage active key="products"/>, <FounderIdentityFrame active key="founder"/>, <ClosingLogoFrame active key="closing"/>];
  return <div className={`commercial-player${compact ? " commercial-player--compact" : ""}`}>
    <div className="commercial-stage" aria-label="Luna1 Research institutional brand commercial">
      {hasVideo ? <video ref={video} className="commercial-video" muted={muted} poster={media?.poster ?? "/commercial-poster.png"} playsInline preload="metadata" onTimeUpdate={event => setTime(event.currentTarget.currentTime)} onEnded={() => setPlaying(false)}><source src={media?.webm} type="video/webm"/><source src={media?.mp4} type="video/mp4"/><track kind="captions" src="/commercial-assets/luna1-commercial.vtt" srcLang="en" label="English" default/></video> : <AnimatePresence mode="wait"><motion.div key={activeScene} className="scene-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .6 }}>{scenes[activeScene]}</motion.div></AnimatePresence>}
      {!playing && time === 0 && !reducedMotion && <button className="commercial-play-overlay" onClick={() => setPlaying(true)} aria-label="Play Luna1 commercial"><Play aria-hidden="true"/><span>Play film</span><small>25 seconds · sound off</small></button>}
      {reducedMotion && <div className="reduced-motion-note">Static poster shown because reduced motion is enabled.</div>}
      <div className="commercial-caption" aria-live="polite">{captions[activeScene]}</div>
    </div>
    <div className="commercial-controls" aria-label="Commercial controls">
      <button onClick={playing ? pause : play} disabled={Boolean(reducedMotion)} aria-label={playing ? "Pause commercial" : "Play commercial"}>{playing ? <Pause/> : <Play/>}<span>{playing ? "Pause" : "Play"}</span></button>
      <button onClick={restart} aria-label="Restart commercial"><RotateCcw/><span>Restart</span></button>
      <button onClick={() => setMuted(value => !value)} aria-pressed={muted} disabled={!hasVideo} aria-label={muted ? "Unmute commercial" : "Mute commercial"}>{muted ? <VolumeX/> : <Volume2/>}<span>{muted ? "Muted" : "Mute"}</span></button>
      <div className="commercial-progress"><span style={{ width: `${(time / DURATION) * 100}%` }}/></div><time>{Math.floor(time).toString().padStart(2, "0")} / 25</time>
    </div>
    <p className="sr-only">A 25-second brand film moves from noisy illustrative market data through a prism that separates research into fundamentals, technicals, valuation, risk, and discipline; then shows six concept product screens, introduces founder Shyheim Lee, and closes on the Luna1 Research identity.</p>
  </div>;
}
