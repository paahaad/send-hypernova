import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Plus } from "lucide-react";
import { fetchMetadata } from "@/lib/utils";
import { getPresale } from "@/actions/presale";

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

async function updateTokens(tokens: any[]) {
  const updatedTokens = await Promise.all(
    tokens.map(async (token: any) => {
      const metadata = await fetchMetadata(token.url);
      return metadata ? { ...token, url: metadata.image } : token;
    })
  );

  console.log("updatedTokens", updatedTokens);
  return updatedTokens;
}

export default async function Home() {
  let { tokens } = await getPresale();
  tokens = await updateTokens(tokens);

  console.log("updated token inside component:", tokens)

  
  return (
    <main className="flex-1">
      <section className=" w-full py-4 md:py-12 bg-gradient-to-b from-background to-background/50">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h1 className="text-xl font-bold tracking-tighter sm:text-xl md:text-5xl">
              Launch Your Token
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/create-token">
                  Create <Plus className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link href="/presales">
                <Button variant="outline" size="lg">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tokens.map((token) => (
              <Link
                href={`/launch/token/${token.token_mint}`}
                key={token.id}
                className="transition-transform hover:scale-[1.02]"
              >
                <Card className="overflow-hidden border-gray-800 bg-gray-900 shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={token.url}
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
                        {300} $
                      </span>
                      <span className="font-medium">{43}%</span>
                    </div>

                    <Progress value={33} className="h-2" />

                    <div className="mt-4 flex justify-between text-sm">
                      <div>
                        <div className="text-gray-400">Hard Cap</div>
                        <div>{token.ticker}</div>
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
      </section>
    </main>
  );
}
