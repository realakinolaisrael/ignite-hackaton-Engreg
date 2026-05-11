"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Code2,
  Globe,
  Link,
  MapPin,
  Menu,
  Phone,
  School,
  Send,
  Share2,
  Sparkles,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { GlowCard } from "./GlowCard";
import { RegistrationForm } from "./RegistrationForm";
import { StatsCounter } from "./StatsCounter";

const navItems = [
  { href: "#about", label: "About" },
  { href: "#details", label: "Details" },
  { href: "#prizes", label: "Prizes" },
  { href: "#timeline", label: "Timeline" },
  { href: "#register", label: "Register" },
  { href: "/admin/registrations", label: "Admin" },
  { href: "#contact", label: "Contact" },
];

const detailItems = [
  { title: "Eligibility", value: "SS2 Students", icon: School },
  { title: "Format", value: "Team Coding", icon: Code2 },
  { title: "Duration", value: "10 Weeks", icon: Clock3 },
  { title: "Period", value: "11 May – 17 July", icon: CalendarDays },
  { title: "Organizer", value: "HLTS Limited", icon: Zap },
  { title: "Focus", value: "Innovation & Teamwork", icon: Users },
];

const timeline = [
  "Registration Opens",
  "Team Formation",
  "Training Sessions",
  "Coding Challenge",
  "Final Presentation",
  "Winner Announcement",
];

const galleryItems = [
  "Students Coding",
  "Innovation Sessions",
  "Team Collaboration",
  "Tech Workshops",
  "Mentorship",
  "Demo Day",
];

const socialLinks = [
  { label: "Instagram", icon: Share2 },
  { label: "X/Twitter", icon: Send },
  { label: "LinkedIn", icon: Link },
  { label: "YouTube", icon: Globe },
];

export function HackathonLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveStats, setLiveStats] = useState({ studentCount: 0, teamCount: 0 });

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch("/api/registrations", { cache: "no-store" });
        const payload = (await response.json()) as {
          studentCount?: number;
          teamCount?: number;
        };

        if (!cancelled) {
          setLiveStats({
            studentCount: Number.isFinite(payload.studentCount) ? payload.studentCount ?? 0 : 0,
            teamCount: Number.isFinite(payload.teamCount) ? payload.teamCount ?? 0 : 0,
          });
        }
      } catch {
        if (!cancelled) {
          setLiveStats((previous) => previous);
        }
      }
    }

    loadStats();
    const intervalId = window.setInterval(loadStats, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#050816] text-[#F5F5F5]">
      <BackgroundEffects />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/70 backdrop-blur-lg">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="font-heading text-sm sm:text-base">
            <span className="bg-gradient-to-r from-[#00D9FF] via-[#7B2FF7] to-[#FF3CAC] bg-clip-text text-transparent">
              IGNITE INNOVATION 2026
            </span>
          </a>
          <div className="hidden items-center gap-5 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/80 transition hover:text-[#00D9FF]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="rounded-lg border border-white/20 p-2 text-white md:hidden"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        {mobileMenuOpen ? (
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 pb-4 md:hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <main>
        <section className="relative mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 pt-14 sm:pb-20 sm:pt-20 md:grid-cols-[1.3fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#00D9FF]">
              <Sparkles size={14} /> Official Event • SS2 Exclusive
            </p>
            <h1 className="font-heading text-4xl leading-tight sm:text-5xl md:text-6xl">
              <span className="block">IGNITE INNOVATION 2026</span>
              <span className="mt-2 block bg-gradient-to-r from-[#00D9FF] via-[#7B2FF7] to-[#FF3CAC] bg-clip-text text-3xl text-transparent sm:text-4xl">
                HACKATHON
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
              Empowering Young Innovators Through Technology. A cyberpunk-inspired
              challenge where students build bold ideas, collaborate in teams, and
              solve real-world problems with code.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#register"
                className="rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#7B2FF7] to-[#FF3CAC] px-5 py-3 font-semibold text-[#050816] shadow-[0_0_20px_rgba(0,217,255,0.4)] transition hover:-translate-y-0.5"
              >
                Register Now
              </a>
              <a
                href="#about"
                className="rounded-xl border border-[#00D9FF]/50 px-5 py-3 font-semibold text-[#00D9FF] transition hover:bg-[#00D9FF]/10"
              >
                Learn More
              </a>
            </div>
          </motion.div>
          <GlowCard className="self-start">
            <h2 className="font-heading text-lg">Countdown to Event Start</h2>
            <p className="mb-4 mt-1 text-sm text-white/70">11 May 2026</p>
            <CountdownTimer targetDate="2026-05-11T09:00:00+01:00" />
          </GlowCard>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-3 px-4 pb-12 sm:grid-cols-3 sm:pb-16">
          <StatsCounter label="Registered Students" value={liveStats.studentCount} suffix="" />
          <StatsCounter label="Innovation Teams" value={liveStats.teamCount} suffix="" />
          <StatsCounter label="Workshops" value={10} />
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <GlowCard className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#00D9FF]">
                Partnership
              </p>
              <h2 className="mt-2 font-heading text-2xl">
                HLTS Limited × Engreg High School
              </h2>
              <p className="mt-2 text-white/75">
                In partnership with Engreg High School to mentor and empower the next
                generation of innovative builders.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex min-h-24 items-center justify-center rounded-xl border border-white/10 bg-[#00D9FF]/10 font-semibold">
                HLTS Limited
              </div>
              <div className="flex min-h-24 items-center justify-center rounded-xl border border-white/10 bg-[#FF3CAC]/10 font-semibold">
                Engreg High School
              </div>
            </div>
          </GlowCard>
        </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <GlowCard>
            <h2 className="font-heading text-2xl">About the Hackathon</h2>
            <p className="mt-3 text-white/80">
              IGNITE INNOVATION 2026 is a student-focused technology hackathon built
              around innovation, coding, teamwork, and creativity. Students
              collaborate in teams to design and build impactful solutions while
              developing confidence in modern digital skills.
            </p>
          </GlowCard>
        </section>

        <section id="details" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <h2 className="mb-5 font-heading text-2xl">Event Details</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detailItems.map((item) => (
              <GlowCard key={item.title} className="flex items-start gap-3">
                <item.icon className="mt-0.5 text-[#00D9FF]" />
                <div>
                  <p className="text-sm text-white/65">{item.title}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        <section id="prizes" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <h2 className="mb-5 font-heading text-2xl">Prize Pool</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <GlowCard className="border-[#00D9FF]/40 bg-gradient-to-br from-[#00D9FF]/10 to-transparent">
              <Trophy className="mb-3 text-[#00D9FF]" />
              <p className="text-sm text-white/70">1st Position • Grand Champion</p>
              <p className="mt-1 text-3xl font-bold">₦80,000</p>
              <p className="text-white/80">Certificate of Excellence</p>
            </GlowCard>
            <GlowCard className="border-[#FF3CAC]/40 bg-gradient-to-br from-[#FF3CAC]/10 to-transparent">
              <Trophy className="mb-3 text-[#FF3CAC]" />
              <p className="text-sm text-white/70">2nd Position • 1st Runner Up</p>
              <p className="mt-1 text-3xl font-bold">₦40,000</p>
              <p className="text-white/80">Certificate of Merit</p>
            </GlowCard>
          </div>
        </section>

        <section id="timeline" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <h2 className="mb-5 font-heading text-2xl">Timeline</h2>
          <GlowCard>
            <TimelineList />
          </GlowCard>
        </section>

        <section id="register" className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <h2 className="mb-5 font-heading text-2xl">Register Your Team</h2>
          <RegistrationForm />
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-16">
          <h2 className="mb-5 font-heading text-2xl">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((title) => (
              <GlowCard
                key={title}
                className="min-h-36 bg-gradient-to-br from-white/5 to-[#7B2FF7]/20"
              >
                <p className="text-sm text-white/70">Placeholder</p>
                <p className="mt-1 text-lg font-semibold">{title}</p>
              </GlowCard>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-white/10 bg-black/30">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-2">
          <div>
            <h2 className="font-heading text-xl">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#00D9FF]" /> Venue: Engreg High
                School
              </li>
              <li className="flex items-center gap-2">
                <Zap size={16} className="text-[#00D9FF]" /> Registration Status:
                Open Now
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#00D9FF]" /> +234 XXX XXX XXXX
              </li>
              <li className="flex items-center gap-2">
                <Globe size={16} className="text-[#00D9FF]" /> www.hltsltd.com
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-heading text-xl">Follow Us</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  className="rounded-lg border border-white/20 bg-white/5 p-3 transition hover:border-[#00D9FF]"
                  aria-label={item.label}
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
            <a
              href="/admin/registrations"
              className="mt-4 inline-flex rounded-lg border border-[#00D9FF]/30 bg-[#00D9FF]/10 px-4 py-2 text-sm font-medium text-[#00D9FF] transition hover:border-[#00D9FF] hover:bg-[#00D9FF]/15"
            >
              View registrations
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BackgroundEffects() {
  const particles = Array.from({ length: 12 }, (_, index) => ({
    id: index,
    top: `${(index * 9) % 100}%`,
    left: `${(index * 13) % 100}%`,
    duration: 7 + (index % 6),
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(123,47,247,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,217,255,0.09)_1px,transparent_1px)] bg-[size:45px_45px]" />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#7B2FF7]/25 blur-3xl" />
      <div className="absolute -right-20 top-52 h-72 w-72 rounded-full bg-[#FF3CAC]/25 blur-3xl" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#00D9FF]"
          style={{ top: particle.top, left: particle.left }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function TimelineList() {
  const [items, setItems] = useState<{ id: string; title: string; started: boolean }[]>(
    timeline.map((t, i) => ({ id: String(i), title: t, started: false })),
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/timeline", { cache: "no-store" });
        const payload = (await res.json().catch(() => null)) as { timeline?: { id: string; title: string; started: boolean; updatedAt: string }[] } | null;
        if (!cancelled && payload && Array.isArray(payload.timeline)) {
          setItems(payload.timeline.map((it) => ({ id: it.id, title: it.title, started: !!it.started })));
        }
      } catch {
        // keep defaults
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ol className="space-y-4 border-l-2 border-[#7B2FF7]/60 pl-6">
      {items.map((step) => (
        <li key={step.id} className="relative flex items-center gap-3">
          <span
            className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full shadow-[0_0_10px] ${
              step.started ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : "bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"
            }`}
          />
          <p className="font-medium">{step.title}</p>
          {step.started ? <span className="ml-2 rounded-full bg-green-600/20 px-2 py-0.5 text-xs text-green-300">Started</span> : null}
        </li>
      ))}
    </ol>
  );
}
