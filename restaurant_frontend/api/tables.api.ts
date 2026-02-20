import { http } from "./http";

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Table = {
  id: number;
  name: string;
  capacity: number;
  is_available: boolean;
  created_at: string;
};

export async function listTablesApi() {
  const { data } = await http.get<Paginated<Table>>("/api/tables/");
  return data;
}
