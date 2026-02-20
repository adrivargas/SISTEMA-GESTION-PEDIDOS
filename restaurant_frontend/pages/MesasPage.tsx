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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { type Table as TableType, listTablesApi } from "../api/tables.api";

export default function MesasPage() {
  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await listTablesApi();
      setTables(data.results);
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
        <Typography variant="h5">Mesas</Typography>
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
                <TableCell>Nombre</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Disponible</TableCell>
                <TableCell>Creado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.capacity}</TableCell>
                  <TableCell>{t.is_available ? "Sí" : "No"}</TableCell>
                  <TableCell>{t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
