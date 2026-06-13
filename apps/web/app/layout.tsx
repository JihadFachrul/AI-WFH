import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Display — geometric grotesk modern (judul, angka besar). Karakter SaaS.
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

// Body/UI — Plus Jakarta Sans: bersih, modern, mudah dibaca (bukan Inter).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Data — mono untuk angka/label/timestamp.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AWOS — AI Workforce Operating System",
  description:
    "Internal enterprise platform untuk WFH, task, dan team management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${jakarta.variable} ${jetbrains.variable}`}
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
