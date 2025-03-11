import { PublicKey } from "@solana/web3.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PROGRAM_ID } from "./constants"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generatePDA(seed: string, keypair: PublicKey) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(seed), keypair.toBuffer()], // Seeds array
    PROGRAM_ID
  );
  
  console.log("Generated PDA:", pda.toString());
  console.log("Bump seed:", bump);
  
  return { pda, bump };
}