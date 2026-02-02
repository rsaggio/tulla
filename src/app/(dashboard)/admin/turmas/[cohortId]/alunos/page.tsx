"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";

interface Student {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface Cohort {
  _id: string;
  name: string;
  code: string;
  maxStudents?: number;
  students: Student[];
}

export default function GerenciarAlunosPage() {
  const params = useParams();
  const cohortId = params.cohortId as string;
  const [loading, setLoading] = useState(true);
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [addingStudent, setAddingStudent] = useState(false);
  const [removingStudentId, setRemovingStudentId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [cohortId]);

  async function loadData() {
    try {
      const [cohortRes, studentsRes] = await Promise.all([
        fetch(`/api/cohorts/${cohortId}`),
        fetch("/api/users?role=aluno"),
      ]);

      if (cohortRes.ok) {
        const cohortData = await cohortRes.json();
        setCohort(cohortData);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setAllStudents(studentsData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddStudent() {
    if (!selectedStudent) return;

    setAddingStudent(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/cohorts/${cohortId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent._id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao adicionar aluno");
      }

      const updatedCohort = await res.json();
      setCohort((prev) => prev ? { ...prev, students: updatedCohort.students } : null);
      setSuccess(`${selectedStudent.name} foi adicionado à turma`);
      setDialogOpen(false);
      setSelectedStudent(null);
    } catch (error: any) {
      console.error("Erro:", error);
      setError(error.message || "Erro ao adicionar aluno");
    } finally {
      setAddingStudent(false);
    }
  }

  async function handleRemoveStudent(studentId: string, studentName: string) {
    if (!confirm(`Tem certeza que deseja remover ${studentName} da turma?`)) {
      return;
    }

    setRemovingStudentId(studentId);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/cohorts/${cohortId}/students`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao remover aluno");
      }

      const updatedCohort = await res.json();
      setCohort((prev) => prev ? { ...prev, students: updatedCohort.students } : null);
      setSuccess(`${studentName} foi removido da turma`);
    } catch (error: any) {
      console.error("Erro:", error);
      setError(error.message || "Erro ao remover aluno");
    } finally {
      setRemovingStudentId(null);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cohort) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Turma não encontrada
        </Typography>
        <Link href="/admin/turmas" passHref style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ mt: 2 }}>
            Voltar para Turmas
          </Button>
        </Link>
      </Box>
    );
  }

  const availableStudents = allStudents.filter(
    (student) => !cohort.students.some((enrolled) => enrolled._id === student._id)
  );

  const canAddMoreStudents = !cohort.maxStudents || cohort.students.length < cohort.maxStudents;

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/turmas/${cohortId}`} passHref style={{ textDecoration: "none" }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            Gerenciar Alunos
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {cohort.name} - {cohort.code}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setDialogOpen(true)}
          disabled={!canAddMoreStudents}
        >
          Adicionar Aluno
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Alunos Matriculados ({cohort.students.length}
              {cohort.maxStudents ? ` / ${cohort.maxStudents}` : ""})
            </Typography>
            {cohort.maxStudents && (
              <Chip
                label={
                  cohort.students.length >= cohort.maxStudents
                    ? "Turma Cheia"
                    : `${cohort.maxStudents - cohort.students.length} vagas disponíveis`
                }
                color={cohort.students.length >= cohort.maxStudents ? "error" : "success"}
                size="small"
              />
            )}
          </Box>

          {cohort.students.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 6 }}>
              <Typography variant="body1" color="text.secondary">
                Nenhum aluno matriculado ainda
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Clique em "Adicionar Aluno" para começar
              </Typography>
            </Box>
          ) : (
            <List>
              {cohort.students.map((student) => (
                <ListItem
                  key={student._id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleRemoveStudent(student._id, student.name)}
                      disabled={removingStudentId === student._id}
                    >
                      {removingStudentId === student._id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={student.profileImage}>
                      {student.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={student.name}
                    secondary={student.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() => !addingStudent && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Aluno à Turma</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Autocomplete
              options={availableStudents}
              getOptionLabel={(option) => `${option.name} (${option.email})`}
              value={selectedStudent}
              onChange={(_, newValue) => setSelectedStudent(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Selecione um aluno"
                  placeholder="Digite para buscar..."
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option._id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={option.profileImage} sx={{ width: 32, height: 32 }}>
                      {option.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              disabled={addingStudent}
            />

            {availableStudents.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Todos os alunos já estão matriculados nesta turma
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={addingStudent}>
            Cancelar
          </Button>
          <Button
            onClick={handleAddStudent}
            variant="contained"
            disabled={!selectedStudent || addingStudent}
          >
            {addingStudent ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
