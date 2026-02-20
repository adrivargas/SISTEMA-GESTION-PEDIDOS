import { http } from "./http";
import type { Menu } from "../types/menu";

export async function listMenusApi(): Promise<Menu[]> {
  const { data } = await http.get<Menu[]>("/api/menus/");
  return Array.isArray(data) ? data : [];
}
