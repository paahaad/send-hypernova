"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This would normally come from a database or API
const tokenData = {
  id: "chomp",
  name: "chomp",
  symbol: "CHOMP",
  logo: "/placeholder.svg?height=80&width=80",
  description: "chomp the dog og meme from Vietnam",
  bondingCurve: 83,
  kingOfHill: 97,
  crownedDate: "3/13/2025, 6:22:46 PM",
  marketCap: "$52,229",
  bondingAmount: "47,344 SOL",
  contractAddress: "TM8ht...pump",
  website: "https://chomp.io",
};

export default function TokenDetail({ params }: { params: { id: string } }) {
  const [amount, setAmount] = useState("");
  const [tab, setTab] = useState("buy");

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleQuickAmount = (value: string) => {
    setAmount(value);
  };

  return (
    <main className="flex flex-1 flex-col py-8 w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      <Link
        href="/launch"
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Tokens</span>
      </Link>

      <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
        {/* Token Info Card */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <img
              src={tokenData.logo || "/placeholder.svg"}
              alt={tokenData.name}
              className="h-20 w-20 rounded-md bg-gray-800"
            />
            <div>
              <h2 className="text-2xl font-bold">{tokenData.symbol}</h2>
              <p className="text-sm text-gray-400">{tokenData.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <span>Total market cap:</span>
                  <span className="font-medium text-white">
                    {tokenData.bondingCurve}%
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 text-gray-500"
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">
                          this showes the total token sold before 
                          graduate.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Progress
                value={tokenData.bondingCurve}
                className="h-2 bg-gray-800"
                indicatorClassName="bg-green-500"
              />
              <p className="mt-1 text-xs text-gray-400">
                graduate this coin at {tokenData.marketCap} market
                cap,
                <br />
                there is {tokenData.bondingAmount} in the presale pool.
              </p>
            </div>


            <div className="space-y-2 pt-2">
              <Button
                variant="outline"
                className="w-full justify-between border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <span>website</span>
                <span className="text-gray-500">{tokenData.website}</span>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-between border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <span>contract address:</span>
                <div className="flex items-center gap-1 text-gray-500">
                  <span>{tokenData.contractAddress}</span>
                  <Copy className="h-3 w-3" />
                </div>
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-400">holder distribution</span>
              <Button
                variant="secondary"
                size="sm"
                className="bg-gray-800 text-xs text-gray-300 hover:bg-gray-700"
              >
                generate bubble map
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Buy Card */}
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader className="pb-2">
            <Tabs
              defaultValue="buy"
              className="w-full"
              value={tab}
              onValueChange={setTab}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger
                  value="buy"
                  className={tab === "buy" ? "bg-green-500 text-black" : ""}
                >
                  buy
                </TabsTrigger>
                <TabsTrigger
                  value="sell"
                  className={tab === "sell" ? "bg-red-500 text-black" : ""}
                >
                  sell
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-sm text-gray-300 hover:bg-gray-700"
              >
                switch to chomp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-sm text-gray-300 hover:bg-gray-700"
              >
                set max slippage
              </Button>
            </div>

            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="border-gray-700 bg-gray-800 py-6 pr-20 text-right text-xl"
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <span>SOL</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600">
                  <div className="h-4 w-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                onClick={() => handleAmountChange("")}
              >
                reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                onClick={() => handleQuickAmount("0.1")}
              >
                0.1 SOL
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                onClick={() => handleQuickAmount("0.5")}
              >
                0.5 SOL
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                onClick={() => handleQuickAmount("1")}
              >
                1 SOL
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"
                onClick={() => handleQuickAmount("5")}
              >
                max
              </Button>
            </div>
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0">
            <Button className="w-full bg-green-500 py-6 text-lg font-medium text-black hover:bg-green-600">
              place trade
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
