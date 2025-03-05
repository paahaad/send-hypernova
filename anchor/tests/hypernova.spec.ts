import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Hypernova } from '../target/types/hypernova'

describe('hypernova', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Hypernova as Program<Hypernova>

  const hypernovaKeypair = Keypair.generate()

  it('Initialize Hypernova', async () => {
    await program.methods
      .initialize()
      .accounts({
        hypernova: hypernovaKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([hypernovaKeypair])
      .rpc()

    const currentCount = await program.account.hypernova.fetch(hypernovaKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Hypernova', async () => {
    await program.methods.increment().accounts({ hypernova: hypernovaKeypair.publicKey }).rpc()

    const currentCount = await program.account.hypernova.fetch(hypernovaKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Hypernova Again', async () => {
    await program.methods.increment().accounts({ hypernova: hypernovaKeypair.publicKey }).rpc()

    const currentCount = await program.account.hypernova.fetch(hypernovaKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Hypernova', async () => {
    await program.methods.decrement().accounts({ hypernova: hypernovaKeypair.publicKey }).rpc()

    const currentCount = await program.account.hypernova.fetch(hypernovaKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set hypernova value', async () => {
    await program.methods.set(42).accounts({ hypernova: hypernovaKeypair.publicKey }).rpc()

    const currentCount = await program.account.hypernova.fetch(hypernovaKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the hypernova account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        hypernova: hypernovaKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.hypernova.fetchNullable(hypernovaKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
