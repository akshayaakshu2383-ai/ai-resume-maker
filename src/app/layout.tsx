import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AIResume maker - AI-Powered Professional Resume Builder",
  description: "Create stunning, ATS-friendly resumes in minutes with the power of AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-slate-950 text-slate-50 font-sans"
      >
        <NextAuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
