"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, ExternalLink, Eye, EyeOff, Lock, Mail, Phone, School, Users } from "lucide-react";
import { getTeamStudentCount, type RegistrationRecord } from "../lib/registration-schema";

const ADMIN_PIN = "2026";
const ADMIN_SESSION_KEY = "ignite-admin-unlocked";

type ProjectStatus = {
  state: "reachable" | "invalid" | "missing" | "error";
  message: string;
  lastPush?: string;
};

function parseGithubRepo(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) {
      return null;
    }

    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export default function AdminRegistrationsGate() {
  const [pin, setPin] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(ADMIN_SESSION_KEY) === ADMIN_PIN,
  );
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [projectStatuses, setProjectStatuses] = useState<Record<string, ProjectStatus>>({});

  useEffect(() => {
    if (!isUnlocked) {
      return;
    }

    let cancelled = false;

    async function loadRegistrations() {
      setIsLoading(true);

      try {
        const response = await fetch("/api/registrations", { cache: "no-store" });
        const payload = (await response.json()) as { registrations?: RegistrationRecord[] };

        if (!cancelled) {
          setRegistrations(Array.isArray(payload.registrations) ? payload.registrations : []);
        }
      } catch {
        if (!cancelled) {
          setRegistrations([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      cancelled = true;
    };
  }, [isUnlocked]);

  useEffect(() => {
    if (!isUnlocked || registrations.length === 0) {
      return;
    }

    let cancelled = false;

    async function refreshProjectStatuses() {
      const entries = await Promise.all(
        registrations.map(async (registration) => {
          if (!registration.githubUrl.trim()) {
            return [
              registration.id,
              { state: "invalid", message: "No GitHub link" } satisfies ProjectStatus,
            ] as const;
          }

          const parsed = parseGithubRepo(registration.githubUrl);
          if (!parsed) {
            return [
              registration.id,
              { state: "invalid", message: "Invalid GitHub URL" } satisfies ProjectStatus,
            ] as const;
          }

          try {
            const response = await fetch(
              `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
              {
                headers: {
                  Accept: "application/vnd.github+json",
                },
              },
            );

            if (response.status === 404) {
              return [
                registration.id,
                { state: "missing", message: "Repository not found" } satisfies ProjectStatus,
              ] as const;
            }

            if (!response.ok) {
              return [
                registration.id,
                { state: "error", message: "Unable to monitor" } satisfies ProjectStatus,
              ] as const;
            }

            const repo = (await response.json()) as { pushed_at?: string };
            return [
              registration.id,
              {
                state: "reachable",
                message: "Live",
                lastPush: repo.pushed_at,
              } satisfies ProjectStatus,
            ] as const;
          } catch {
            return [
              registration.id,
              { state: "error", message: "Check failed" } satisfies ProjectStatus,
            ] as const;
          }
        }),
      );

      if (cancelled) {
        return;
      }

      setProjectStatuses(Object.fromEntries(entries));
    }

    refreshProjectStatuses();
    const intervalId = window.setInterval(refreshProjectStatuses, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isUnlocked, registrations]);

  const unlock = () => {
    if (pin !== ADMIN_PIN) {
      setError("Incorrect PIN. Try again.");
      return;
    }

    sessionStorage.setItem(ADMIN_SESSION_KEY, ADMIN_PIN);
    setError("");
    setIsUnlocked(true);
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setPin("");
    setIsUnlocked(false);
    setRegistrations([]);
    setProjectStatuses({});
  };

  if (!isUnlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050816] px-4 text-[#F5F5F5]">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-lg sm:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#00D9FF]">Admin Access</p>
          <h1 className="mt-2 font-heading text-3xl">Enter PIN</h1>
          <p className="mt-2 text-sm text-white/70">
            Use the admin PIN to view registered students.
          </p>

          <div className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block text-white/80">PIN</span>
              <div className="relative">
                <input
                  value={pin}
                  onChange={(event) => {
                    setPin(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      unlock();
                    }
                  }}
                  type={showPin ? "text" : "password"}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="w-full rounded-xl border border-white/20 bg-[#050816]/80 px-3 py-3 pr-12 text-white outline-none transition focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                  placeholder="Enter 4-digit PIN"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((previous) => !previous)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-white/60 transition hover:text-white"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <button
              type="button"
              onClick={unlock}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#7B2FF7] to-[#FF3CAC] px-4 py-3 font-semibold text-[#050816] shadow-[0_0_20px_rgba(0,217,255,0.35)] transition hover:opacity-90"
            >
              <Lock size={16} />
              Sign In
            </button>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/80 transition hover:border-[#00D9FF] hover:text-[#00D9FF]"
            >
              Back to homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-10 text-[#F5F5F5]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#00D9FF]">
              Admin Dashboard
            </p>
            <h1 className="mt-2 font-heading text-3xl">Registered Students</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              This page reads the saved submissions from the local registrations store.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={logout}
              className="inline-flex rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-[#FF3CAC] hover:text-[#FF3CAC]"
            >
              Sign out
            </button>
            <Link
              href="/"
              className="inline-flex rounded-xl border border-[#00D9FF]/40 bg-[#00D9FF]/10 px-4 py-2 text-sm font-semibold text-[#00D9FF] transition hover:bg-[#00D9FF]/15"
            >
              Back to website
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={Users}
            label="Registered students"
            value={registrations
              .reduce((total, registration) => total + getTeamStudentCount(registration), 0)
              .toString()}
          />
          <SummaryCard icon={School} label="Innovation teams" value={registrations.length.toString()} />
          <SummaryCard
            icon={CalendarDays}
            label="Latest submission"
            value={registrations[0] ? formatDate(registrations[0].submittedAt) : "None yet"}
            wide
          />
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl">Submission List</h2>
              <p className="text-sm text-white/70">
                {registrations.length > 0
                  ? "All saved student registrations appear below."
                  : isLoading
                    ? "Loading registrations..."
                    : "No registrations have been saved yet."}
              </p>
            </div>
          </div>

          {registrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                  <tr className="text-white/60">
                    <th className="border-b border-white/10 px-4 py-3 font-medium">Team</th>
                    <th className="border-b border-white/10 px-4 py-3 font-medium">Representative</th>
                    <th className="border-b border-white/10 px-4 py-3 font-medium">Members</th>
                    <th className="border-b border-white/10 px-4 py-3 font-medium">School/Class</th>
                    <th className="border-b border-white/10 px-4 py-3 font-medium">GitHub Project</th>
                    <th className="border-b border-white/10 px-4 py-3 font-medium">Live Monitor</th>
                    <th className="border-b border-white/10 px-4 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="align-top">
                      <td className="border-b border-white/5 px-4 py-4 font-medium text-white">
                        <p>{registration.teamName}</p>
                        <p className="mt-1 text-xs text-white/65">
                          {getTeamStudentCount(registration)} students
                        </p>
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 text-white/80">
                        <p className="font-medium text-white">{registration.representativeName}</p>
                        <p className="mt-1 inline-flex items-center gap-2">
                          <Mail size={14} className="text-[#00D9FF]" />
                          {registration.representativeEmail}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-2">
                          <Phone size={14} className="text-[#00D9FF]" />
                          {registration.representativePhone}
                        </p>
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 text-white/80">
                        {registration.memberNames.length > 0 ? (
                          <ul className="space-y-1">
                            {registration.memberNames.map((memberName) => (
                              <li key={`${registration.id}-${memberName}`}>{memberName}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-white/60">No members added</span>
                        )}
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 text-white/80">
                        <span className="inline-flex items-center gap-2">
                          <School size={14} className="text-[#00D9FF]" />
                          {registration.schoolClass}
                        </span>
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 text-white/80">
                        <a
                          href={registration.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#00D9FF] underline-offset-2 transition hover:underline"
                        >
                          Open repository
                          <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 text-white/80">
                        <GitHubStatusBadge status={projectStatuses[registration.id]} />
                      </td>
                      <td className="border-b border-white/5 px-4 py-4 text-white/70">
                        {formatDate(registration.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-sm text-white/70">
              The registration list is empty right now. Once students submit the form,
              their entries will appear here.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type SummaryCardProps = {
  icon: typeof Users;
  label: string;
  value: string;
  wide?: boolean;
};

function SummaryCard({ icon: Icon, label, value, wide = false }: SummaryCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg ${wide ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-3 text-white/70">
        <span className="rounded-xl border border-[#00D9FF]/20 bg-[#00D9FF]/10 p-2 text-[#00D9FF]">
          <Icon size={18} />
        </span>
        <p className="text-sm">{label}</p>
      </div>
      <p className="mt-4 font-heading text-lg text-white sm:text-xl">{value}</p>
    </div>
  );
}

function GitHubStatusBadge({ status }: { status?: ProjectStatus }) {
  if (!status) {
    return <span className="text-xs text-white/60">Checking...</span>;
  }

  if (status.state === "reachable") {
    return (
      <div>
        <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-300">
          {status.message}
        </span>
        {status.lastPush ? (
          <p className="mt-1 text-xs text-white/65">Last push: {formatDate(status.lastPush)}</p>
        ) : null}
      </div>
    );
  }

  return (
    <span className="inline-flex rounded-full border border-red-300/30 bg-red-400/10 px-2 py-0.5 text-xs text-red-300">
      {status.message}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}