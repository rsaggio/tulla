"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginAction } from "../actions";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginAction(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/aluno");
        router.refresh();
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(66, 99, 235, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardHeader sx={{ textAlign: "center" }}>
            <CardTitle>Bootcamp</CardTitle>
            <CardDescription>
              Entre com sua conta para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <Stack spacing={3}>
                {error && (
                  <Alert severity="error" variant="outlined">
                    {error}
                  </Alert>
                )}

                <Box>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    autoComplete="email"
                  />
                </Box>

                <Box>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </Box>
              </Stack>
            </CardContent>

            <CardFooter>
              <Stack spacing={2} width="100%">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>

                <Typography variant="body2" textAlign="center" color="text.secondary">
                  Acesso exclusivo para alunos cadastrados.
                </Typography>
              </Stack>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </Box>
  );
}
