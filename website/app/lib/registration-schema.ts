export type RegistrationSubmission = {
  representativeName: string;
  representativeEmail: string;
  representativePhone: string;
  schoolClass: string;
  teamName: string;
  githubUrl: string;
  memberNames: string[];
};

export type RegistrationRecord = RegistrationSubmission & {
  id: string;
  submittedAt: string;
};

export type RegistrationValidationResult = {
  fieldErrors: Partial<Record<keyof RegistrationSubmission, string>>;
  memberErrors: string[];
};

export const MIN_MEMBER_COUNT = 1;
export const MAX_MEMBER_COUNT = 3;

export function validateRegistration(values: RegistrationSubmission): RegistrationValidationResult {
  const fieldErrors: Partial<Record<keyof RegistrationSubmission, string>> = {};

  if (!values.representativeName.trim()) fieldErrors.representativeName = "Representative name is required";

  if (!values.representativeEmail.trim()) {
    fieldErrors.representativeEmail = "Representative email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.representativeEmail)) {
    fieldErrors.representativeEmail = "Enter a valid email address";
  }

  if (!values.representativePhone.trim()) {
    fieldErrors.representativePhone = "Representative phone is required";
  } else if (!/^[0-9+\-\s()]{7,}$/.test(values.representativePhone)) {
    fieldErrors.representativePhone = "Enter a valid phone number";
  }

  if (!values.schoolClass.trim()) {
    fieldErrors.schoolClass = "School/Class is required";
  }

  if (!values.teamName.trim()) {
    fieldErrors.teamName = "Team name is required";
  }

  if (!values.githubUrl.trim()) {
    fieldErrors.githubUrl = "GitHub project link is required";
  } else if (!isValidGithubRepositoryUrl(values.githubUrl)) {
    fieldErrors.githubUrl = "Enter a valid GitHub repository URL";
  }

  const memberErrors = values.memberNames.map((member) =>
    member.trim() ? "" : "Member name is required",
  );

  const nonEmptyMembers = values.memberNames.filter((member) => member.trim()).length;
  if (nonEmptyMembers < MIN_MEMBER_COUNT) {
    fieldErrors.memberNames = "Add at least 1 member (team size: 2 to 4 including representative)";
  } else if (nonEmptyMembers > MAX_MEMBER_COUNT) {
    fieldErrors.memberNames = "You can add at most 3 members";
  }

  return { fieldErrors, memberErrors };
}

export function hasRegistrationErrors(result: RegistrationValidationResult) {
  return (
    Object.keys(result.fieldErrors).length > 0 ||
    result.memberErrors.some((memberError) => Boolean(memberError))
  );
}

export function normalizeSubmission(values: RegistrationSubmission): RegistrationSubmission {
  return {
    representativeName: values.representativeName.trim(),
    representativeEmail: values.representativeEmail.trim(),
    representativePhone: values.representativePhone.trim(),
    schoolClass: values.schoolClass.trim(),
    teamName: values.teamName.trim(),
    githubUrl: values.githubUrl.trim(),
    memberNames: values.memberNames.map((member) => member.trim()).filter(Boolean),
  };
}

export function getTeamStudentCount(registration: Pick<RegistrationSubmission, "memberNames">) {
  return 1 + registration.memberNames.length;
}

function isValidGithubRepositoryUrl(value: string) {
  try {
    const url = new URL(value.trim());
    if (url.hostname !== "github.com") {
      return false;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    return pathParts.length >= 2;
  } catch {
    return false;
  }
}