import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Rocket, Clock, CheckCircle, Search, ArrowLeft } from "lucide-react";
import FilterComponent from "@/components/filter";

// Token data
const tokens = [
  {
    id: "mvt",
    name: "MVT",
    logo: "/placeholder.svg?height=32&width=32",
    raised: "340K",
    currency: "USDT",
    progress: 68,
    hardCap: "500K",
    price: "1:000",
  },
  {
    id: "dfp",
    name: "DFP",
    logo: "/placeholder.svg?height=32&width=32",
    raised: "84K",
    currency: "USDT",
    progress: 42,
    hardCap: "200K",
    price: "1:500",
  },
  {
    id: "gfw",
    name: "GFW",
    logo: "/placeholder.svg?height=32&width=32",
    raised: "712K",
    currency: "USDT",
    progress: 89,
    hardCap: "800K",
    price: "1:2000",
  },
  {
    id: "sonic",
    name: "SONIC",
    logo: "/placeholder.svg?height=32&width=32",
    raised: "1.2M",
    currency: "USDT",
    progress: 95,
    hardCap: "1.25M",
    price: "1:750",
  },
  {
    id: "chomp",
    name: "CHOMP",
    logo: "/placeholder.svg?height=32&width=32",
    raised: "47K",
    currency: "SOL",
    progress: 83,
    hardCap: "56K SOL",
    price: "1:0.001",
    description: "chomp the dog og meme from Vietnam",
  },
  {
    id: "pepe",
    name: "PEPE",
    logo: "/placeholder.svg?height=32&width=32",
    raised: "520K",
    currency: "USDT",
    progress: 74,
    hardCap: "700K",
    price: "1:0.005",
  },
];

export default function PresalesPage() {
  return (
    <main className="flex-1 py-8">
      <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
      <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 -ml-4 h-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Presale Marketplace</h1>
        </div>
        <div className="mt-6 relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8"
          />
        </div>
        <FilterComponent />

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tokens.map((token) => (
              <Link
                href={`/launch/token/${token.id}`}
                key={token.id}
                className="transition-transform hover:scale-[1.02]"
              >
                <Card className="overflow-hidden border-gray-800 bg-gray-900 shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={token.logo || "/placeholder.svg"}
                          alt={token.name}
                          className="h-8 w-8 rounded-full bg-gray-800"
                        />
                        <span className="text-lg font-bold">{token.name}</span>
                      </div>
                      <div className="rounded-full px-2 py-1 text-xs font-medium">
                        Active
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        {token.raised} {token.currency}
                      </span>
                      <span className="font-medium">{token.progress}%</span>
                    </div>

                    <Progress value={token.progress} className="h-2" />

                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <div className="text-gray-400">Hard Cap</div>
                        <div>{token.hardCap}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400">Price</div>
                        <div>{token.price}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-800 p-0">
                    <Button className="w-full rounded-none ">
                      Participate
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PresaleCard({ presale }: any) {
  return (
    <Card className="overflow-hidden border-neutral-800">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={presale.logo || "/placeholder.svg"}
                alt={presale.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardTitle className="text-base">{presale.symbol}</CardTitle>
          </div>
          <Badge
            variant={
              presale.status === "active"
                ? "default"
                : presale.status === "upcoming"
                ? "outline"
                : "secondary"
            }
            className="text-xs"
          >
            {presale.status === "active" && <Rocket className="mr-1 h-3 w-3" />}
            {presale.status === "upcoming" && (
              <Clock className="mr-1 h-3 w-3" />
            )}
            {presale.status === "completed" && (
              <CheckCircle className="mr-1 h-3 w-3" />
            )}
            {presale.status.charAt(0).toUpperCase() + presale.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Progress value={presale.progress} className="h-1" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {presale.raised} {presale.currency}
              </span>
              <span className="font-medium">{presale.progress}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Hard Cap</p>
              <p className="font-medium">{presale.hardCap}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price</p>
              <p className="font-medium">1:{presale.price}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full text-sm" size="sm">
          {presale.status === "active"
            ? "Participate"
            : presale.status === "upcoming"
            ? "Remind"
            : "View"}
        </Button>
      </CardFooter>
    </Card>
  );
}

const activePresales = [
  {
    id: 1,
    name: "MetaVerse Token",
    symbol: "MVT",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    progress: 68,
    softCap: "100K",
    hardCap: "500K",
    raised: "340K",
    currency: "USDT",
    price: "1000",
  },
  {
    id: 2,
    name: "DeFi Protocol",
    symbol: "DFP",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    progress: 42,
    softCap: "50K",
    hardCap: "200K",
    raised: "84K",
    currency: "USDT",
    price: "500",
  },
  {
    id: 3,
    name: "GameFi World",
    symbol: "GFW",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    progress: 89,
    softCap: "200K",
    hardCap: "800K",
    raised: "712K",
    currency: "USDT",
    price: "2000",
  },
  {
    id: 4,
    name: "AI Finance",
    symbol: "AIF",
    logo: "/placeholder.svg?height=40&width=40",
    status: "active",
    progress: 35,
    softCap: "150K",
    hardCap: "600K",
    raised: "210K",
    currency: "USDT",
    price: "750",
  },
];

const upcomingPresales = [
  {
    id: 5,
    name: "Green Energy Token",
    symbol: "GET",
    logo: "/placeholder.svg?height=40&width=40",
    status: "upcoming",
    progress: 0,
    softCap: "80K",
    hardCap: "300K",
    raised: "0",
    currency: "USDT",
    price: "1200",
  },
  {
    id: 6,
    name: "NFT Marketplace",
    symbol: "NFTM",
    logo: "/placeholder.svg?height=40&width=40",
    status: "upcoming",
    progress: 0,
    softCap: "120K",
    hardCap: "400K",
    raised: "0",
    currency: "USDT",
    price: "850",
  },
];

const completedPresales = [
  {
    id: 7,
    name: "Crypto Payment",
    symbol: "CPT",
    logo: "/placeholder.svg?height=40&width=40",
    status: "completed",
    progress: 100,
    softCap: "90K",
    hardCap: "350K",
    raised: "320K",
    currency: "USDT",
    price: "1500",
  },
  {
    id: 8,
    name: "Social Media Token",
    symbol: "SMT",
    logo: "/placeholder.svg?height=40&width=40",
    status: "completed",
    progress: 100,
    softCap: "75K",
    hardCap: "250K",
    raised: "250K",
    currency: "USDT",
    price: "600",
  },
];
