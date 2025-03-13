"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

const LiquidityPools = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("apy");

  const pools = [
    { name: "SOL/USDC", apy: 12.5, volume: "$5M", liquidity: "$20M" },
    { name: "ETH/SOL", apy: 8.2, volume: "$3M", liquidity: "$12M" },
    { name: "BTC/USDC", apy: 15.1, volume: "$8M", liquidity: "$30M" },
  ];

  const filteredPools = pools
    .filter((pool) => pool.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sort === "apy" ? b.apy - a.apy : a.name.localeCompare(b.name)
    );

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-8 w-full max-w-screen-2xl mx-auto md:px-8 lg:px-12">
        <div className="flex justify-between items-center mb-6 w-full">
          <h1 className="text-2xl font-bold">Liquidity Pools</h1>
          <Button>
            Create Liquidity
          </Button>
        </div>

        <div className="flex gap-4 mb-4 w-full">
          <Input
            placeholder="Search pools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 bg-gray-800 border border-gray-700 text-white"
          />
          <Select onValueChange={setFilter}>
            <SelectTrigger className="w-1/4 bg-gray-800 border border-gray-700">
              <SelectValue placeholder="Filter by token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="sol">SOL</SelectItem>
              <SelectItem value="eth">ETH</SelectItem>
              <SelectItem value="btc">BTC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="bg-gray-900 w-full">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4">Pool</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => setSort("apy")}>
                      APY <ArrowUpDown size={16} />
                    </Button>
                  </TableHead>
                  <TableHead>Volume (24h)</TableHead>
                  <TableHead>Liquidity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPools.map((pool, index) => (
                  <TableRow key={index}>
                    <TableCell>{pool.name}</TableCell>
                    <TableCell>{pool.apy}%</TableCell>
                    <TableCell>{pool.volume}</TableCell>
                    <TableCell>{pool.liquidity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </main>
  );
};

export default LiquidityPools;
