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
import { Search, Loader2, Laptop, Tag } from "lucide-react";
import type { Simulation } from "@/actions/simulations";

interface SelectSimulationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSimulation: (simulationId: string) => void;
}

export default function SelectSimulationDialog({
  open,
  onOpenChange,
  onSelectSimulation,
}: SelectSimulationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [filteredSimulations, setFilteredSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    if (open) {
      loadSimulations();
      setSearchQuery("");
      setSelectedCategory("");
      setSelectedSimulation(null);
    }
  }, [open]);

  const loadSimulations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulations');
      if (!response.ok) throw new Error('Erro ao buscar simulações');
      
      const data = await response.json();
      setSimulations(data);
      setFilteredSimulations(data);
    } catch (error) {
      console.error('Erro ao buscar simulações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = simulations;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sim => 
        sim.name.toLowerCase().includes(query) ||
        sim.description.toLowerCase().includes(query) ||
        sim.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(sim => sim.category === selectedCategory);
    }

    setFilteredSimulations(filtered);
  }, [searchQuery, selectedCategory, simulations]);

  const handleConfirm = () => {
    if (selectedSimulation) {
      onSelectSimulation(selectedSimulation);
      onOpenChange(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      math: 'bg-blue-100 text-blue-800',
      physics: 'bg-purple-100 text-purple-800',
      chemistry: 'bg-green-100 text-green-800',
      biology: 'bg-emerald-100 text-emerald-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      math: 'Matemática',
      physics: 'Física',
      chemistry: 'Química',
      biology: 'Biologia',
    };
    return labels[category] || category;
  };

  const categories = Array.from(new Set(simulations.map(s => s.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Simulação</DialogTitle>
          <DialogDescription>
            Selecione uma simulação interativa para adicionar à lição.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Digite o nome ou tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              >
                <option value="">Todas as categorias</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            </div>
          ) : filteredSimulations.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredSimulations.map((simulation) => (
                <button
                  key={simulation.id}
                  onClick={() => setSelectedSimulation(simulation.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                    selectedSimulation === simulation.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Laptop className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">{simulation.name}</div>
                      <p className="text-xs text-gray-600 mb-2">{simulation.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(simulation.category)}`}>
                          {getCategoryLabel(simulation.category)}
                        </span>
                        {simulation.interactive && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Interativo
                          </span>
                        )}
                        {simulation.tags.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Tag className="w-3 h-3" />
                            {simulation.tags.slice(0, 3).join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma simulação encontrada
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSimulation}
          >
            Adicionar Simulação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
