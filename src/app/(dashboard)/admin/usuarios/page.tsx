"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "aluno" | "instrutor" | "admin";
  createdAt: string;
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "aluno" as "aluno" | "instrutor" | "admin",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [search, users]);

  async function loadUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingUser ? `/api/users/${editingUser._id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowCreateForm(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", role: "aluno" });
        loadUsers();
        alert(
          editingUser
            ? "Usuário atualizado com sucesso!"
            : "Usuário criado com sucesso!"
        );
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao salvar usuário");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar usuário");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        loadUsers();
        alert("Usuário excluído com sucesso!");
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao excluir usuário");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir usuário");
    }
  }

  function startEdit(user: User) {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    setShowCreateForm(true);
  }

  function cancelForm() {
    setShowCreateForm(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "aluno" });
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Gerenciar Usuários
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Administre todos os usuários da plataforma
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          Novo Usuário
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PeopleIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Total
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Alunos
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {users.filter((u) => u.role === "aluno").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Instrutores
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {users.filter((u) => u.role === "instrutor").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {showCreateForm && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {editingUser ? "Editar Usuário" : "Criar Novo Usuário"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {editingUser
                ? "Atualize as informações do usuário"
                : "Preencha os dados para criar um novo usuário"}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Senha ${editingUser ? "(deixe em branco para não alterar)" : ""}`}
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Função"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "aluno" | "instrutor" | "admin",
                      })
                    }
                  >
                    <MenuItem value="aluno">Aluno</MenuItem>
                    <MenuItem value="instrutor">Instrutor</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={saving}
                    >
                      {saving ? "Salvando..." : editingUser ? "Salvar" : "Criar"}
                    </Button>
                    <Button variant="outlined" onClick={cancelForm}>
                      Cancelar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {filteredUsers.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PeopleIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {search ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredUsers.map((user) => (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="body1" fontWeight="medium" noWrap>
                        {user.name}
                      </Typography>
                      <Chip
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        color={
                          user.role === "admin"
                            ? "error"
                            : user.role === "instrutor"
                            ? "secondary"
                            : "primary"
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      Criado{" "}
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => startEdit(user)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
