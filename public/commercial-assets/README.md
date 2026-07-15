# Luna1 commercial replacement assets

The React/SVG film is the production fallback. To replace it with rendered video later, place:

- `luna1-commercial.webm` — preferred web delivery format, 1920×1080, 25 seconds maximum
- `luna1-commercial.mp4` — H.264 fallback, 1920×1080, 25 seconds maximum
- `luna1-commercial.vtt` — synchronized English captions

Then pass those public URLs to `LunaCommercial` through its `media` prop. Audio must begin muted and must never autoplay. Keep `public/commercial-poster.png` as the poster and social-sharing image.
