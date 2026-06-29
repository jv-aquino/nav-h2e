"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReorderableList } from "@/components/common/ReorderableList";
import { Plus, Edit3, Laptop } from "lucide-react";
import { ContentPage, ContentBlock } from "@/generated/prisma";
import CreateBlockDialog from "./CreateBlockDialog";
import SelectExerciseDialog from "./SelectExerciseDialog";
import SelectSimulationDialog from "./SelectSimulationDialog";
type ContentPageWithBlocks = ContentPage & { contentBlocks: ContentBlock[] };

interface LessonContentSidebarProps {
  contentPages: ContentPageWithBlocks[];
  selectedPage: ContentPageWithBlocks | null;
  onSelectPage: (page: ContentPageWithBlocks) => void;
  pageOrder: string[];
  onPageOrderChange: (newOrder: string[]) => void;
  pageOrderChanged: boolean;
  onSavePageOrder: () => void;
  blockOrder: string[];
  onBlockOrderChange: (newOrder: string[]) => void;
  blockOrderChanged: boolean;
  onSaveBlockOrder: () => void;
  selectedBlock: ContentBlock | null;
  onSelectBlock: (block: ContentBlock) => void;
  onCreateBlock: (type: 'MARKDOWN' | 'VIDEO' | 'EXERCISE' | 'SIMULATION', exerciseId?: string, simulationId?: string) => void;
  saving: boolean;
}

export default function LessonContentSidebar({
  contentPages,
  selectedPage,
  onSelectPage,
  pageOrder,
  onPageOrderChange,
  pageOrderChanged,
  onSavePageOrder,
  blockOrder,
  onBlockOrderChange,
  blockOrderChanged,
  onSaveBlockOrder,
  selectedBlock,
  onSelectBlock,
  onCreateBlock,
  saving,
}: LessonContentSidebarProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [showSimulationDialog, setShowSimulationDialog] = useState(false);

  const handleCreateBlock = (type: 'MARKDOWN' | 'VIDEO' | 'EXERCISE' | 'SIMULATION') => {
    if (type === 'EXERCISE') {
      setShowBlockDialog(false);
      setShowExerciseDialog(true);
    } else if (type === 'SIMULATION') {
      setShowBlockDialog(false);
      setShowSimulationDialog(true);
    } else {
      onCreateBlock(type);
      setShowBlockDialog(false);
    }
  };

  const handleSelectExercise = (exerciseId: string) => {
    onCreateBlock('EXERCISE', exerciseId);
    setShowExerciseDialog(false);
  };

  const handleSelectSimulation = (simulationId: string) => {
    onCreateBlock('SIMULATION', undefined, simulationId);
    setShowSimulationDialog(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Páginas</h3>
      {contentPages.length === 0 ? (
        <p className="text-gray-500 text-sm mb-4">
          Nenhuma página criada ainda. Crie sua primeira página para começar.
        </p>
      ) : (
        <div className="space-y-2 mb-6">
          <ReorderableList
            items={pageOrder.map(id => contentPages.find(p => p.id === id)).filter(Boolean) as ContentPageWithBlocks[]}
            onOrderChange={onPageOrderChange}
            renderItem={page => (
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors w-full ${
                  selectedPage?.id === page.id
                    ? 'bg-pink-200 border border-pink-300'
                    : 'bg-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => onSelectPage(page)}
              >
                <h4 className="font-medium text-sm text-pink-900">{page.name}</h4>
                <p className="text-xs text-slate-500">
                  {page.contentBlocks.length} blocos
                </p>
              </div>
            )}
            className="space-y-2"
          />
        </div>
      )}
      {pageOrderChanged && (
        <div className="flex justify-end mb-4">
          <Button onClick={onSavePageOrder} disabled={saving}>
            Salvar Ordem
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-md">Blocos de Conteúdo</h4>
        <Button size="sm" onClick={() => setShowBlockDialog(true)} disabled={saving} className="text-xs">
          <Plus className="w-3 h-3 mr-1" /> Novo Bloco
        </Button>
      </div>
      <div className="space-y-1">
        {selectedPage && (
          <ReorderableList
            items={blockOrder.map(id => selectedPage.contentBlocks.find(b => b.id === id)).filter(Boolean) as ContentBlock[]}
            onOrderChange={onBlockOrderChange}
            renderItem={block => (
              <div
                className={`p-2 rounded cursor-pointer transition-colors text-sm w-full ${
                  selectedBlock?.id === block.id
                    ? 'bg-pink-200 border border-pink-400'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => onSelectBlock(block)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-pink-900">
                    {block.type === 'MARKDOWN' && 'Markdown'}
                    {block.type === 'VIDEO' && 'Vídeo'}
                    {block.type === 'EXERCISE' && 'Exercício'}
                    {block.type === 'SIMULATION' && 'Simulação'}
                    {!['MARKDOWN', 'VIDEO', 'EXERCISE', 'SIMULATION'].includes(block.type) && block.type}
                  </span>
                  {block.type === 'MARKDOWN' && (
                    <Edit3 className="w-3 h-3 text-gray-400" />
                  )}
                  {block.type === 'SIMULATION' && (
                    <Laptop className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              </div>
            )}
            className="space-y-1"
          />
        )}
      </div>
      {blockOrderChanged && (
        <div className="flex justify-end mt-4">
          <Button onClick={onSaveBlockOrder} disabled={saving} size="sm">
            Salvar Ordem
          </Button>
        </div>
      )}

      <CreateBlockDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onCreateBlock={handleCreateBlock}
        saving={saving}
      />

      <SelectExerciseDialog
        open={showExerciseDialog}
        onOpenChange={setShowExerciseDialog}
        onSelectExercise={handleSelectExercise}
      />

      <SelectSimulationDialog
        open={showSimulationDialog}
        onOpenChange={setShowSimulationDialog}
        onSelectSimulation={handleSelectSimulation}
      />
    </div>
  );
} 