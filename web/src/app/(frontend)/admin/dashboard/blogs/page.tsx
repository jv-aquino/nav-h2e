"use client";
import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Blog } from "@/generated/prisma";
import { BookCopy, Plus } from "lucide-react";
import AdminHeader from "@/components/base/header/AdminHeader";
import { Button } from "@/components/ui/button";
import { BlogForm, BlogCard, BlogFilterBar } from "./_components";
import { getBlogs, createBlog, updateBlog, deleteBlog } from "@/actions/blogs";
import { getErrorMessage } from "@/utils/api-error";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BlogFormData } from "./_components/BlogForm";

export default function BlogsAdmPage() {
  const { data: blogs, error, isLoading, mutate } = useSWR<Blog[]>('/api/blogs', getBlogs);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');

  const Paragraph = () => (
    <>Gerencie blogs, crie conteúdo com Markdown + LaTeX e organize o conteúdo.</>
  );

  const handleSubmit = async (data: BlogFormData) => {
    try {
      setIsSubmitting(true);
      
      if (editingBlog) {
        await updateBlog(editingBlog.id, data);
        toast.success('Blog atualizada com sucesso!');
      } else {
        await createBlog(data);
        toast.success('Blog criada com sucesso!');
      }

      mutate();
      handleCancel();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar blog'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingBlog(null);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog as Blog);
    setIsDialogOpen(true);
  };

  const handleDelete = async (blogId: string) => {
    try {
      await deleteBlog(blogId);
      mutate();
      toast.success('Blog excluída com sucesso!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir blog'));
    }
  };



  // Filter blogs based on search and filters
  const filteredBlogs = (blogs || []).filter(blog => {
    const matchesSearch = blog.name.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <>
      <AdminHeader Icon={BookCopy} Paragraph={Paragraph} title="Blogs">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button type="button" className="admin-header-button colorTransition">
              <Plus /> Adicionar Blog
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between pb-4">
              <DialogTitle className="text-xl font-semibold">
                {editingBlog ? 'Editar Blog' : 'Adicionar Blog'}
              </DialogTitle>
            </DialogHeader>
            <BlogForm
              editingBlog={editingBlog}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitText={editingBlog ? "Salvar Alterações →" : "Adicionar Blog →"}
              loading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </AdminHeader>

      <div className="w-full mx-2 mt-8">
          <>
            <BlogFilterBar
              search={search}
              onSearch={setSearch}
            />

            {isLoading ? (
              <div className="text-center py-8">
                <div className="loading-spin"></div>
                <p className="mt-2 text-gray-600">Carregando blogs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Erro ao carregar blogs</p>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-8">
                <BookCopy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {(blogs || []).length === 0 ? 'Nenhum blog encontrado' : 'Nenhum blog corresponde aos filtros'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {(blogs || []).length === 0 
                    ? 'Comece criando seu primeiro blog para organizar o conteúdo.'
                    : 'Tente ajustar os filtros para encontrar os blogs que procura.'
                  }
                </p>
                {(blogs || []).length === 0 && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Blog
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlogs.map((blog) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog as Blog}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {filteredBlogs.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="admin-header-button"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Blog
                </Button>
              </div>
            )}
          </>
      </div>
    </>
  );
} 