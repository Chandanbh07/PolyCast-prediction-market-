import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { getMarkets } from "@/lib/api";
import { queryKeys } from "@/lib/queryClient";
import { MarketCard } from "@/components/markets/MarketCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TrendingUp,
    title: "Live orderbooks",
    body: "Every market runs on a real price-time matching engine — not a synthetic curve.",
  },
  {
    icon: Zap,
    title: "Instant settlement",
    body: "Trades clear the moment they match. Positions and balances update immediately.",
  },
  {
    icon: ShieldCheck,
    title: "Split & merge",
    body: "Mint a full Yes/No pair from cash, or redeem a pair back to cash, any time.",
  },
];

export default function Home() {
  const { data: markets, isLoading } = useQuery({ queryKey: queryKeys.markets, queryFn: getMarkets });
  const featured = (markets ?? []).slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-500/30 bg-signal-500/10 px-3 py-1 text-xs font-medium text-signal-300">
              Prediction markets, priced in real time
            </span>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-mist-50 sm:text-6xl">
              Trade what you believe will happen.
            </h1>
            <p className="mt-5 text-lg text-mist-300">
              PolyCast turns your conviction into a position. Buy Yes or No on real-world outcomes,
              backed by an on-chain orderbook and settled in seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/markets">
                  Explore markets <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/portfolio">View portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-ink-800/80 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-mist-50">Featured markets</h2>
            <Link to="/markets" className="flex items-center gap-1 text-sm font-medium text-signal-300 hover:text-signal-200">
              See all <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
            {!isLoading && featured.length === 0 && (
              <p className="col-span-full py-10 text-center text-mist-400">
                No markets yet. Check back soon.
              </p>
            )}
            {featured.map((m, i) => (
              <MarketCard key={m.id} market={m} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-ink-800/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="glass rounded-2xl p-6"
              >
                <f.icon className="size-5 text-signal-400" />
                <h3 className="font-display mt-3 text-base font-semibold text-mist-50">{f.title}</h3>
                <p className="mt-1.5 text-sm text-mist-400">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
