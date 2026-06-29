import { BlogFormData } from '@/app/(frontend)/admin/dashboard/blogs/_components/BlogForm';
import { Blog } from '@/generated/prisma';
import { handleApiError } from '@/utils/api-error';

export const getBlogs = async () => {
  const response = await fetch('/api/blogs');
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    await handleApiError(response, 'Erro ao buscar lições');
  }
};

export const getBlog = async (blogId: string) => {
  const response = await fetch(`/api/blogs/${blogId}`);
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    await handleApiError(response, 'Erro ao buscar lição');
  }
};

export const createBlog = async (data: BlogFormData) => {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    const created = await response.json();
    return created;
  } else {
    await handleApiError(response, 'Erro ao criar lição');
  }
};

export const updateBlog = async (blogId: string, data: Partial<Blog>) => {
  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (response.ok) {
    const updated = await response.json();
    return updated;
  } else {
    await handleApiError(response, 'Erro ao atualizar lição');
  }
};

export const deleteBlog = async (blogId: string) => {
  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    await handleApiError(response, 'Erro ao deletar lição');
  }
  
  return true;
};