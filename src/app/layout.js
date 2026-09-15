import localFont from "next/font/local";
import ErrorTracking from "./components/ErrorTracking";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Braelo Admin",
  description: "Braelo Power Admin Panel",
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
        className={`${geistSans.variable} ${geistSans.className} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ErrorTracking />
        {children}
      </body>
    </html>
  );
}
