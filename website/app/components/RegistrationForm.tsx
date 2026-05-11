"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

type FormData = {
  name: string;
  email: string;
  schoolClass: string;
  teamName: string;
  phone: string;
};

const initialData: FormData = {
  name: "",
  email: "",
  schoolClass: "",
  teamName: "",
  phone: "",
};

export function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const nextErrors: Partial<FormData> = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!formData.schoolClass.trim())
      nextErrors.schoolClass = "School/Class is required";
    if (!formData.teamName.trim()) nextErrors.teamName = "Team name is required";
    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]{7,}$/.test(formData.phone)) {
      nextErrors.phone = "Enter a valid phone number";
    }
    return nextErrors;
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitted(Object.keys(nextErrors).length === 0);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          error={errors.name}
        />
        <InputField
          label="Email"
          name="email"
          value={formData.email}
          onChange={onChange}
          error={errors.email}
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
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        error={errors.phone}
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#7B2FF7] to-[#FF3CAC] px-4 py-3 font-semibold text-[#050816] shadow-[0_0_20px_rgba(0,217,255,0.35)] transition hover:opacity-90"
      >
        Submit Registration
      </button>
      {submitted ? (
        <p className="text-sm text-green-300">Registration submitted successfully.</p>
      ) : null}
    </form>
  );
}

type InputFieldProps = {
  label: string;
  name: keyof FormData;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
};

function InputField({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
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
      />
      {error ? <span className="mt-1 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
