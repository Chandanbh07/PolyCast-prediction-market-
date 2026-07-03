import { Link } from "react-router-dom";
import type { Market, Position } from "@/lib/types";
import { getMarketPricing } from "@/lib/orderbook";
import { Badge } from "@/components/ui/badge";

export function PositionCard({
  market,
  yesPosition,
  noPosition,
}: {
  market: Market;
  yesPosition?: Position;
  noPosition?: Position;
}) {
  const pricing = getMarketPricing(market);
  const yesQty = yesPosition?.qty ?? 0;
  const noQty = noPosition?.qty ?? 0;
  const yesValue = (yesQty * pricing.yesPrice) / 100;
  const noValue = (noQty * pricing.noPrice) / 100;

  return (
    <Link to={`/markets/${market.id}`} className="glass glass-hover block rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-mist-50 line-clamp-2">{market.title}</h3>
        {market.resolution && <Badge variant="signal">Resolved</Badge>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {yesQty > 0 && (
          <div className="rounded-xl bg-yes-500/10 p-3">
            <p className="text-xs text-mist-400">Yes · {yesQty} sh</p>
            <p className="font-mono-nums text-base font-semibold text-yes-400">${yesValue.toFixed(2)}</p>
          </div>
        )}
        {noQty > 0 && (
          <div className="rounded-xl bg-no-500/10 p-3">
            <p className="text-xs text-mist-400">No · {noQty} sh</p>
            <p className="font-mono-nums text-base font-semibold text-no-400">${noValue.toFixed(2)}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
