"use client";

import { useState } from "react";
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
import { ArrowLeft, Upload } from "lucide-react";
import {
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
} from "@solana/spl-token";
import {
  Keypair,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { generatePDA } from "@/lib/utils";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";

const tokenFormSchema = z.object({
  name: z.string().min(3, {
    message: "Min 3 characters",
  }),
  symbol: z
    .string()
    .min(2, {
      message: "Min 2 characters",
    })
    .max(8, {
      message: "Max 8 characters",
    }),
  decimals: z
    .number()
    .min(0, {
      message: "decimals should be between 0 to 8",
    })
    .max(8, {
      message: "decimals should be between 0 to 8",
    }),
  totalSupply: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be positive",
    }),
  description: z
    .string()
    .min(10, {
      message: "Min 10 characters",
    })
    .max(500, {
      message: "Max 500 characters",
    }),
  blockchain: z.string({
    required_error: "Required",
  }),
  tokenType: z.string({
    required_error: "Required",
  }),
  uri: z.string({
    required_error: "Reqired"
  }).url({
    message: "Enter valid url"
  }),
  // logo: z.string().optional(),
});

export default function CreateToken() {
  const [activeTab, setActiveTab] = useState("token-details");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  const form = useForm<z.infer<typeof tokenFormSchema>>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 5,
      totalSupply: "",
      description: "",
      blockchain: "",
      tokenType: "",
      uri: "",
    },
  });

  async function onSubmit(values: z.infer<typeof tokenFormSchema>) {
    setIsSubmitting(true);
    console.log("Sumit cliecked")
    try {
      console.log(values);
      if (wallet.publicKey) {
        // !TODO Store this to db with success and failure record
        const keypair = Keypair.generate(); // This will be Token mint 
        const metadata = {
          mint: keypair.publicKey,
          name: values.name,
          symbol: values.symbol,
          uri: values.uri,
          additionalMetadata: [],
        };


        const { pda } = generatePDA("presale", keypair.publicKey); // This will be mintAuthority
        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction();
        transaction.add(
          SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: keypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
          }),
          createInitializeMetadataPointerInstruction(keypair.publicKey, pda, keypair.publicKey, TOKEN_2022_PROGRAM_ID),
          createInitializeMintInstruction(keypair.publicKey, values.decimals, pda, pda, TOKEN_2022_PROGRAM_ID),
          createInitializeInstruction({
            programId: TOKEN_2022_PROGRAM_ID,
            mint: keypair.publicKey,
            metadata: keypair.publicKey,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            mintAuthority: pda,
            updateAuthority: pda,
          })
        );

        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        console.log("Build Transations Success", transaction);

        transaction.partialSign(keypair);
        console.log("Partial Sign Confirmed",transaction);
        console.log("connection",connection);


        let tx = await wallet.sendTransaction(transaction, connection);
        console.log("tx", tx);

      } else {
        alert("Please Connect Your wallet");
      }
    } catch (err) {
       console.log("Errorr in creating token", err)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TokenHeader />
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

              <TabsContent value="token-details" className="mt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      {/* <div
                        onClick={() => document.getElementById("logo")?.click()}
                        className="flex flex-col items-center justify-center space-y-2 p-4 border border-neutral-800 rounded-lg cursor-pointer"
                      >
                        <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <FormLabel
                            htmlFor="logo"
                            className="cursor-pointer text-primary text-xs"
                          >
                            Upload Logo
                          </FormLabel>
                          <Input
                            id="logo"
                            type="file"
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </div> */}
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

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setActiveTab("presale-config")}
                      >
                        Continue
                      </Button>
                    </div>
                  </form>
                </Form>
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
                    {/* This is a placeholder for the presale configuration form */}
                    <p className="text-center text-muted-foreground py-8 text-sm">
                      Presale configuration form
                    </p>
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
                        <p className="text-xs text-muted-foreground">Symbol</p>
                        <p>{form.watch("symbol") || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Decimals
                        </p>
                        <p>{form.watch("decimals") || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Supply</p>
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
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
