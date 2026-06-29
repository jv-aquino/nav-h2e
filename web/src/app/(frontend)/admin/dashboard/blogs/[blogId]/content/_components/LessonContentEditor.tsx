"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import MarkdownEditor from "@/components/markdown/MarkdownEditor";
import LatexExamples from "@/components/markdown/LatexExamples";
import { Save, ExternalLink } from "lucide-react";
import { ContentPage, ContentBlock } from "@/generated/prisma";
import Link from "next/link";

interface LessonContentEditorProps {
  selectedPage: ContentPage | null;
  selectedBlock: ContentBlock | null;
  markdown: string;
  setMarkdown: (md: string) => void;
  saving: boolean;
  handleSaveMarkdown: () => void;
}

export default function LessonContentEditor({
  selectedPage,
  selectedBlock,
  markdown,
  setMarkdown,
  saving,
  handleSaveMarkdown,
}: LessonContentEditorProps) {
  if (!selectedPage) {
    return (
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma página selecionada
          </h3>
          <p className="text-gray-600 mb-4">
            Selecione uma página na barra lateral ou crie uma nova página para começar.
          </p>
        </div>
      </div>
    );
  }

  if (selectedBlock && selectedBlock.type === "EXERCISE") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-pink-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Exercício vinculado: {selectedPage.name}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">ID do Exercício:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedBlock.exerciseId}</code>
          </div>
          <Link 
            href={`/admin/dashboard/exercises/${selectedBlock.exerciseId}/content`}
            target="_blank"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
            Editar Exercício
          </Link>
          <p className="text-sm text-gray-600">
            Os exercícios são gerenciados separadamente. Clique no link acima para editar o conteúdo do exercício.
          </p>
        </div>
      </div>
    );
  }

  if (selectedBlock && selectedBlock.type === "SIMULATION") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-pink-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Simulação vinculada: {selectedPage.name}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">ID da Simulação:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedBlock.componentPath}</code>
          </div>
          <Link 
            href={`/admin/dashboard/simulations/${selectedBlock.componentPath}`}
            target="_blank"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Simulação
          </Link>
          <p className="text-sm text-gray-600">
            As simulações são gerenciadas através da biblioteca @noctiluz/simulations. Clique no link acima para visualizar a simulação.
          </p>
        </div>
      </div>
    );
  }

  if (selectedBlock && selectedBlock.type === "MARKDOWN") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-pink-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Editando: {selectedPage.name} - {selectedBlock.type.toLowerCase().replace('_', ' ')}
          </h3>
          <Button
            onClick={handleSaveMarkdown}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
        <LatexExamples />
        <MarkdownEditor value={markdown} onChange={setMarkdown} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Selecione um bloco de conteúdo
        </h3>
        <p className="text-gray-600 mb-4">
          Escolha um bloco de conteúdo na barra lateral para começar a editar ou crie um novo.
        </p>
      </div>
    </div>
  );
} 