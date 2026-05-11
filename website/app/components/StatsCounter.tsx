"use client";

import { useEffect, useState } from "react";

type StatsCounterProps = {
  label: string;
  value: number;
  suffix?: string;
};

export function StatsCounter({ label, value, suffix = "" }: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 1200;
    const started = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur">
      <p className="text-2xl font-bold text-[#00D9FF] sm:text-3xl">
        {count}
        {suffix}
      </p>
      <p className="text-sm text-white/75">{label}</p>
    </div>
  );
}
