import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IGNITE INNOVATION 2026 HACKATHON",
  description:
    "IGNITE INNOVATION 2026 HACKATHON by HLTS Limited × Engreg High School. Empowering Young Innovators Through Technology.",
  keywords: [
    "Ignite Innovation 2026",
    "Hackathon",
    "HLTS Limited",
    "Engreg High School",
    "Student Innovation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
