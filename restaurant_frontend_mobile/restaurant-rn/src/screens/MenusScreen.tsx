import { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import { listMenusApi } from "../api/menus.api";
import type { Menu } from "../types/menu";

export default function MenusScreen() {
  const [items, setItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      setLoading(true);
      const data = await listMenusApi();
      setItems(data);
    } catch {
      setErrorMessage("Error al cargar.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && items.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#58a6ff" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <Pressable onPress={load} style={styles.btn}>
        <Text style={styles.btnText}>Refrescar</Text>
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No hay platos.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.rowSub}>
                {item.category || "-"} - ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", padding: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#8b949e", marginTop: 10 },
  title: { color: "#58a6ff", fontSize: 22, fontWeight: "800", marginBottom: 10 },
  error: { color: "#ff7b72", marginBottom: 10 },
  btn: { backgroundColor: "#21262d", borderColor: "#58a6ff", borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 },
  btnText: { color: "#58a6ff", textAlign: "center", fontWeight: "700" },
  empty: { color: "#8b949e", textAlign: "center", marginTop: 20 },
  row: {
    backgroundColor: "#161b22",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#30363d",
  },
  rowText: { color: "#c9d1d9", fontWeight: "800" },
  rowSub: { color: "#8b949e", marginTop: 2 },
});
