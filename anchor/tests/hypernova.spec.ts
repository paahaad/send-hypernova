import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { Hypernova } from "../target/types/hypernova";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";


const IDL = require("../target/idl/hypernova.json");

const hypernovaAddress = new PublicKey(
  "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"
);

describe("Hypernova", () => {
  let ctx;
  let provider: BankrunProvider;
  let hypernova: anchor.Program<Hypernova>;
  let developer: anchor.web3.Keypair | anchor.web3.Signer;
  let tokenMint = anchor.web3.Keypair.generate();

  beforeAll(async () => {
    ctx = await startAnchor(
      "",
      [
        {
          name: "hypernova",
          programId: hypernovaAddress,
        },
      ],
      []
    );

    provider = new BankrunProvider(ctx);
    developer = provider.wallet.payer;

    hypernova = new Program<Hypernova>(IDL, provider);

  });

  it("Initiate Presale", async () => {
    // const [presaleAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [Buffer.from("presale"), developer.publicKey.toBuffer()],
    //   hypernova.programId
    // );

    const tokenMint = anchor.web3.Keypair.generate();

    await hypernova.methods
      .initiatePresale(
        "Hypernova",
        "HYN",
        8, //decimals
        new anchor.BN(2100000), //total_supply
        50, //presale_percentage
        new anchor.BN(1000), //token_price
        new anchor.BN(172342344), //start_time
        new anchor.BN(182342344), //end_time
        new anchor.BN(2000), // min_purchase
        new anchor.BN(2400) //max_purchase
      )
      .accounts({
        tokenMint: tokenMint.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([developer, tokenMint])
      .rpc();

      const [presaleAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("presale"), developer.publicKey.toBuffer()],
        hypernova.programId
      )
      console.log("From init:", presaleAccount);
  });

  it("Buy from Presale Pool", async () => {
    const buyer = anchor.web3.Keypair.generate();
    const [presaleAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("presale"), developer.publicKey.toBuffer()],
      hypernova.programId
    );

    console.log("presaleAccount", presaleAccount)
    const presalePoolAccount = anchor.utils.token.associatedAddress({
      mint: tokenMint.publicKey,
      owner: presaleAccount
    });

    console.log("presalePoolAccount", presalePoolAccount)
    
  //   await hypernova.methods.purchaseTokens(
  //     new anchor.BN(11111) // SOL amount to spend
  //   )
  //   .accounts({
  //     user: buyer.publicKey,
  //     presaleAccount: presaleAccount,
  //     tokenMint: tokenMint.publicKey,
  //     presaleVault: presaleVault,
  //     tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
  //   })
  //   .signers([buyer])
  //   .rpc();
  });
});
