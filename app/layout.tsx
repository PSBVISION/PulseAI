import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desk Bot Assistant",
  description: "A personalized AI desk companion powered by computer vision and Gemini API",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Load TensorFlow.js and BlazeFace from CDN */}
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface@0.0.7"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
