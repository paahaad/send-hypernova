"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Coins, Menu, LogOut, Wallet, Plus } from "lucide-react";
import { WalletButton } from "./solana-provider";

export function TokenHeader() {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full h-14 max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-background">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Coins className="h-5 w-5" />
                  <span>Hypernova</span>
                </Link>
                <Link href="/swap" className="hover:text-foreground/80">
                  Swap
                </Link>
                <Link href="/launch" className="hover:text-foreground/80">
                  Launch
                </Link>
                <Link href="/liquidity" className="hover:text-foreground/80">
                  Liquidity
                </Link>
                <Link href="/my-tokens" className="hover:text-foreground/80">
                  My Tokens
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Coins className="h-5 w-5" />
            <span className="hidden md:inline-block">Hypernova</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/swap"
              className="font-medium transition-colors hover:text-foreground/80"
            >
              Swap
            </Link>
            <Link
              href="/launch"
              className="font-medium transition-colors hover:text-foreground/80"
            >
              Launch
            </Link>
            <Link
              href="/liquidity"
              className="font-medium transition-colors hover:text-foreground/80"
            >
              Liquidity
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
