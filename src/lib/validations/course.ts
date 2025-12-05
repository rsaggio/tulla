import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  thumbnail: z.string().url("URL inválida").optional().or(z.literal("")),
  duration: z.number().min(1, "Duração deve ser maior que 0"),
  prerequisites: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const moduleSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  order: z.number().min(1, "Ordem deve ser maior que 0"),
  estimatedHours: z.number().min(0, "Horas estimadas devem ser maior ou igual a 0"),
  skills: z.array(z.string()).optional(),
});

export const lessonSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  content: z.string().min(10, "Conteúdo deve ter no mínimo 10 caracteres"),
  videoUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  order: z.number().min(1, "Ordem deve ser maior que 0"),
  type: z.enum(["teoria", "video", "leitura"]),
  resources: z
    .array(
      z.object({
        title: z.string().min(1, "Título do recurso é obrigatório"),
        url: z.string().url("URL inválida"),
      })
    )
    .optional(),
});

export const projectSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  requirements: z.array(z.string()).min(1, "Adicione pelo menos um requisito"),
  deliverables: z.array(z.string()).min(1, "Adicione pelo menos um entregável"),
  rubric: z
    .array(
      z.object({
        criterion: z.string().min(1, "Critério é obrigatório"),
        points: z.number().min(0, "Pontos devem ser maior ou igual a 0"),
        description: z.string().min(1, "Descrição é obrigatória"),
      })
    )
    .min(1, "Adicione pelo menos um critério de avaliação"),
  estimatedHours: z.number().min(1, "Horas estimadas devem ser maior que 0"),
  githubRequired: z.boolean().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
export type ModuleFormData = z.infer<typeof moduleSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
