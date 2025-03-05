'use client'

import { getHypernovaProgram, getHypernovaProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useHypernovaProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getHypernovaProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getHypernovaProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['hypernova', 'all', { cluster }],
    queryFn: () => program.account.hypernova.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['hypernova', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ hypernova: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useHypernovaProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useHypernovaProgram()

  const accountQuery = useQuery({
    queryKey: ['hypernova', 'fetch', { cluster, account }],
    queryFn: () => program.account.hypernova.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['hypernova', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ hypernova: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['hypernova', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ hypernova: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['hypernova', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ hypernova: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['hypernova', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ hypernova: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
