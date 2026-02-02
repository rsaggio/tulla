"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  recordingUrl: string;
  date: string;
  duration?: number;
  instructor: {
    name: string;
  };
  cohortId: {
    name: string;
    code: string;
  };
}

export default function AulasGravadasAdminPage() {
  const searchParams = useSearchParams();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const cohortIdFilter = searchParams.get("cohortId");

  useEffect(() => {
    loadLiveClasses();
  }, [cohortIdFilter]);

  async function loadLiveClasses() {
    try {
      const url = cohortIdFilter
        ? `/api/admin/live-classes?cohortId=${cohortIdFilter}`
        : "/api/admin/live-classes";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLiveClasses(data.liveClasses);
      }
    } catch (error) {
      console.error("Erro ao carregar aulas gravadas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta aula gravada?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/live-classes/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLiveClasses(liveClasses.filter((lc) => lc._id !== id));
      } else {
        alert("Erro ao deletar aula gravada");
      }
    } catch (error) {
      console.error("Erro ao deletar aula gravada:", error);
      alert("Erro ao deletar aula gravada");
    }
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {cohortIdFilter && (
            <Link href={`/admin/turmas/${cohortIdFilter}`} passHref style={{ textDecoration: "none" }}>
              <IconButton>
                <ArrowBackIcon />
              </IconButton>
            </Link>
          )}
          <Box>
            <Typography variant="h3" fontWeight="bold">
              Aulas Gravadas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {cohortIdFilter
                ? `Gravações filtradas por turma`
                : "Gerencie as gravações das aulas ao vivo"}
            </Typography>
          </Box>
        </Box>
        <Link
          href={cohortIdFilter ? `/admin/aulas-gravadas/nova?cohortId=${cohortIdFilter}` : "/admin/aulas-gravadas/nova"}
          passHref
          style={{ textDecoration: "none" }}
        >
          <Button variant="contained" startIcon={<AddIcon />}>
            Nova Aula Gravada
          </Button>
        </Link>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {liveClasses.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <VideoLibraryIcon sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Nenhuma aula gravada cadastrada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Adicione gravações das aulas ao vivo para sua turma
              </Typography>
              <Link href="/admin/aulas-gravadas/nova" passHref style={{ textDecoration: "none" }}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Adicionar Primeira Aula
                </Button>
              </Link>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Turma</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Duração</TableCell>
                  <TableCell>Instrutor</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {liveClasses.map((liveClass) => (
                  <TableRow key={liveClass._id} hover>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" fontWeight="medium">
                          {liveClass.title}
                        </Typography>
                        {liveClass.description && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                            {liveClass.description.substring(0, 60)}
                            {liveClass.description.length > 60 && "..."}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={liveClass.cohortId.code}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(liveClass.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {liveClass.duration ? `${liveClass.duration} min` : "-"}
                    </TableCell>
                    <TableCell>{liveClass.instructor.name}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          size="small"
                          color="primary"
                          href={liveClass.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Assistir gravação"
                        >
                          <PlayArrowIcon />
                        </IconButton>
                        <Link href={`/admin/aulas-gravadas/${liveClass._id}/editar`} passHref>
                          <IconButton size="small" color="primary" title="Editar">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(liveClass._id)}
                          title="Deletar"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
