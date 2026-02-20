import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { type Order, listOrdersApi } from "../api/orders.api";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  SERVED: "Servido",
  PAID: "Pagado",
};

const STATUS_COLOR: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  PENDING: "warning",
  IN_PROGRESS: "info",
  SERVED: "primary",
  PAID: "success",
};

export default function OrdenesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listOrdersApi();
      setOrders(data.results);
    } catch {
      setError("No se pudo cargar. Verifica que el backend esté en ejecución.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container maxWidth={false} sx={{ mt: 3, px: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Órdenes</Typography>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={load} disabled={loading}>
          Refrescar
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 1 }}>Cargando...</Typography>
        </Stack>
      ) : (
        <Paper sx={{ p: 2, width: "100%" }}>
          <Table size="small" sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mesa</TableCell>
                <TableCell>Resumen</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Creado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.table_name ?? o.table}</TableCell>
                  <TableCell>{o.items_summary}</TableCell>
                  <TableCell>{o.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[o.status] ?? o.status}
                      color={STATUS_COLOR[o.status] ?? "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{o.created_at ? new Date(o.created_at).toLocaleString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
