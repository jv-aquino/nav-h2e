import prisma from "../db";
import { blogExists } from "../blogs";
import type { Prisma } from "@/generated/prisma";
import type {
  CreateBlogContentBlockInput,
  PatchBlogContentBlockInput,
  ReorderBlogContentBlocksInput,
} from "@/backend/schemas";

const ORDER_OFFSET = 10000;

async function assertBlogExists(blogId: string) {
  const exists = await blogExists(blogId);

  if (!exists) {
    throw new Error("Blog não encontrado");
  }
}

async function getNextBlockOrder(blogId: string) {
  const lastBlock = await prisma.blogContentBlock.findFirst({
    where: { blogId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return lastBlock ? lastBlock.order + 1 : 0;
}

export async function getBlocksByBlogId(blogId: string) {
  try {
    await assertBlogExists(blogId);

    return await prisma.blogContentBlock.findMany({
      where: { blogId },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao buscar blocos do blog");
  }
}

export async function getBlockById(blogId: string, blockId: string) {
  try {
    return await prisma.blogContentBlock.findFirst({
      where: {
        id: blockId,
        blogId,
      },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao buscar bloco do blog");
  }
}

export async function createBlock(
  blogId: string,
  data: CreateBlogContentBlockInput
) {
  try {
    await assertBlogExists(blogId);

    const order =
      data.order !== undefined ? data.order : await getNextBlockOrder(blogId);

    return await prisma.blogContentBlock.create({
      data: {
        blogId,
        type: data.type,
        order,
        markdown: data.type === "MARKDOWN" ? data.markdown : null,
        videoUrl: data.type === "VIDEO" ? data.videoUrl : null,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
        archived: data.archived,
      },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao criar bloco do blog");
  }
}

export async function updateBlock(
  blogId: string,
  blockId: string,
  data: PatchBlogContentBlockInput
) {
  try {
    const existingBlock = await getBlockById(blogId, blockId);

    if (!existingBlock) {
      throw new Error("Bloco não encontrado");
    }

    const nextType = data.type ?? existingBlock.type;

    if (data.order !== undefined && data.order !== existingBlock.order) {
      return await prisma.$transaction(async (tx) => {
        await tx.blogContentBlock.update({
          where: { id: blockId },
          data: { order: existingBlock.order + ORDER_OFFSET },
        });

        return tx.blogContentBlock.update({
          where: { id: blockId },
          data: {
            type: data.type,
            order: data.order,
            markdown:
              nextType === "MARKDOWN"
                ? (data.markdown ?? existingBlock.markdown)
                : null,
            videoUrl:
              nextType === "VIDEO"
                ? (data.videoUrl ?? existingBlock.videoUrl)
                : null,
            metadata:
              (data.metadata ??
                existingBlock.metadata ??
                undefined) as Prisma.InputJsonValue | undefined,
            archived: data.archived,
          },
        });
      });
    }

    return await prisma.blogContentBlock.update({
      where: { id: blockId },
      data: {
        type: data.type,
        markdown:
          nextType === "MARKDOWN"
            ? (data.markdown ?? existingBlock.markdown)
            : data.type === "VIDEO"
              ? null
              : undefined,
        videoUrl:
          nextType === "VIDEO"
            ? (data.videoUrl ?? existingBlock.videoUrl)
            : data.type === "MARKDOWN"
              ? null
              : undefined,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
        archived: data.archived,
      },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao atualizar bloco do blog");
  }
}

export async function deleteBlock(blogId: string, blockId: string) {
  try {
    const existingBlock = await getBlockById(blogId, blockId);

    if (!existingBlock) {
      throw new Error("Bloco não encontrado");
    }

    return await prisma.blogContentBlock.delete({
      where: { id: blockId },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao deletar bloco do blog");
  }
}

export async function reorderBlocks(
  blogId: string,
  data: ReorderBlogContentBlocksInput
) {
  try {
    await assertBlogExists(blogId);

    const existingBlocks = await prisma.blogContentBlock.findMany({
      where: { blogId },
      select: { id: true },
    });

    if (existingBlocks.length === 0) {
      throw new Error("Blog não possui blocos para reordenar");
    }

    const existingIds = new Set(existingBlocks.map((block) => block.id));
    const payloadIds = data.blocks.map((block) => block.id);

    if (payloadIds.length !== existingBlocks.length) {
      throw new Error("Todos os blocos do blog devem ser informados");
    }

    const uniquePayloadIds = new Set(payloadIds);

    if (uniquePayloadIds.size !== payloadIds.length) {
      throw new Error("IDs de blocos duplicados no payload");
    }

    for (const id of payloadIds) {
      if (!existingIds.has(id)) {
        throw new Error("Bloco não pertence a este blog");
      }
    }

    const uniqueOrders = new Set(data.blocks.map((block) => block.order));

    if (uniqueOrders.size !== data.blocks.length) {
      throw new Error("Ordens duplicadas no payload");
    }

    return await prisma.$transaction(async (tx) => {
      for (const block of existingBlocks) {
        await tx.blogContentBlock.update({
          where: { id: block.id },
          data: {
            order: {
              increment: ORDER_OFFSET,
            },
          },
        });
      }

      for (const block of data.blocks) {
        await tx.blogContentBlock.update({
          where: { id: block.id },
          data: { order: block.order },
        });
      }

      return tx.blogContentBlock.findMany({
        where: { blogId },
        orderBy: { order: "asc" },
      });
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao reordenar blocos do blog");
  }
}
