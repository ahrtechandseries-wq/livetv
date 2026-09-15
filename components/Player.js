'use client';

import { useEffect, useRef, useState } from 'react';
import Logo from './Logo';

const MAX_RETRIES = 3;

const RETRY_DELAY_MS = 2000;

/**
 * Direct browser -> stream-host playback (no proxy) via
 * hls.js for .m3u8, falling back to native <video> src for
 * anything the browser can already play natively (some IPTV
 * links are plain MP4/TS that autoplay fine without hls.js).
 *
 * Failure handling per the spec: detect errors, retry a
 * bounded number of times, then mark unavailable and call
 * onExhausted() so the parent page can offer/attempt the next
 * channel - this component itself never loops forever and
 * never decides on its own to permanently blacklist a channel.
 */
export default function Player({ src, onExhausted }) {

  const videoRef = useRef(null);

  const hlsRef = useRef(null);

  const retriesRef = useRef(0);

  const [status, setStatus] = useState('loading'); // loading | playing | retrying | unavailable
  const [branding, setBranding] = useState({ watermarkEnabled: true, watermarkUrl: '', watermarkPosition: 'top-left', watermarkOpacity: 0.72, watermarkSize: 42 });

  useEffect(() => {
    let alive = true;
    fetch('/api/settings').then(r => r.ok ? r.json() : null).then(data => { if (alive && data) setBranding(data); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {

    if (!src) return;

    let cancelled = false;

    retriesRef.current = 0;

    setStatus('loading');

    async function attach() {

      const video = videoRef.current;

      if (!video) return;

      cleanup();

      /*
       * Real IPTV links very often carry NO ".m3u8" extension
       * at all (e.g. server.com/live/user/pass/12345) even
       * though the content IS an HLS stream - checking the URL
       * suffix alone silently sent most of those straight to
       * native <video src=...>, which can't play a manifest it
       * doesn't recognize. Flipped the logic: assume HLS unless
       * the URL clearly points at a format the browser already
       * plays natively (mp4/webm/etc), and let hls.js's own
       * manifest parsing be the real judge - it fails cleanly
       * (triggering the existing retry/failover) instead of
       * silently doing nothing.
       */

      const KNOWN_NATIVE_RE =
        /\.(mp4|webm|ogg|mov|m4v)($|\?)/i;

      const looksHls =
        !KNOWN_NATIVE_RE.test(src);

      const nativeHlsSupport =
        video.canPlayType('application/vnd.apple.mpegurl');

      if (looksHls && !nativeHlsSupport) {

        const Hls = (await import('hls.js')).default;

        if (cancelled) return;

        if (!Hls.isSupported()) {

          setStatus('unavailable');

          onExhausted?.();

          return;

        }

        const hls = new Hls({
          maxBufferLength: 30,
          enableWorker: true
        });

        hlsRef.current = hls;

        hls.on(Hls.Events.ERROR, (_, data) => {

          if (!data.fatal) return;

          handleFailure();

        });

        hls.loadSource(src);

        hls.attachMedia(video);

      }

      else {

        video.src = src;

      }

      video.play().catch(() => {

        // Autoplay can be blocked until the user interacts -
        // this is not a stream failure, so it does NOT count
        // against the retry budget.
        setStatus('playing');

      });

    }

    function handleFailure() {

      if (cancelled) return;

      retriesRef.current += 1;

      if (retriesRef.current > MAX_RETRIES) {

        setStatus('unavailable');

        onExhausted?.();

        return;

      }

      setStatus('retrying');

      setTimeout(() => {

        if (!cancelled) attach();

      }, RETRY_DELAY_MS);

    }

    function cleanup() {

      if (hlsRef.current) {

        hlsRef.current.destroy();

        hlsRef.current = null;

      }

    }

    const video = videoRef.current;

    const onPlaying = () => !cancelled && setStatus('playing');

    const onError = () => handleFailure();

    video?.addEventListener('playing', onPlaying);
    video?.addEventListener('error', onError);

    attach();

    return () => {

      cancelled = true;

      cleanup();

      video?.removeEventListener('playing', onPlaying);
      video?.removeEventListener('error', onError);

      if (video) {
        video.removeAttribute('src');
        video.load();
      }

    };

  }, [src]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        controls
        playsInline
        autoPlay
        muted={false}
      />

      {/*
       * NexLive watermark - small, semi-transparent, corner
       * placement so it never blocks native video controls.
       * pointer-events-none keeps taps/clicks passing through
       * to the video/controls underneath it.
       */}

      {branding.watermarkEnabled !== false && (
        branding.watermarkUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={branding.watermarkUrl}
            alt=""
            className={`pointer-events-none absolute z-10 object-contain ${branding.watermarkPosition === 'top-right' ? 'right-3 top-3' : branding.watermarkPosition === 'bottom-right' ? 'bottom-14 right-3' : branding.watermarkPosition === 'bottom-left' ? 'bottom-14 left-3' : 'left-3 top-3'}`}
            style={{ width: Number(branding.watermarkSize) || 42, opacity: Number(branding.watermarkOpacity) || 0.72 }}
          />
        ) : (
          <div className="pointer-events-none absolute left-3 top-3 z-10" style={{ opacity: Number(branding.watermarkOpacity) || 0.72 }}>
            <Logo size={Number(branding.watermarkSize) || 42} iconOnly />
          </div>
        )
      )}

      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-nex-red border-t-transparent" />
        </div>
      )}

      {status === 'retrying' && (
        <div className="absolute inset-x-0 bottom-0 bg-black/80 px-4 py-2 text-center text-xs text-nex-muted">
          Reconnecting… (attempt {retriesRef.current}/{MAX_RETRIES})
        </div>
      )}

      {status === 'unavailable' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/90 px-6 text-center">
          <p className="font-semibold text-nex-text">This channel is temporarily unavailable.</p>
          <p className="text-xs text-nex-muted">It hasn&apos;t been removed - try again in a bit, or pick another channel.</p>
        </div>
      )}
    </div>
  );

}
