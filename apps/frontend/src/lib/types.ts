// Mirrors packages/db/prisma/schema.prisma and apps/backend/types.ts exactly.
// Do NOT add fields that don't exist on the backend models.

export type PositionType = "Yes" | "No";
export type OrderType = "Buy" | "Sell" | "Split" | "Merge";

export interface OrderbookOrder {
  userId: string;
  qty: number;
  filledQty: number;
  originalOrderId: string;
  reverseOrder: boolean;
}

export interface OrderbookLevel {
  availableQty: number;
  orders: OrderbookOrder[];
}

/** Keyed by price (integer cents, "0"-"100") */
export type Orderbook = Record<string, OrderbookLevel>;

export interface Market {
  id: string;
  title: string;
  description: string;
  resolutionDescription: string;
  yesOrderbook: Orderbook | string;
  noOrderbook: Orderbook | string;
  totalQty: number;
  resolution: PositionType | null;
}

export interface Position {
  id: string;
  userId: string;
  marketId: string;
  type: PositionType;
  qty: number;
}

export interface OrderHistoryEntry {
  id: string;
  orderType: OrderType;
  qty: number;
  price: number;
  userId: string;
  marketId: string;
}

export interface User {
  id: string;
  address: string;
  usdBalance: number;
}

// ---- Request payloads (mirrors zod schemas in apps/backend/types.ts) ----

export interface CreateOrderPayload {
  marketId: string;
  side: "yes" | "no";
  type: "buy" | "sell";
  price: number;
  qty: number;
}

export interface SplitMergePayload {
  marketId: string;
  amount: number;
}

export interface OnrampPayload {
  amount: number;
}

export interface OfframpPayload {
  amount: number;
}
