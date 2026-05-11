"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  MAX_MEMBER_COUNT,
  hasRegistrationErrors,
  validateRegistration,
  type RegistrationSubmission,
} from "../lib/registration-schema";

const initialData: RegistrationSubmission = {
  representativeName: "",
  representativeEmail: "",
  representativePhone: "",
  schoolClass: "",
  teamName: "",
  githubUrl: "",
  memberNames: [""],
};

export function RegistrationForm() {
  const [formData, setFormData] = useState<RegistrationSubmission>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationSubmission, string>>>({});
  const [memberErrors, setMemberErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setSubmitError("");
  };

  const onMemberChange = (index: number, value: string) => {
    setFormData((previous) => ({
      ...previous,
      memberNames: previous.memberNames.map((member, memberIndex) =>
        memberIndex === index ? value : member,
      ),
    }));

    setMemberErrors((previous) =>
      previous.map((error, errorIndex) => (errorIndex === index ? "" : error)),
    );
    setErrors((previous) => ({ ...previous, memberNames: undefined }));
    setSubmitError("");
  };

  const addMemberField = () => {
    setFormData((previous) => {
      if (previous.memberNames.length >= MAX_MEMBER_COUNT) {
        return previous;
      }

      return {
        ...previous,
        memberNames: [...previous.memberNames, ""],
      };
    });
  };

  const removeMemberField = (index: number) => {
    setFormData((previous) => ({
      ...previous,
      memberNames: previous.memberNames.filter((_, memberIndex) => memberIndex !== index),
    }));
    setMemberErrors((previous) => previous.filter((_, memberIndex) => memberIndex !== index));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateRegistration(formData);
    setErrors(validation.fieldErrors);
    setMemberErrors(validation.memberErrors);

    if (hasRegistrationErrors(validation)) {
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Failed to save registration");
      }

      setSubmitted(true);
      setFormData(initialData);
      setMemberErrors([]);
    } catch (error) {
      setSubmitted(false);
      setSubmitError(error instanceof Error ? error.message : "Failed to save registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Representative Name"
          name="representativeName"
          value={formData.representativeName}
          onChange={onChange}
          error={errors.representativeName}
        />
        <InputField
          label="Representative Email"
          name="representativeEmail"
          value={formData.representativeEmail}
          onChange={onChange}
          error={errors.representativeEmail}
          type="email"
        />
        <InputField
          label="School/Class"
          name="schoolClass"
          value={formData.schoolClass}
          onChange={onChange}
          error={errors.schoolClass}
        />
        <InputField
          label="Team Name"
          name="teamName"
          value={formData.teamName}
          onChange={onChange}
          error={errors.teamName}
        />
      </div>

      <InputField
        label="Representative Phone"
        name="representativePhone"
        value={formData.representativePhone}
        onChange={onChange}
        error={errors.representativePhone}
      />

      <InputField
        label="GitHub Project Repository"
        name="githubUrl"
        value={formData.githubUrl}
        onChange={onChange}
        error={errors.githubUrl}
        placeholder="https://github.com/owner/repository"
      />

      <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">Team Members</p>
            <p className="text-xs text-white/60">
              Add 1 to 3 members. Team size will be 2 to 4 including the representative.
            </p>
          </div>
          <button
            type="button"
            onClick={addMemberField}
            disabled={formData.memberNames.length >= MAX_MEMBER_COUNT}
            className="rounded-lg border border-[#00D9FF]/40 px-3 py-1.5 text-xs font-semibold text-[#00D9FF] transition hover:bg-[#00D9FF]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Member
          </button>
        </div>

        {formData.memberNames.map((member, index) => (
          <div key={`member-${index}`} className="flex items-start gap-2">
            <div className="flex-1">
              <label className="block text-sm">
                <span className="mb-1 block text-white/80">Member {index + 1} Name</span>
                <input
                  className="w-full rounded-xl border border-white/20 bg-[#050816]/80 px-3 py-2 text-white outline-none transition focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
                  value={member}
                  onChange={(event) => onMemberChange(index, event.target.value)}
                />
              </label>
              {memberErrors[index] ? (
                <span className="mt-1 block text-xs text-red-300">{memberErrors[index]}</span>
              ) : null}
            </div>
            {formData.memberNames.length > 1 ? (
              <button
                type="button"
                onClick={() => removeMemberField(index)}
                className="mt-7 rounded-lg border border-white/20 px-3 py-2 text-xs text-white/75 transition hover:border-[#FF3CAC] hover:text-[#FF3CAC]"
              >
                Remove
              </button>
            ) : null}
          </div>
        ))}

        {errors.memberNames ? (
          <p className="text-xs text-red-300">{errors.memberNames}</p>
        ) : null}
      </div>

      <p className="text-xs text-white/60">
        Representative + members = total team size. Example: 1 representative + 3 members = 4 students.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#7B2FF7] to-[#FF3CAC] px-4 py-3 font-semibold text-[#050816] shadow-[0_0_20px_rgba(0,217,255,0.35)] transition hover:opacity-90"
      >
        {isSubmitting ? "Saving..." : "Submit Registration"}
      </button>

      {submitted ? (
        <p className="text-sm text-green-300">
          Registration submitted successfully. View all submissions at /admin/registrations.
        </p>
      ) : null}
      {submitError ? <p className="text-sm text-red-300">{submitError}</p> : null}
    </form>
  );
}

type InputFieldName =
  | "representativeName"
  | "representativeEmail"
  | "representativePhone"
  | "schoolClass"
  | "teamName"
  | "githubUrl";

type InputFieldProps = {
  label: string;
  name: InputFieldName;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
};

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: InputFieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-white/80">{label}</span>
      <input
        className="w-full rounded-xl border border-white/20 bg-[#050816]/80 px-3 py-2 text-white outline-none transition focus:border-[#00D9FF] focus:shadow-[0_0_15px_rgba(0,217,255,0.25)]"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
