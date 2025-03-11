"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Coins, Menu, LogOut, Wallet, Plus } from "lucide-react";
import { WalletButton } from "./solana-provider";

export function TokenHeader() {
  const [isConnected, setIsConnected] = useState(false);

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
                  <span>TokenLaunch</span>
                </Link>
                <Link href="/" className="hover:text-foreground/80">
                  Home
                </Link>
                <Link href="/presales" className="hover:text-foreground/80">
                  Presales
                </Link>
                <Link href="/create-token" className="hover:text-foreground/80">
                  Create
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
              href="/"
              className="font-medium transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
            <Link
              href="/presales"
              className="font-medium transition-colors hover:text-foreground/80"
            >
              Presales
            </Link>
            <Link
              href="/my-tokens"
              className="font-medium transition-colors hover:text-foreground/80"
            >
              My Tokens
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-xs h-8 border-neutral-700"
                >
                  <Wallet className="h-3 w-3" />
                  <span className="hidden sm:inline-block">0x1a2b...3c4d</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-background border-neutral-800"
              >
                <DropdownMenuItem onClick={() => setIsConnected(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
              <WalletButton />
          )}
          <Button asChild size="sm" variant="ghost" className="h-8">
            <Link href="/create-token">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
