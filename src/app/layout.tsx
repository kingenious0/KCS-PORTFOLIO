import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ContentProvider } from "@/lib/ContentContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VisitorTracker } from "@/components/layout/VisitorTracker";
import { Toaster } from "react-hot-toast";

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
  title: "KINGENIOUS | Full-stack Architect & Producer",
  description: "Engineering secure, high-performance systems at the speed of AI. A premium portfolio by Elliot Enstiwah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable} overflow-x-hidden`}>
      <body className="font-sans antialiased selection:bg-orange-500 selection:text-white overflow-x-hidden bg-black text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ContentProvider>
              <div className="max-w-full">
                <Navbar />
              </div>
              {children}
              <Footer />
              <VisitorTracker />
              <Toaster position="top-center" />
            </ContentProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
