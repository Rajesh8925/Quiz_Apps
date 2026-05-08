import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from '@/components/auth-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Quiz App",
  description: "Generate and take quizzes with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
