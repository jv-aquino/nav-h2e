"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, ExternalLink } from "lucide-react";
import { Exercise } from "@/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SelectExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectExercise: (exerciseId: string) => void;
}

export default function SelectExerciseDialog({
  open,
  onOpenChange,
  onSelectExercise,
}: SelectExerciseDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [exerciseId, setExerciseId] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Reset state when dialog opens
      setSearchQuery("");
      setExerciseId("");
      setSelectedExercise(null);
      setExercises([]);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/exercises?name=${encodeURIComponent(searchQuery)}&limit=10`);
      if (!response.ok) throw new Error('Erro ao buscar exercícios');
      
      const data = await response.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectById = async () => {
    if (!exerciseId.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/exercises/${exerciseId}`);
      if (!response.ok) throw new Error('Exercício não encontrado');
      
      const exercise = await response.json();
      setSelectedExercise(exercise.id);
      setExercises([exercise]);
    } catch (error) {
      console.error('Erro ao buscar exercício:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedExercise) {
      onSelectExercise(selectedExercise);
      onOpenChange(false);
    }
  };

  const handleCreateNew = () => {
    // Open exercises page in new tab for creating a new exercise
    window.open('/admin/dashboard/exercises', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Exercício</DialogTitle>
          <DialogDescription>
            Busque um exercício existente ou crie um novo.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Buscar</TabsTrigger>
            <TabsTrigger value="id">Por ID</TabsTrigger>
            <TabsTrigger value="create">Criar Novo</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar por nome</Label>
              <div className="flex gap-2">
                <Input
                  id="search"
                  placeholder="Digite o nome do exercício..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {exercises.length > 0 && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise.id)}
                    className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                      selectedExercise === exercise.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-sm">{exercise.name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {exercise.type} • Dificuldade: {exercise.difficulty}
                      {/* TODO: Add institution info when available */}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="id" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exerciseId">ID do Exercício</Label>
              <div className="flex gap-2">
                <Input
                  id="exerciseId"
                  placeholder="Cole o ID do exercício..."
                  value={exerciseId}
                  onChange={(e) => setExerciseId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSelectById()}
                />
                <Button onClick={handleSelectById} disabled={loading || !exerciseId.trim()}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {selectedExercise && exercises.length > 0 && (
              <div className="p-3 border-2 border-pink-500 bg-pink-50 rounded-lg">
                <div className="font-semibold text-sm">{exercises[0].name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {exercises[0].type} • Dificuldade: {exercises[0].difficulty}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Crie um novo exercício e depois volte aqui para adicioná-lo à lição.
              </p>
              <Button onClick={handleCreateNew} variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Painel de Exercícios
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedExercise}
          >
            Adicionar Exercício
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
