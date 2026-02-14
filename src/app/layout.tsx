import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Google_Sans } from "next/font/google";
import Providers from "../components/Providers";
import { Toaster } from "@/components/ui/sonner";

const google_sans = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "kodehole",
  description: "A New Home for Your Code",
  icons: {
    icon: [
      { url: "/logo.jpg" },
      { url: "/logo.jpg", sizes: "32x32", type: "image/jpg" },
      { url: "/logo.jpg", sizes: "16x16", type: "image/jpg" },
    ],
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${google_sans.className}`}>
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
