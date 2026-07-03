import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Market } from "@/lib/types";
import { getMarketPricing } from "@/lib/orderbook";
import { ProbabilityRing } from "./ProbabilityRing";
import { Badge } from "@/components/ui/badge";

export function MarketCard({ market, index = 0 }: { market: Market; index?: number }) {
  const pricing = getMarketPricing(market);
  const isResolved = !!market.resolution;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        to={`/markets/${market.id}`}
        className="glass glass-hover flex h-full flex-col justify-between rounded-2xl p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold leading-snug text-mist-50 line-clamp-3">
            {market.title}
          </h3>
          <ProbabilityRing yesPrice={pricing.yesPrice} size={52} strokeWidth={5} />
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-mist-400">{market.description}</p>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="yes">Yes {pricing.yesPrice}¢</Badge>
            <Badge variant="no">No {pricing.noPrice}¢</Badge>
          </div>
          {isResolved ? (
            <Badge variant="signal">Resolved: {market.resolution}</Badge>
          ) : (
            <span className="font-mono-nums text-xs text-mist-400">{market.totalQty.toLocaleString()} vol</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
