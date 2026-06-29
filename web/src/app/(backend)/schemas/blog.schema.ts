import z from "zod";
import { nameSchema, objectIdSchema, slugSchema } from "./base.schema";

const blogContentBlockBaseSchema = z.object({
  order: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  archived: z.boolean().optional(),
});

const markdownBlockSchema = blogContentBlockBaseSchema.extend({
  type: z.literal("MARKDOWN"),
  markdown: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Markdown é obrigatório"
          : "Markdown deve ser um texto",
    })
    .min(1, "Markdown não pode estar vazio"),
  videoUrl: z.never().optional(),
});

const videoBlockSchema = blogContentBlockBaseSchema.extend({
  type: z.literal("VIDEO"),
  videoUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "URL do vídeo é obrigatória"
          : "URL do vídeo deve ser um texto",
    })
    .url("URL do vídeo inválida"),
  markdown: z.never().optional(),
});

export const createBlogContentBlockSchema = z.discriminatedUnion("type", [
  markdownBlockSchema,
  videoBlockSchema,
]);

export const patchBlogContentBlockSchema = z
  .object({
    type: z.enum(["MARKDOWN", "VIDEO"]).optional(),
    order: z.number().int().min(0).optional(),
    markdown: z.string().min(1, "Markdown não pode estar vazio").optional(),
    videoUrl: z.string().url("URL do vídeo inválida").optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    archived: z.boolean().optional(),
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Pelo menos um campo precisa ser fornecido para atualização",
  })
  .superRefine((data, ctx) => {
    if (data.type === "MARKDOWN" && data.videoUrl !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Blocos MARKDOWN não podem ter videoUrl",
        path: ["videoUrl"],
      });
    }

    if (data.type === "VIDEO" && data.markdown !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: "Blocos VIDEO não podem ter markdown",
        path: ["markdown"],
      });
    }
  });

export const reorderBlogContentBlocksSchema = z.object({
  blocks: z
    .array(
      z.object({
        id: objectIdSchema,
        order: z.number().int().min(0),
      })
    )
    .min(1, "Pelo menos um bloco precisa ser fornecido"),
});

export const createBlogSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  description: z.string().optional(),
  imageUrl: z.string().url("URL da imagem inválida").optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
  publishedAt: z.coerce.date().optional(),
  archived: z.boolean().optional(),
});

export const patchBlogSchema = createBlogSchema
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "Pelo menos um campo precisa ser fornecido para atualização",
  });

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type PatchBlogInput = z.infer<typeof patchBlogSchema>;
export type CreateBlogContentBlockInput = z.infer<
  typeof createBlogContentBlockSchema
>;
export type PatchBlogContentBlockInput = z.infer<
  typeof patchBlogContentBlockSchema
>;
export type ReorderBlogContentBlocksInput = z.infer<
  typeof reorderBlogContentBlocksSchema
>;
