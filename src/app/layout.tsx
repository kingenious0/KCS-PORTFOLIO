import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ContentProvider } from "@/lib/ContentContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Footer } from "@/components/layout/Footer";
import { VisitorTracker } from "@/components/layout/VisitorTracker";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KINGENIOUS WORKS | Beatmaker & Developer",
  description: "A high-performance portfolio for a Beatmaker & Web Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans antialiased selection:bg-neon-blue selection:text-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AuthProvider>
            <ContentProvider>
              {children}
              <Footer />
              <VisitorTracker />
            </ContentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
