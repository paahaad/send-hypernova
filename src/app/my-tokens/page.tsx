"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TokenHeader } from "@/components/token-header";
import {
  ArrowUpRight,
  Clock,
  Coins,
  Edit,
  ExternalLink,
  Plus,
  Rocket,
  Settings,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MyTokensPage() {
  let wallet = useWallet();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => setIsConnected(!!wallet.publicKey), [wallet]);

  return (
    <main className="flex-1 py-12">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tokens</h1>
            <p className="text-muted-foreground">
              Manage your created tokens and presales
            </p>
          </div>
        </div>

        {!isConnected ? (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-6">
              <Coins className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Connect Your Wallet</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Connect your wallet to view and manage your tokens and presales
            </p>
            <Button className="mt-6" onClick={() => setIsConnected(true)}>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="tokens" className="mt-8">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="tokens">My Tokens</TabsTrigger>
                <TabsTrigger value="presales">My Presales</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tokens" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTokens.map((token) => (
                  <TokenCard key={token.id} token={token} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="presales" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPresales.map((presale) => (
                  <PresaleCard key={presale.id} presale={presale} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}

function TokenCard({ token }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={token.logo || "/placeholder.svg"}
                alt={token.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle>{token.name}</CardTitle>
              <CardDescription>{token.symbol}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Supply</p>
              <p className="font-medium">{token.totalSupply}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Decimals</p>
              <p className="font-medium">{token.decimals}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{token.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{token.created}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <ExternalLink className="h-4 w-4" />
          Explorer
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Settings className="h-4 w-4" />
          Manage
        </Button>
      </CardFooter>
    </Card>
  );
}

function PresaleCard({ presale }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={presale.logo || "/placeholder.svg"}
                alt={presale.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <CardTitle>{presale.name}</CardTitle>
              <CardDescription>{presale.symbol}</CardDescription>
            </div>
          </div>
          <Badge
            variant={
              presale.status === "active"
                ? "default"
                : presale.status === "upcoming"
                ? "outline"
                : "secondary"
            }
          >
            {presale.status === "active" && <Rocket className="mr-1 h-3 w-3" />}
            {presale.status === "upcoming" && (
              <Clock className="mr-1 h-3 w-3" />
            )}
            {presale.status === "completed" && (
              <ArrowUpRight className="mr-1 h-3 w-3" />
            )}
            {presale.status.charAt(0).toUpperCase() + presale.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{presale.progress}%</span>
            </div>
            <Progress value={presale.progress} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Raised</p>
              <p className="font-medium">
                {presale.raised} {presale.currency}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Hard Cap</p>
              <p className="font-medium">
                {presale.hardCap} {presale.currency}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">
                1 {presale.currency} = {presale.price} {presale.symbol}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Ends In</p>
              <p className="font-medium">{presale.endsIn}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <ExternalLink className="h-4 w-4" />
          View
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

const myTokens = [
  {
    id: 1,
    name: "My DeFi Token",
    symbol: "MDT",
    logo: "/placeholder.svg?height=40&width=40",
    totalSupply: "1,000,000",
    decimals: "18",
    type: "standard",
    created: "2 days ago",
  },
  {
    id: 2,
    name: "Gaming Platform",
    symbol: "GPT",
    logo: "/placeholder.svg?height=40&width=40",
    totalSupply: "500,000",
    decimals: "18",
    type: "mintable",
    created: "1 week ago",
  },
  {
    id: 3,
    name: "Nova Platform",
    symbol: "NPT",
    logo: "/placeholder.svg?height=40&width=40",
    totalSupply: "500,000",
    decimals: "18",
    type: "mintable",
    created: "1 week ago",
  },
];

const myPresales = [
  {
    id: 1,
    name: "My DeFi Token",
    symbol: "MDT",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    progress: 68,
    softCap: "100,000",
    hardCap: "500,000",
    raised: "340,000",
    currency: "USDT",
    price: "1000",
    endsIn: "2 days",
  },
  {
    id: 2,
    name: "Gaming Platform",
    symbol: "GPT",
    logo: "/placeholder.svg?height=40&width=40",
    status: "upcoming",
    progress: 0,
    softCap: "50,000",
    hardCap: "200,000",
    raised: "0",
    currency: "USDT",
    price: "500",
    endsIn: "Starts in 3 days",
  },
  {
    id: 3,
    name: "Nova Platform",
    symbol: "NVA",
    logo: "/placeholder.svg?height=40&width=40",
    status: "upcoming",
    progress: 0,
    softCap: "50,000",
    hardCap: "200,000",
    raised: "0",
    currency: "USDT",
    price: "500",
    endsIn: "Starts in 3 days",
  },
];
