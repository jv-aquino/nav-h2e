import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock, BarChart3, Tag, BookOpen, MoreVertical } from 'lucide-react';
import { Blog } from '@/generated/prisma';
import Link from 'next/link';

interface BlogCardProps {
  blog: Blog;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blogId: string) => void;
}

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (onDelete && confirm(`Tem certeza que deseja excluir a lição "${blog.name}"?`)) {
      await onDelete(blog.id);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow
    flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{blog.name}</h3>
          </div>

          {blog.description && (
            <p className="text-gray-600 text-sm mb-3">{blog.description}</p>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMenu(!showMenu)}
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(blog);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-pink-900"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </button>
                )}
                <Link
                  href={`/admin/dashboard/blogs/${blog.id}/content`}
                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-pink-900"
                  onClick={() => setShowMenu(false)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Editar Conteúdo
                </Link>
                {onDelete && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      handleDelete();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-pink-900"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 