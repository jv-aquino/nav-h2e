import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Blog } from '@/generated/prisma';
import { MultiStepForm, type Step } from '@/components/ui/multi-step-form';
import toast from 'react-hot-toast';
import TagEditor from '@/components/common/TagEditor';

export type BlogFormData = Omit<Blog, 'id' | 'publishedAt' | 'updatedAt' | 'imageUrl'>;

interface BlogFormProps {
  editingBlog?: Blog | null;
  onSubmit: (data: BlogFormData) => Promise<void>;
  onCancel: () => void;
  submitText?: string;
  loading?: boolean;
}

const EMPTY_BLOG: BlogFormData = {
  name: '',
  description: '',
  slug: '',
  tags: [],
  archived: false,
};

export function BlogForm({ 
  editingBlog, 
  onSubmit, 
  onCancel, 
  submitText = "Adicionar Lição →",
  loading = false 
}: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(
    editingBlog ? { ...editingBlog } : { ...EMPTY_BLOG }
  );
  const [knowledgeComponent, setKnowledgeComponent] = useState('');
  const [prerequisite, setPrerequisite] = useState('');

  // Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };
  
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    setFormData((prev) => ({ ...prev, slug }));
  };
  
  const handleTagsChange = (tags: string[]) => {
    setFormData((prev) => ({ ...prev, tags }));
  };

  const steps: Step[] = [
    {
      id: 'basic-info',
      title: 'Informações Básicas',
      validation: () => !!formData.name.trim() || !!formData?.description?.trim(),
      content: (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Lição *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Ex: Introdução à Álgebra"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={handleDescriptionChange}
              placeholder="Breve descrição da lição"
            />
          </div>
        </>
      )
    },
    {
      id: "meta-infos",
      title: "Meta Infos",
      validation: () => !!formData.slug.trim(),
      content: (
        <>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug*</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="curso-de-astronomia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <TagEditor tags={formData.tags} onChange={handleTagsChange} />
          </div>
        </>
      ),
    },
  ];

  
  const handleSubmit = async (data: typeof EMPTY_BLOG) => {
    if (loading) {
      return;
    }
    try {
      await onSubmit(data);
    } catch (error: unknown) {
      toast.error((error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  return (
    <MultiStepForm
      steps={steps}
      onComplete={handleSubmit}
      onCancel={onCancel}
      submitText={submitText}
      cancelText="Cancelar"
      continueText="Continuar"
      backText="Voltar"
      initialData={formData}
      className="space-y-6"
    />
  );
}