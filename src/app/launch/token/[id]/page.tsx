import TokenDetail from "@/components/token-detail"

export default function TokenPage({ params }: { params: { id: string } }) {
  return <TokenDetail params={params} />
}

