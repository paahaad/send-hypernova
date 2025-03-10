import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Rocket, Clock, CheckCircle, Search } from "lucide-react"
import { TokenHeader } from "@/components/token-header"

export default function PresalesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TokenHeader />
      <main className="flex-1 py-8">
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h1 className="text-2xl font-bold">Presales</h1>
            <Button asChild size="sm">
              <Link href="/create-token">Create Presale</Link>
            </Button>
          </div>

          <div className="mt-6 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-full pl-8" />
          </div>

          <Tabs defaultValue="active" className="mt-6">
            <div className="flex justify-center mb-6">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePresales.map((presale) => (
                  <PresaleCard key={presale.id} presale={presale} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingPresales.map((presale) => (
                  <PresaleCard key={presale.id} presale={presale} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedPresales.map((presale) => (
                  <PresaleCard key={presale.id} presale={presale} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function PresaleCard({ presale }: any) {
  return (
    <Card className="overflow-hidden border-neutral-800">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={presale.logo || "/placeholder.svg"} alt={presale.name} className="w-full h-full object-cover" />
            </div>
            <CardTitle className="text-base">{presale.symbol}</CardTitle>
          </div>
          <Badge
            variant={presale.status === "active" ? "default" : presale.status === "upcoming" ? "outline" : "secondary"}
            className="text-xs"
          >
            {presale.status === "active" && <Rocket className="mr-1 h-3 w-3" />}
            {presale.status === "upcoming" && <Clock className="mr-1 h-3 w-3" />}
            {presale.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
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
          {presale.status === "active" ? "Participate" : presale.status === "upcoming" ? "Remind" : "View"}
        </Button>
      </CardFooter>
    </Card>
  )
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
]

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
]

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
]

