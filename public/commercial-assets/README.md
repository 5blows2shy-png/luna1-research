# Luna1 commercial replacement assets

The React/SVG film is the production fallback. To replace it with rendered video later, place:

- `luna1-commercial.webm` — preferred web delivery format, 1920×1080, 25 seconds maximum
- `luna1-commercial.mp4` — H.264 fallback, 1920×1080, 25 seconds maximum
- `luna1-commercial.vtt` — synchronized English captions

Then pass those public URLs to `LunaCommercial` through its `media` prop. Audio must begin muted and must never autoplay. Keep `public/commercial-poster.png` as the poster and social-sharing image.

## Optional sound design

Place original or properly licensed stems in this directory using these names:

- `ambient-score.webm` — cinematic bed
- `market-ambience.webm` — restrained data-room texture
- `impacts.webm` — bass impacts at scene boundaries
- `interfaces.webm` — quiet HUD and data sounds
- `transitions.webm` — soft whooshes

No audio is loaded until a final licensed mix exists. The player defaults to muted and never autoplays audio.

## Configured cuts

Cut durations live in `src/components/commercial/motion-tokens.ts`: 15-second trailer/LinkedIn, 29-second feature, 60-second extended, and 20-second ambient background. Each can later point to its own MP4/WebM render without changing scene components.
