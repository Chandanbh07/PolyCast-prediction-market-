import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Wallet2 } from "lucide-react";
import { getBalance, getMarkets, getPositions } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { getMarketPricing } from "@/lib/orderbook";
import { useAuth } from "@/context/AuthContext";
import { balanceToUsd } from "@/lib/utils";
import { ConnectGate } from "@/components/shared/ConnectGate";
import { PositionCard } from "@/components/portfolio/PositionCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Position } from "@/lib/types";

export default function Portfolio() {
  const { address } = useAuth();

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: queryKeys.balance,
    queryFn: getBalance,
    enabled: !!address,
  });
  const { data: positions, isLoading: positionsLoading } = useQuery({
    queryKey: queryKeys.positions,
    queryFn: getPositions,
    enabled: !!address,
  });
  const { data: markets, isLoading: marketsLoading } = useQuery({
    queryKey: queryKeys.markets,
    queryFn: getMarkets,
    enabled: !!address,
  });

  const marketsById = useMemo(() => new Map((markets ?? []).map((m) => [m.id, m])), [markets]);

  const positionsByMarket = useMemo(() => {
    const map = new Map<string, { yes?: Position; no?: Position }>();
    for (const p of positions ?? []) {
      if (p.qty <= 0) continue;
      const entry = map.get(p.marketId) ?? {};
      if (p.type === "Yes") entry.yes = p;
      else entry.no = p;
      map.set(p.marketId, entry);
    }
    return map;
  }, [positions]);

  const positionsValue = useMemo(() => {
    let total = 0;
    for (const [marketId, entry] of positionsByMarket) {
      const market = marketsById.get(marketId);
      if (!market) continue;
      const pricing = getMarketPricing(market);
      total += ((entry.yes?.qty ?? 0) * pricing.yesPrice) / 100;
      total += ((entry.no?.qty ?? 0) * pricing.noPrice) / 100;
    }
    return total;
  }, [positionsByMarket, marketsById]);

  if (!address) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-mist-50">Portfolio</h1>
        <ConnectGate label="portfolio" />
      </div>
    );
  }

  const loading = balanceLoading || positionsLoading || marketsLoading;
  const cashValue = (balance ?? 0) / 100;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-mist-50">Portfolio</h1>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <p className="flex items-center gap-1.5 text-xs text-mist-400">
            <Wallet2 className="size-3.5" /> Cash balance
          </p>
          <p className="font-mono-nums mt-2 text-2xl font-semibold text-mist-50">{balanceToUsd(balance)}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs text-mist-400">Positions value (est.)</p>
          <p className="font-mono-nums mt-2 text-2xl font-semibold text-mist-50">${positionsValue.toFixed(2)}</p>
        </div>
        <div className="glass rounded-2xl p-5">
          <p className="text-xs text-mist-400">Total portfolio value</p>
          <p className="font-mono-nums mt-2 text-2xl font-semibold text-signal-300">
            ${(cashValue + positionsValue).toFixed(2)}
          </p>
        </div>
      </div>

      <h2 className="font-display mt-10 text-lg font-semibold text-mist-50">Open positions</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        {!loading && positionsByMarket.size === 0 && (
          <p className="col-span-full py-10 text-center text-mist-400">
            You don't hold any positions yet. Head to Markets to place your first trade.
          </p>
        )}
        {!loading &&
          Array.from(positionsByMarket.entries()).map(([marketId, entry]) => {
            const market = marketsById.get(marketId);
            if (!market) return null;
            return <PositionCard key={marketId} market={market} yesPosition={entry.yes} noPosition={entry.no} />;
          })}
      </div>
    </div>
  );
}
