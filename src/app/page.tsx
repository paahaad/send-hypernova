"use client";

// Stats data
const stats = [
  { title: "Total Value Locked", value: "$200k+" },
  { title: "Cumulative Trading Volume", value: "$1M+" },
  { title: "Active Users", value: "450+" },
];

export default function Home() {

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-4 py-8">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Hyperspeed Tokens on Sonic SVM
      </h2>
      {/* Description */}
      <p className="my-6 max-w-md text-center text-gray-400">
        The largest DEX and Launchpad on Sonic SVM — the first chain extension
        on Solana
      </p>

      {/* Stats */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center rounded-lg bg-purple-900/20 p-6 text-center"
          >
            <h3 className="mb-2 text-purple-300">{stat.title}</h3>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <h2 className="mb-6 mt-12 text-center text-2xl font-bold">
        The Vertical DEX on Solana
      </h2>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-purple-900/20 p-6">
          <h3 className="mb-4 text-center text-lg font-medium text-purple-300">
            Launch ANY Tokens
          </h3>
          <p className="text-center text-sm text-gray-300">
            From memes to games to consumer tokens with an in-built launch
            mechanism
          </p>
        </div>
        <div className="rounded-lg bg-purple-900/20 p-6">
          <h3 className="mb-4 text-center text-lg font-medium text-purple-300">
            Trade ANY Tokens
          </h3>
          <p className="text-center text-sm text-gray-300">
            on the native Hypernova DEX built using Concentrated Liquidity
            (CLMMs) implementation
          </p>
        </div>
        <div className="rounded-lg bg-purple-900/20 p-6">
          <h3 className="mb-4 text-center text-lg font-medium text-purple-300">
            Provide Liquidity
          </h3>
          <p className="text-center text-sm text-gray-300">
            Create Liquidity Pools or provide liquidity to existing pools and
            earn yield
          </p>
        </div>
      </div>
    </main>
  );
}
