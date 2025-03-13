"use client";

import { useState } from "react";
import {
  ArrowDown,
  ChevronDown,
  Info,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenHeader } from "@/components/token-header";

// Token data
const tokens = [
  {
    id: "sonic",
    name: "SONIC",
    logo: "/placeholder.svg?height=24&width=24",
    balance: "0.00",
  },
  {
    id: "sol",
    name: "SOL",
    logo: "/placeholder.svg?height=24&width=24",
    balance: "0.00",
  },
  {
    id: "usdc",
    name: "USDC",
    logo: "/placeholder.svg?height=24&width=24",
    balance: "0.00",
  },
  {
    id: "usdt",
    name: "USDT",
    logo: "/placeholder.svg?height=24&width=24",
    balance: "0.00",
  },
  {
    id: "eth",
    name: "ETH",
    logo: "/placeholder.svg?height=24&width=24",
    balance: "0.00",
  },
];

// Stats data
const stats = [
  { title: "Total Value Locked", value: "$200k+" },
  { title: "Cumulative Trading Volume", value: "$1M+" },
  { title: "Active Users", value: "450+" },
];

export default function TokenSwap() {
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("0.00");
  const [slippage, setSlippage] = useState("0.5");

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount("");
    setToAmount("0.00");
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 py-8">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Hyperspeed Tokens on Sonic SVM
      </h2>

      {/* Swap Card */}
      <Card className="w-full max-w-md border-gray-800 bg-gray-900 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Tabs defaultValue="swap" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="swap">Swap</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {/* From Token */}
          <div className="rounded-xl bg-gray-800 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Paying</span>
              <span className="text-sm text-gray-400">
                Balance: {fromToken.balance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="border-none bg-transparent text-xl font-medium placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full bg-gray-700 px-3 hover:bg-gray-600"
                  >
                    <img
                      src={fromToken.logo || "/placeholder.svg"}
                      alt={fromToken.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{fromToken.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[160px] border-gray-800 bg-gray-900">
                  {tokens.map((token) => (
                    <DropdownMenuItem
                      key={token.id}
                      onClick={() => setFromToken(token)}
                      className="flex items-center gap-2 hover:bg-gray-800"
                    >
                      <img
                        src={token.logo || "/placeholder.svg"}
                        alt={token.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{token.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapTokens}
              className="z-10 -my-2 rounded-full bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          </div>

          {/* To Token */}
          <div className="rounded-xl bg-gray-800 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-400">Buying</span>
              <span className="text-sm text-gray-400">
                Balance: {toToken.balance}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <Input
                type="text"
                value={toAmount}
                readOnly
                className="border-none bg-transparent text-xl font-medium placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-full bg-gray-700 px-3 hover:bg-gray-600"
                  >
                    <img
                      src={toToken.logo || "/placeholder.svg"}
                      alt={toToken.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{toToken.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[160px] border-gray-800 bg-gray-900">
                  {tokens.map((token) => (
                    <DropdownMenuItem
                      key={token.id}
                      onClick={() => setToToken(token)}
                      className="flex items-center gap-2 hover:bg-gray-800"
                    >
                      <img
                        src={token.logo || "/placeholder.svg"}
                        alt={token.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <span>{token.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Rate */}
          <div className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2 text-sm">
            <span className="text-gray-400">Rate</span>
            <div className="flex items-center gap-1">
              <span>
                1 {fromToken.name} = 0.00 {toToken.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-white"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Slippage */}
          <div className="flex items-center justify-between rounded-lg bg-gray-800/50 px-3 py-2 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Slippage Tolerance</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-gray-400 hover:text-white"
              >
                <Info className="h-3 w-3" />
              </Button>
            </div>
            <span>{slippage}%</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button className="w-full py-6 text-lg font-semibold">Swap</Button>
        </CardFooter>
      </Card>

      {/* Description */}
      <p className="my-6 max-w-md text-center text-gray-400">
        The largest DEX and Launchpad on Sonic SVM — the first chain extension
        on Solana
      </p>
    </main>
  );
}
