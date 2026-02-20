import { http } from "./http";
import type { OrderEvent } from "../types/orderEvent";

export async function listOrderEventsApi(params?: { order_id?: number }): Promise<OrderEvent[]> {
  const { data } = await http.get<OrderEvent[]>("/api/order-events/", { params });
  return Array.isArray(data) ? data : [];
}
