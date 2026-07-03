import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { getMarket, getPositions } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { getMarketPricing } from "@/lib/orderbook";
import { useAuth } from "@/context/AuthContext";
import { ProbabilityRing } from "@/components/markets/ProbabilityRing";
import { OrderbookView } from "@/components/market-detail/OrderbookView";
import { OrderTicket } from "@/components/market-detail/OrderTicket";
import { SplitMergeCard } from "@/components/market-detail/SplitMergeCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function MarketDetail() {
  const { marketId } = useParams<{ marketId: string }>();
  const { address } = useAuth();

  const { data: market, isLoading } = useQuery({
    queryKey: queryKeys.market(marketId!),
    queryFn: () => getMarket(marketId!),
    enabled: !!marketId,
  });

  const { data: positions } = useQuery({
    queryKey: queryKeys.positions,
    queryFn: getPositions,
    enabled: !!address,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-4 h-64 rounded-2xl" />
      </div>
    );
  }

  if (!market) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <p className="text-mist-300">Market not found.</p>
        <Link to="/markets" className="mt-3 inline-block text-sm text-signal-300">
          Back to markets
        </Link>
      </div>
    );
  }

  const pricing = getMarketPricing(market);
  const yesQty = positions?.find((p) => p.marketId === market.id && p.type === "Yes")?.qty ?? 0;
  const noQty = positions?.find((p) => p.marketId === market.id && p.type === "No")?.qty ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/markets" className="flex items-center gap-1.5 text-sm text-mist-400 hover:text-mist-100">
        <ArrowLeft className="size-4" /> Markets
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-semibold text-mist-50 sm:text-3xl">{market.title}</h1>
                <p className="mt-2 text-sm text-mist-300">{market.description}</p>
              </div>
              <ProbabilityRing yesPrice={pricing.yesPrice} size={72} strokeWidth={7} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="yes">Yes {pricing.yesPrice}¢</Badge>
              <Badge variant="no">No {pricing.noPrice}¢</Badge>
              <span className="font-mono-nums text-xs text-mist-400">{market.totalQty.toLocaleString()} shares volume</span>
              {market.resolution && (
                <Badge variant="signal" className="ml-auto">
                  <CheckCircle2 className="size-3" /> Resolved: {market.resolution}
                </Badge>
              )}
            </div>
          </div>

          {address && (yesQty > 0 || noQty > 0) && (
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-sm font-semibold text-mist-50">Your position</h3>
              <div className="mt-3 flex gap-4">
                <div className="flex-1 rounded-xl bg-yes-500/10 p-3">
                  <p className="text-xs text-mist-400">Yes shares</p>
                  <p className="font-mono-nums text-lg font-semibold text-yes-400">{yesQty}</p>
                </div>
                <div className="flex-1 rounded-xl bg-no-500/10 p-3">
                  <p className="text-xs text-mist-400">No shares</p>
                  <p className="font-mono-nums text-lg font-semibold text-no-400">{noQty}</p>
                </div>
              </div>
            </div>
          )}

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-mist-50">Orderbook</h3>
            <div className="mt-4">
              <OrderbookView yesBook={pricing.yesBook} noBook={pricing.noBook} />
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-sm font-semibold text-mist-50">Resolution criteria</h3>
            <p className="mt-2 text-sm text-mist-300">{market.resolutionDescription}</p>
          </div>
        </div>

        <div className="space-y-6">
          <OrderTicket
            marketId={market.id}
            yesPrice={pricing.yesPrice}
            noPrice={pricing.noPrice}
            yesQty={yesQty}
            noQty={noQty}
            resolved={!!market.resolution}
          />
          {!market.resolution && <SplitMergeCard marketId={market.id} />}
        </div>
      </div>
    </div>
  );
}
