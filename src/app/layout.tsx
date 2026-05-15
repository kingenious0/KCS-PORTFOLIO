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
  title: {
    default: "Elliot Paakow Entsiwah | Full-Stack Developer & Music Producer",
    template: "%s | Kingenious"
  },
  description: "Official portfolio of Elliot Paakow Entsiwah (Kingenious), a Full-Stack Web Developer and CEO of Kingenious Creative Studio based in Kumasi, Ghana.",
  keywords: ["Elliot Paakow Entsiwah", "Elliot Enstiwah", "Kingenious", "Full-Stack Developer", "Next.js", "Ghana", "Web Development", "Music Producer"],
  authors: [{ name: "Elliot Paakow Entsiwah" }],
  creator: "Elliot Paakow Entsiwah",
  publisher: "Kingenious Creative Studio",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://kingenious.xyz",
    siteName: "Kingenious Portfolio",
    title: "Elliot Paakow Entsiwah | Full-Stack Developer & Music Producer",
    description: "Engineering secure, high-performance systems at the speed of AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kingenious - Elliot Paakow Entsiwah",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elliot Paakow Entsiwah | Kingenious",
    description: "Founder & Creative Technologist. Building the future at Kingenious Creative Studio.",
    images: ["/og-image.png"],
    creator: "@kingenious",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Elliot Paakow Entsiwah",
    "alternateName": ["Elliot Paa kow Enstiwah", "Kingenious", "Elliot Enstiwah"],
    "url": "https://kingenious.xyz",
    "image": "https://kingenious.xyz/logo.png",
    "jobTitle": "Founder & Creative Technologist",
    "brand": {
      "@type": "Brand",
      "name": "Kingenious",
      "logo": "https://kingenious.xyz/logo.png"
    },
    "memberOf": {
      "@type": "EducationalOrganization",
      "name": "University of Skills Training and Entrepreneurial Development (AAMUSTED)"
    },
    "description": "Full-stack developer and student at AAMUSTED specializing in IT Education and AI academic systems."
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${inter.variable} overflow-x-hidden`}>
      <body className="font-sans antialiased selection:bg-orange-500 selection:text-white overflow-x-hidden bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
