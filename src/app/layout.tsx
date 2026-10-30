import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nunito, Lora } from "next/font/google";
import Cursor from "@/components/Cursor";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";
import { preloaderScript } from "@/lib/preloader-script";
import "./globals.css";

const metropolis = localFont({
  src: [
    {
      path: "../fonts/metropolis/metropolis-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/metropolis/metropolis-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/metropolis/metropolis-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/metropolis/metropolis-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-metropolis",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Subhana Khan — Portfolio",
  description: "Architecture portfolio of Subhana Khan, Kochi, Kerala.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${metropolis.variable} ${nunito.variable} ${lora.variable} h-full antialiased`}
      // The <head> script and SmoothScroll add attributes before hydration finishes.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js");${preloaderScript}` }} />
        <noscript>
          <style>{`.preloader{display:none}[data-hero-reveal],[data-eg-text]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="relative min-h-full flex flex-col">
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
