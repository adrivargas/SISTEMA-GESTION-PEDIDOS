import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type OrderStatus = "PENDING" | "IN_PROGRESS" | "SERVED" | "PAID";

export type Order = {
  id: number;
  table: number;
  table_name: string;
  items_summary: string;
  total: string;
  status: OrderStatus;
  created_at: string;
};

export async function listOrdersApi() {
  const { data } = await http.get<Paginated<Order>>("/api/orders/");
  return data;
}
