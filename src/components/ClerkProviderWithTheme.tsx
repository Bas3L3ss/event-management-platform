"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function ClerkProviderWithTheme({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#00a9f1",
          colorTextOnPrimaryBackground: "white",
          colorBackground: theme === "dark" ? "#1a1a1a" : "#ffffff",
          colorText: theme === "dark" ? "#ffffff" : "#1a1a1a",
          colorInputBackground: theme === "dark" ? "#2d2d2d" : "#f5f5f5",
          colorInputText: theme === "dark" ? "#ffffff" : "#1a1a1a",
          colorTextSecondary: theme === "dark" ? "#a0a0a0" : "#666666",
        },
        baseTheme: theme === "dark" ? dark : undefined,
        elements: {
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-white transition-all",
          socialButtonsBlockButton: `${
            theme === "dark"
              ? "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
          } transition-all duration-200`,
          socialButtonsBlockButtonText: "font-medium",
          formButtonReset: `${
            theme === "dark"
              ? "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
              : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
          } transition-all duration-200`,
          card: `${theme === "dark" ? "bg-zinc-900" : "bg-white"}`,
          headerTitle: "font-bold text-2xl",
          headerSubtitle: `${
            theme === "dark" ? "text-zinc-400" : "text-gray-600"
          }`,
          dividerLine: `${theme === "dark" ? "bg-zinc-700" : "bg-gray-200"}`,
          dividerText: `${
            theme === "dark" ? "text-zinc-500" : "text-gray-500"
          }`,
          formFieldLabel: "font-medium",
          formFieldInput: `${
            theme === "dark"
              ? "bg-zinc-800 border-zinc-700 focus:border-primary"
              : "bg-gray-50 border-gray-200 focus:border-primary"
          } transition-all duration-200`,
          membersPageInviteButton:
            "bg-primary hover:bg-primary/90 text-white transition-all",
          navbar: `${theme === "dark" ? "bg-zinc-900" : "bg-white"}`,
        },
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
}
