import { Anybody } from "next/font/google";
import localFont from "next/font/local";
import ErrorTracking from "./components/ErrorTracking";
import AppProviders from "./components/AppProviders";
import "./globals.css";

/**
 * Anybody (SIL Open Font License 1.1)
 * Copyright 2020 The Anybody Project Authors
 * https://github.com/Etcetera-Type-Co/Anybody
 */
const anybody = Anybody({
  subsets: ["latin", "latin-ext"],
  variable: "--font-anybody",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Braelo Admin Panel",
  description: "Braelo Admin Panel",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFCC35",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anybody.variable} ${anybody.className} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppProviders>
          <ErrorTracking />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
