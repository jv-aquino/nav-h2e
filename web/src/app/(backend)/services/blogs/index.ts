import prisma from "../db";
import type {
  CreateBlogInput,
  PatchBlogInput,
} from "@/backend/schemas";

type GetAllBlogsOptions = {
  archived?: boolean;
};

export async function getAllBlogs(options: GetAllBlogsOptions = {}) {
  try {
    const where =
      options.archived === undefined ? {} : { archived: options.archived };

    return await prisma.blog.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao buscar blogs");
  }
}

export async function getBlogById(id: string) {
  try {
    return await prisma.blog.findUnique({
      where: { id },
      include: {
        contentBlocks: {
          orderBy: { order: "asc" },
        },
      },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao buscar blog");
  }
}

export async function createBlog(data: CreateBlogInput) {
  try {
    return await prisma.blog.create({
      data: {
        name: data.name,
        description: data.description,
        slug: data.slug,
        imageUrl: data.imageUrl,
        tags: data.tags ?? [],
        publishedAt: data.publishedAt,
        archived: data.archived,
      },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao criar blog");
  }
}

export async function updateBlog(id: string, data: PatchBlogInput) {
  try {
    return await prisma.blog.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao atualizar blog");
  }
}

export async function deleteBlog(id: string) {
  try {
    return await prisma.blog.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(String(error) || "Falha ao deletar blog");
  }
}

export async function blogExists(id: string) {
  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { id: true },
  });

  return blog !== null;
}
