"use client";
import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { Lesson, TopicLesson } from "@/generated/prisma";
import { BookCopy, Plus } from "lucide-react";
import AdminHeader from "@/components/base/header/AdminHeader";
import { Button } from "@/components/ui/button";
import { LessonForm, LessonCard, LessonFilterBar } from "./_components";
import { getLessons, createLesson, updateLesson, deleteLesson } from "@/actions/lessons";
import { getErrorMessage } from "@/utils/api-error";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Type for the API response which includes related data
type LessonWithRelations = Lesson & {
  topicLessons: TopicLesson[]
};

type LessonFormData = Omit<Lesson, 'id'>;

export default function LessonsAdmPage() {
  const { data: lessons, error, isLoading, mutate } = useSWR<LessonWithRelations[]>('/api/lessons', getLessons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonWithRelations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const Paragraph = () => (
    <>Gerencie lições, crie conteúdo com Markdown + LaTeX e organize o aprendizado dos alunos.</>
  );

  const handleSubmit = async (data: LessonFormData) => {
    try {
      setIsSubmitting(true);
      
      if (editingLesson) {
        await updateLesson(editingLesson.id, data);
        toast.success('Lição atualizada com sucesso!');
      } else {
        await createLesson(data);
        toast.success('Lição criada com sucesso!');
      }

      mutate();
      handleCancel();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao salvar lição'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingLesson(null);
  };

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson as LessonWithRelations);
    setIsDialogOpen(true);
  };

  const handleDelete = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId);
      mutate();
      toast.success('Lição excluída com sucesso!');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erro ao excluir lição'));
    }
  };



  // Filter lessons based on search and filters
  const filteredLessons = (lessons || []).filter(lesson => {
    const matchesSearch = lesson.name.toLowerCase().includes(search.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = !selectedType || lesson.type === selectedType;
    
    const matchesDifficulty = !selectedDifficulty || (() => {
      const [min, max] = selectedDifficulty.split('-').map(Number);
      return lesson.difficulty >= min && lesson.difficulty <= max;
    })();
    
    return matchesSearch && matchesType && matchesDifficulty;
  });

  return (
    <>
      <AdminHeader Icon={BookCopy} Paragraph={Paragraph} title="Lições">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button type="button" className="admin-header-button colorTransition">
              <Plus /> Adicionar Lição
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="flex flex-row items-center justify-between pb-4">
              <DialogTitle className="text-xl font-semibold">
                {editingLesson ? 'Editar Lição' : 'Adicionar Lição'}
              </DialogTitle>
            </DialogHeader>
            <LessonForm
              editingLesson={editingLesson}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitText={editingLesson ? "Salvar Alterações →" : "Adicionar Lição →"}
              loading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </AdminHeader>

      <div className="w-full mx-2 mt-8">
          <>
            <LessonFilterBar
              search={search}
              onSearch={setSearch}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
            />

            {isLoading ? (
              <div className="text-center py-8">
                <div className="loading-spin"></div>
                <p className="mt-2 text-gray-600">Carregando lições...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Erro ao carregar lições</p>
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="text-center py-8">
                <BookCopy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {(lessons || []).length === 0 ? 'Nenhuma lição encontrada' : 'Nenhuma lição corresponde aos filtros'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {(lessons || []).length === 0 
                    ? 'Comece criando sua primeira lição para organizar o conteúdo educacional.'
                    : 'Tente ajustar os filtros para encontrar as lições que procura.'
                  }
                </p>
                {(lessons || []).length === 0 && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Lição
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson as Lesson}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {filteredLessons.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="admin-header-button"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Nova Lição
                </Button>
              </div>
            )}
          </>
      </div>
    </>
  );
} 