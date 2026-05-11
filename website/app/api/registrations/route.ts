import { NextResponse } from "next/server";
import {
  addRegistration,
  getRegistrations,
} from "../../lib/registrations";
import {
  getTeamStudentCount,
  hasRegistrationErrors,
  normalizeSubmission,
  validateRegistration,
  type RegistrationSubmission,
} from "../../lib/registration-schema";

export const runtime = "nodejs";

export async function GET() {
  const registrations = await getRegistrations();
  const teamCount = registrations.length;
  const studentCount = registrations.reduce(
    (total, registration) => total + getTeamStudentCount(registration),
    0,
  );

  return NextResponse.json({
    registrations,
    count: teamCount,
    teamCount,
    studentCount,
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as RegistrationSubmission | null;

  if (!payload) {
    return NextResponse.json({ error: "Invalid registration payload" }, { status: 400 });
  }

  const validation = validateRegistration(payload);
  if (hasRegistrationErrors(validation)) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields", ...validation },
      { status: 400 },
    );
  }

  const registration = await addRegistration(normalizeSubmission(payload));

  return NextResponse.json({ registration }, { status: 201 });
}