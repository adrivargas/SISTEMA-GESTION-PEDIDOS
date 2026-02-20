export type OrderEvent = {
  id: string;
  order_id: number;
  event_type: "CREATED" | "SENT_TO_KITCHEN" | "SERVED" | "PAID" | "CANCELLED";
  source: "WEB" | "MOBILE" | "SYSTEM";
  note?: string;
  created_at?: string;
};
