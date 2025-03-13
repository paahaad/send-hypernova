"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenHeader } from "@/components/token-header";
import { ArrowLeft } from "lucide-react";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { tokenFormSchema } from "@/lib/schema";

import { createToken } from "@/actions/mint";
import { PROGRAM_ID, VAULT } from "@/lib/constants";
import { useAnchorProvider } from "@/components/solana-provider";
import { getHypernovaProgram } from "@project/anchor";
import { BN } from "bn.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export default function CreateToken() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const provider = useAnchorProvider();
  const program = useMemo(
    () => getHypernovaProgram(provider, PROGRAM_ID),
    [provider]
  );
  const [activeTab, setActiveTab] = useState("token-details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof tokenFormSchema>>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 5,
      totalSupply: 0,
      description: "",
      blockchain: "",
      tokenType: "",
      uri: "",
      startTime: 0,
      endTime: 0,
      ticker: 0,
      tokenPrice: 0,
      minPurchase: 0,
      maxPurchase: 0,
      presalePercentage: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof tokenFormSchema>) {
    try {
      if (!wallet.publicKey) {
        alert("Connect Wallet");
        return;
      }
      setIsSubmitting(true);
      // DONE: create mint with onchain smart contract
      // const id = Math.floor(1 + Math.random() * 9);
      const id = Math.floor(10 + Math.random() * 90); // TODO: solve collision issue.

      const [mintPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("mint"),
          wallet.publicKey.toBuffer(),
          new BN(id).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const [presalePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("presale"), mintPDA.toBuffer()],
        program.programId
      );

      let tx1 = await program.methods
        .createToken(
          new BN(id),
          new BN(values.startTime),
          new BN(values.endTime),
          new BN(values.ticker),
          values.name,
          values.symbol,
          values.uri,
          new BN(values.totalSupply),
          new BN(values.tokenPrice),
          new BN(values.minPurchase),
          new BN(values.maxPurchase),
          values.presalePercentage
        )
        .accounts({
          payer: wallet.publicKey as PublicKey,
        })
        .transaction();

      let transaction1Signature = await wallet.sendTransaction(tx1, connection);
      console.log("Success!");
      console.log(`   Mint Address: ${mintPDA}`);
      console.log(`   Transaction Signature: ${transaction1Signature}`);

      // Mint token to ATA. 1. presaleATA, LP, Developer
      // Get associated token accounts
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintPDA,
        wallet.publicKey
      );

      const associatedTokenPresale = await getAssociatedTokenAddress(
        mintPDA,
        mintPDA,
        true // allowOwnerOffCurve
      );

      const tx2 = await program.methods
        .mintToken(new BN(id))
        .accounts({
          payer: wallet.publicKey,
        })
        .transaction();

      let transaction2Signature = await wallet.sendTransaction(tx2, connection);

      console.log("Success!");
      console.log(`   Transaction Signature: ${transaction2Signature}`);

      console.log(
        `   DEV Associated Token Account Address: ${associatedTokenAccount}`
      );

      let presaleAccount = await program.account.presaleInfo.fetch(presalePDA);
      console.log(
        `  Presale Account associatedTokenPresale Details:`,
        presaleAccount.associatedTokenPresale.toBase58()
      );
      console.log(`  Presale Account Details:`, presaleAccount);

      const token_details = {
        user: wallet.publicKey.toBase58(),
        tokenName: values.name,
        tokenSymbol: values.symbol,
        tokenUrl: values.uri,

        ticker: values.ticker,
        price: values.tokenPrice,
        sale_start: values.startTime,
        sale_end: values.endTime,
        min_purchase: values.minPurchase,
        max_purchase: values.minPurchase,
        token_min: mintPDA.toBase58(),
        associated_token_presale: associatedTokenPresale.toBase58(),
      };
      await createToken(token_details);
    } catch (err) {
      console.log("[FAIELD CREATING TOKEM]", err);
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <h1 className="text-2xl font-bold">Create Token</h1>
        </div>

        <div className="mx-auto max-w-2xl">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="token-details">Details</TabsTrigger>
              <TabsTrigger value="presale-config">Presale</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <TabsContent value="token-details" className="mt-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Token" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uri"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URI</FormLabel>
                          <FormControl>
                            <Input placeholder="uri" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="symbol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Symbol</FormLabel>
                          <FormControl>
                            <Input placeholder="MTK" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="decimals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Decimals</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="totalSupply"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Supply</FormLabel>
                            <FormControl>
                              <Input placeholder="1000000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of your token"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end m-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("presale-config")}
                    >
                      Continue
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="presale-config" className="mt-6">
                  <div className="space-y-6">
                    <div className="bg-neutral-900 p-4 rounded-lg">
                      <h3 className="text-sm font-medium">
                        Presale Configuration
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set pricing, caps, and timeline
                      </p>
                    </div>

                    {/* Presale form fields would go here */}

                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="presalePercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Presale Percentage</FormLabel>
                            <FormControl>
                              <Input placeholder="50%" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input placeholder="1722434" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input placeholder="18435345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ticker"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticker</FormLabel>
                              <FormControl>
                                <Input placeholder="Cap in $" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="tokenPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Token Price</FormLabel>
                              <FormControl>
                                <Input placeholder="$200" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="minPurchase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Min Purchase</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="maxPurchase"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Max Purchase</FormLabel>
                              <FormControl>
                                <Input placeholder="1000000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("token-details")}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setActiveTab("review")}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="review" className="mt-6">
                  <div className="space-y-6">
                    <div className="bg-neutral-900 p-4 rounded-lg">
                      <h3 className="text-sm font-medium">Review</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Verify details before deployment
                      </p>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p>{form.watch("name") || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Symbol
                          </p>
                          <p>{form.watch("symbol") || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Decimals
                          </p>
                          <p>{form.watch("decimals") || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Supply
                          </p>
                          <p>{form.watch("totalSupply") || "-"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Blockchain
                          </p>
                          <p className="capitalize">
                            {form.watch("blockchain") || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="capitalize">
                            {form.watch("tokenType") || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground">
                          Description
                        </p>
                        <p className="text-xs">
                          {form.watch("description") || "-"}
                        </p>
                      </div>

                      <div className="flex justify-between mt-8">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setActiveTab("presale-config")}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Deploying..." : "Deploy"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
