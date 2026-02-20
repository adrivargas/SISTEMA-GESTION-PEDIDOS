import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, ActivityIndicator } from "react-native";

import { listOrderEventsApi } from "../api/orderEvents.api";
import type { OrderEvent } from "../types/orderEvent";

function formatDate(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  const h = d.getHours();
  const m = d.getMinutes();
  return `${day}/${month}/${year} ${h}:${m < 10 ? "0" + m : m}`;
}

export default function OrderEventsScreen() {
  const [items, setItems] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderIdFilter, setOrderIdFilter] = useState("");

  const load = async (): Promise<void> => {
    try {
      setErrorMessage("");
      setLoading(true);
      const orderId = orderIdFilter.trim() ? parseInt(orderIdFilter.trim(), 10) : undefined;
      const params = Number.isNaN(orderId) ? undefined : { order_id: orderId };
      const data = await listOrderEventsApi(params);
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
      <Text style={styles.title}>Eventos de pedidos</Text>
      {!!errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <Text style={styles.label}>Id de orden</Text>
      <TextInput
        value={orderIdFilter}
        onChangeText={setOrderIdFilter}
        placeholder="Ingrese un ID o se mostraran todos"
        placeholderTextColor="#8b949e"
        keyboardType="numeric"
        style={styles.input}
      />
      <Pressable onPress={load} style={styles.btn}>
        <Text style={styles.btnText}>Buscar / Refrescar</Text>
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No hay eventos.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.rowText}>
                Orden {item.order_id} - {item.event_type} ({item.source})
              </Text>
              {item.note ? <Text style={styles.rowSub} numberOfLines={1}>{item.note}</Text> : null}
              {item.created_at ? <Text style={styles.rowSub}>{formatDate(item.created_at)}</Text> : null}
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
  label: { color: "#8b949e", marginBottom: 6, marginTop: 6 },
  input: {
    backgroundColor: "#161b22",
    color: "#c9d1d9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#30363d",
  },
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
  rowSub: { color: "#8b949e", marginTop: 2, fontSize: 12 },
});
