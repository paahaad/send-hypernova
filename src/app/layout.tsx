import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SolanaProvider } from "@/components/solana-provider";
import { TokenHeader } from "@/components/token-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TokenLaunch - Create and Launch Tokens",
  description: "Create and launch your token in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark border`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SolanaProvider>
            <TokenHeader />
            <div className="flex min-h-screen flex-col bg-background">
              {children}
            </div>
          </SolanaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
