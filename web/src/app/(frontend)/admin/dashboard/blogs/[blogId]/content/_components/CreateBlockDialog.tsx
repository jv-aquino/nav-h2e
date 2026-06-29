"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Video, ClipboardList, Laptop } from "lucide-react";

interface CreateBlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBlock: (type: 'MARKDOWN' | 'VIDEO' | 'EXERCISE' | 'SIMULATION') => void;
  saving: boolean;
}

export default function CreateBlockDialog({
  open,
  onOpenChange,
  onCreateBlock,
  saving,
}: CreateBlockDialogProps) {
  const [selectedType, setSelectedType] = useState<'MARKDOWN' | 'VIDEO' | 'EXERCISE' | 'SIMULATION' | null>(null);

  const handleCreate = () => {
    if (!selectedType) return;
    onCreateBlock(selectedType);
    setSelectedType(null);
  };

  const blockTypes = [
    {
      type: 'MARKDOWN' as const,
      icon: FileText,
      label: 'Markdown',
      description: 'Texto rico com suporte a LaTeX',
      available: true,
    },
    {
      type: 'VIDEO' as const,
      icon: Video,
      label: 'Vídeo',
      description: 'Incorporar vídeo do YouTube ou Vimeo',
      available: false,
    },
    {
      type: 'EXERCISE' as const,
      icon: ClipboardList,
      label: 'Exercício',
      description: 'Adicionar exercício existente',
      available: true,
    },
    {
      type: 'SIMULATION' as const,
      icon: Laptop,
      label: 'Simulação',
      description: 'Adicionar simulação interativa',
      available: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Bloco de Conteúdo</DialogTitle>
          <DialogDescription>
            Escolha o tipo de conteúdo que deseja adicionar à página.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {blockTypes.map(({ type, icon: Icon, label, description, available }) => (
            <button
              key={type}
              onClick={() => available && setSelectedType(type)}
              disabled={!available}
              className={`
                flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all
                ${!available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${selectedType === type 
                  ? 'border-pink-500 bg-pink-50' 
                  : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50 hover:text-pink-600'
                }
              `}
            >
              <div className={`
                p-2 rounded-lg 
                ${selectedType === type ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-pink-600">{label}</h4>
                  {!available && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                      Em breve
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setSelectedType(null);
            }}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedType || saving}
          >
            {saving ? 'Criando...' : 'Criar Bloco'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
