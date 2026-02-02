"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Lesson {
  _id: string;
  title: string;
  type: string;
  order: number;
  content?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  estimatedHours: number;
  requirements: string[];
  deliverables: string[];
  githubRequired: boolean;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  courseId: string;
  lessons: Lesson[];
}

function SortableLessonItem({
  lesson,
  index,
  courseId,
  moduleId,
}: {
  lesson: Lesson;
  index: number;
  courseId: string;
  moduleId: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        border: "1px solid",
        borderColor: isDragging ? "primary.main" : "divider",
        borderRadius: 1,
        bgcolor: isDragging ? "action.hover" : "background.paper",
        opacity: isDragging ? 0.8 : 1,
        boxShadow: isDragging ? 4 : 0,
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "grab",
          color: "text.secondary",
          "&:hover": { color: "text.primary" },
          "&:active": { cursor: "grabbing" },
        }}
      >
        <DragIndicatorIcon />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="body1" fontWeight="medium">
            {index + 1}. {lesson.title}
          </Typography>
          <Chip
            label={
              lesson.type === "teoria"
                ? "Teoria"
                : lesson.type === "video"
                ? "Vídeo"
                : lesson.type === "quiz"
                ? "Quiz"
                : lesson.type === "activity"
                ? "Exercício Prático"
                : "Leitura"
            }
            variant="outlined"
            size="small"
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          {lesson.content
            ? `${lesson.content.length} caracteres`
            : "Sem conteúdo"}
        </Typography>
      </Box>
      <Link
        href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/${lesson._id}/editar`}
        passHref
      >
        <Button variant="text" size="small" startIcon={<EditIcon />}>
          Editar
        </Button>
      </Link>
    </Box>
  );
}

export default function ModuloDetalhesPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = use(params);
  const [module, setModule] = useState<Module | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadModule();
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadModule() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`);
      if (res.ok) {
        const lessons = await res.json();
        const moduleRes = await fetch(`/api/courses/${courseId}/modules/${moduleId}`);
        if (moduleRes.ok) {
          const moduleData = await moduleRes.json();
          setModule({ ...moduleData, lessons });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProjects() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || !module) return;

    const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);
    const oldIndex = sortedLessons.findIndex((l) => l._id === active.id);
    const newIndex = sortedLessons.findIndex((l) => l._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sortedLessons, oldIndex, newIndex).map(
      (lesson, i) => ({ ...lesson, order: i + 1 })
    );

    // Optimistic update
    setModule({ ...module, lessons: reordered });

    // Persist to server
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonIds: reordered.map((l) => l._id),
        }),
      });

      if (!res.ok) {
        // Revert on error
        setModule({ ...module, lessons: sortedLessons });
      }
    } catch {
      // Revert on error
      setModule({ ...module, lessons: sortedLessons });
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!module) {
    return (
      <Box sx={{ maxWidth: 800 }}>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Módulo não encontrado
            </Typography>
            <Link href={`/admin/conteudo/${courseId}`} passHref>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Voltar ao Curso
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const sortedLessons = [...module.lessons].sort((a, b) => a.order - b.order);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href={`/admin/conteudo/${courseId}`} passHref>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              Módulo {module.order}: {module.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {module.description}
            </Typography>
          </Box>
        </Box>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/editar`} passHref>
          <Button variant="contained" startIcon={<EditIcon />}>
            Editar Módulo
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Horas Estimadas
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {module.estimatedHours}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <MenuBookIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Total de Aulas
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {module.lessons?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Aulas do Módulo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Arraste para reordenar as aulas
              </Typography>
            </Box>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/nova`} passHref>
              <Button variant="contained" startIcon={<AddIcon />}>
                Nova Aula
              </Button>
            </Link>
          </Box>

          {!module.lessons || module.lessons.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <MenuBookIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Nenhuma aula criada ainda
              </Typography>
              <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/nova`} passHref>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Criar Primeira Aula
                </Button>
              </Link>
            </Box>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedLessons.map((l) => l._id)}
                strategy={verticalListSortingStrategy}
              >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {sortedLessons.map((lesson, index) => (
                    <SortableLessonItem
                      key={lesson._id}
                      lesson={lesson}
                      index={index}
                      courseId={courseId}
                      moduleId={moduleId}
                    />
                  ))}
                </Box>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Projetos do Módulo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Projetos práticos para os alunos
              </Typography>
            </Box>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/projetos/novo`} passHref>
              <Button variant="outlined" startIcon={<AddIcon />}>
                Novo Projeto
              </Button>
            </Link>
          </Box>

          {projects.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
              Nenhum projeto criado ainda
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {projects.map((project) => (
                <Box
                  key={project._id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
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
                      <Typography variant="body1" fontWeight="medium">
                        {project.title}
                      </Typography>
                      {project.githubRequired && (
                        <Chip label="GitHub" variant="outlined" size="small" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {project.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {project.estimatedHours}h estimadas • {project.requirements.length} requisitos • {project.deliverables.length} entregáveis
                    </Typography>
                  </Box>
                  <Link
                    href={`/admin/conteudo/${courseId}/modulos/${moduleId}/projetos/${project._id}/editar`}
                    passHref
                  >
                    <Button variant="text" size="small" startIcon={<EditIcon />}>
                      Editar
                    </Button>
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
