import { Container, Paper, Typography, Stack } from "@mui/material";

export default function HomePage() {
  return (
    <Container maxWidth={false} sx={{ mt: 3, px: 3 }}>
      <Paper sx={{ p: 4 }}>
        <Stack alignItems="center" spacing={3}>
          <Typography variant="h4" align="center">
            Sistema de Gestión de Pedidos
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Examen complexivo
          </Typography>
          <Typography variant="body1">
            Adriana Vargas
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
