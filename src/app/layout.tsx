import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { SiteFooter } from "@/components/Footer";
import ClerkProviderWithTheme from "@/components/ClerkProviderWithTheme";
const inter = Inter({ subsets: ["latin"] });
import { cn } from "@/lib/utils";
import QueryProvider from "./provider/QueryClientProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SpeedInsights } from "@vercel/speed-insights/next";
export const metadata: Metadata = {
  title: "Event Management platform",
  description: "A place for everyone to manage and advertise their events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body
          className={cn(inter.className, "min-h-full")}
          suppressHydrationWarning
        >
          <ClerkProviderWithTheme>
            <Providers>
              <NavBar />
              <main className="min-h-[100vh]">{children}</main>
              <SiteFooter />
            </Providers>
          </ClerkProviderWithTheme>
          <ReactQueryDevtools initialIsOpen={false} />
          <SpeedInsights />
        </body>
      </html>
    </QueryProvider>
  );
}
