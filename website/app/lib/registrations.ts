import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  normalizeSubmission,
  type RegistrationRecord,
  type RegistrationSubmission,
} from "./registration-schema";

const registrationsFilePath = path.join(process.cwd(), "data", "registrations.json");

async function ensureStorageFile() {
  await mkdir(path.dirname(registrationsFilePath), { recursive: true });

  try {
    await readFile(registrationsFilePath, "utf8");
  } catch {
    await writeFile(registrationsFilePath, "[]\n", "utf8");
  }
}

async function readRegistrations(): Promise<RegistrationRecord[]> {
  await ensureStorageFile();

  try {
    const content = await readFile(registrationsFilePath, "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeRecord).filter((record): record is RegistrationRecord => Boolean(record));
  } catch {
    return [];
  }
}

async function writeRegistrations(registrations: RegistrationRecord[]) {
  await ensureStorageFile();
  await writeFile(registrationsFilePath, `${JSON.stringify(registrations, null, 2)}\n`, "utf8");
}

function normalizeRecord(value: unknown): RegistrationRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  const representativeName =
    typeof candidate.representativeName === "string"
      ? candidate.representativeName
      : typeof candidate.name === "string"
        ? candidate.name
        : "";

  const representativeEmail =
    typeof candidate.representativeEmail === "string"
      ? candidate.representativeEmail
      : typeof candidate.email === "string"
        ? candidate.email
        : "";

  const representativePhone =
    typeof candidate.representativePhone === "string"
      ? candidate.representativePhone
      : typeof candidate.phone === "string"
        ? candidate.phone
        : "";

  if (
    typeof candidate.teamName !== "string" ||
    typeof candidate.schoolClass !== "string" ||
    !representativeName ||
    !representativeEmail ||
    !representativePhone
  ) {
    return null;
  }

  const rawMembers =
    Array.isArray(candidate.memberNames) && candidate.memberNames.every((entry) => typeof entry === "string")
      ? candidate.memberNames
      : [];

  const githubUrl = typeof candidate.githubUrl === "string" ? candidate.githubUrl : "";

  return {
    id: typeof candidate.id === "string" ? candidate.id : randomUUID(),
    submittedAt:
      typeof candidate.submittedAt === "string" ? candidate.submittedAt : new Date().toISOString(),
    representativeName,
    representativeEmail,
    representativePhone,
    schoolClass: candidate.schoolClass,
    teamName: candidate.teamName,
    githubUrl,
    memberNames: rawMembers.map((member) => member.trim()).filter(Boolean),
  };
}

export async function getRegistrations() {
  return readRegistrations();
}

export async function addRegistration(values: RegistrationSubmission) {
  const registrations = await readRegistrations();
  const normalized = normalizeSubmission(values);
  const record: RegistrationRecord = {
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    ...normalized,
  };

  registrations.unshift(record);
  await writeRegistrations(registrations);

  return record;
}