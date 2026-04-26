"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/voice-demo.mp3";

export function VoiceDemo() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onTime = () => setCurrent(audio.currentTime);
    const onEnd = () => {
      setPlaying(false);
      setCurrent(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  };

  const progress = duration && duration > 0 ? (current / duration) * 100 : 0;

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 pt-4 pb-24 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[420px] bg-[radial-gradient(ellipse_45%_50%_at_50%_50%,rgba(16,185,129,0.08),transparent_75%)] mix-blend-screen"
      />

      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-emerald-400/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
              Hear it for yourself
            </p>
          </div>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl">
            A real call,{" "}
            <span className="font-accent italic font-normal text-zinc-400">
              start to finish.
            </span>
          </h2>
        </div>
        <p className="max-w-[260px] text-[15px] leading-[1.6] font-light text-zinc-400 md:text-right">
          Sixty seconds. Buyer qualified, showing booked.
        </p>
      </div>

      <div className="group relative overflow-hidden rounded-3xl border border-white/6 bg-linear-to-br from-emerald-950/25 via-zinc-950/60 to-black p-6 transition-all duration-500 ease-out hover:border-white/12 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] sm:p-8 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.14),transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_70%,rgba(16,185,129,0.08),transparent_60%)]"
        />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:gap-10">
          <div className="flex shrink-0 items-center gap-5">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause demo" : "Play demo"}
              aria-pressed={playing}
              className="group/btn relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-black shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out hover:scale-[1.04] hover:bg-zinc-100 hover:shadow-[0_0_70px_-12px_rgba(255,255,255,0.55)] active:scale-[0.98] sm:h-24 sm:w-24"
            >
              {playing && (
                <>
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping-slow"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping-slow"
                    style={{ animationDelay: "0.6s" }}
                  />
                </>
              )}
              <span className="relative z-10 flex items-center justify-center">
                {playing ? (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                    className="translate-x-[1px]"
                  >
                    <path d="M7 4.5v15a1 1 0 0 0 1.55.83l11-7.5a1 1 0 0 0 0-1.66l-11-7.5A1 1 0 0 0 7 4.5z" />
                  </svg>
                )}
              </span>
            </button>

            <div className="md:hidden">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">
                Demo · Inbound call
              </p>
              <p className="mt-1 font-mono text-xs text-zinc-500">
                {formatTime(current)}
                <span className="text-zinc-700">
                  {" / "}
                  {duration ? formatTime(duration) : "0:00"}
                </span>
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="hidden items-center justify-between md:flex">
              <div className="flex items-center gap-2.5">
                <span
                  className={
                    "h-1.5 w-1.5 rounded-full transition-all " +
                    (playing
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                      : "bg-zinc-600")
                  }
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-300">
                  {playing ? "Playing demo" : "Demo · Inbound call"}
                </p>
              </div>
              <p className="font-mono text-xs text-zinc-500">
                {formatTime(current)}
                <span className="text-zinc-700">
                  {" / "}
                  {duration ? formatTime(duration) : "0:00"}
                </span>
              </p>
            </div>

            <Waveform playing={playing} progress={progress} />

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-zinc-400">
              <span className="inline-flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400"
                  aria-hidden
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Inbound · buyer inquiry
              </span>
              <span className="hidden h-3 w-px bg-white/10 sm:inline-block" />
              <span className="font-light">
                Outcome:{" "}
                <span className="font-accent italic text-emerald-400/90">
                  showing booked
                </span>
              </span>
            </div>
          </div>
        </div>

        <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />
      </div>
    </section>
  );
}

function Waveform({
  playing,
  progress,
}: {
  playing: boolean;
  progress: number;
}) {
  return (
    <div className="mt-3 flex h-16 items-center gap-[3px] sm:h-20 sm:gap-1">
      {WAVE_BARS.map((h, i) => {
        const barPos = (i / (WAVE_BARS.length - 1)) * 100;
        const isPast = barPos <= progress;
        return (
          <span
            key={i}
            aria-hidden
            className={
              "flex-1 rounded-full transition-colors duration-300 " +
              (isPast
                ? "bg-linear-to-t from-emerald-500/70 via-emerald-400 to-emerald-300"
                : "bg-white/15")
            }
            style={{
              height: `${h}%`,
              animation: playing
                ? `wave-pulse ${1.1 + (i % 7) * 0.07}s ease-in-out ${
                    (i % 11) * 0.04
                  }s infinite alternate`
                : undefined,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes wave-pulse {
          0% {
            transform: scaleY(0.55);
          }
          100% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const WAVE_BARS = [
  22, 38, 54, 30, 68, 44, 80, 58, 36, 70, 50, 86, 62, 40, 74, 48, 90, 66, 42,
  78, 54, 84, 60, 38, 72, 46, 88, 64, 40, 76, 52, 82, 58, 34, 70, 44, 80, 56,
  30, 66, 50, 86, 60, 36, 72, 46, 78, 54, 28, 64, 48, 82,
];
