import { type HTMLAttributes } from "react";

type GlowCardProps = HTMLAttributes<HTMLDivElement>;

export function GlowCard({ className = "", ...props }: GlowCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_0_30px_rgba(0,217,255,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_36px_rgba(255,60,172,0.28)] ${className}`}
      {...props}
    />
  );
}
