import TokenDetail from "@/components/token-detail"

export default function TokenPage({ params }: { params: { token: string } }) {
  return <TokenDetail params={params} />
}

