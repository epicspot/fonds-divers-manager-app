import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useConfigurationsSysteme } from "@/hooks/useConfigurationsSysteme";
import { Skeleton } from "@/components/ui/skeleton";

interface Piece {
  id: string;
  label: string;
  value: string;
}

export function ConfigurationsPieces() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [newPiece, setNewPiece] = useState({ label: "", value: "" });
  const { toast } = useToast();
  const { valeur, sauvegarder, loading } = useConfigurationsSysteme('pieces_config');

  useEffect(() => {
    if (valeur) {
      setPieces(Array.isArray(valeur) ? valeur : []);
    }
  }, [valeur]);

  const handleSave = async () => {
    try {
      await sauvegarder(pieces, 'Liste des pièces');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleAdd = () => {
    if (!newPiece.label.trim()) return;

    const piece: Piece = {
      id: crypto.randomUUID(),
      label: newPiece.label,
      value: newPiece.value || newPiece.label.toLowerCase().replace(/\s+/g, "_"),
    };

    setPieces([...pieces, piece]);
    setNewPiece({ label: "", value: "" });
  };

  const handleRemove = (id: string) => {
    setPieces(pieces.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {pieces.map((piece) => (
          <div key={piece.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
            <span className="flex-1 font-medium">{piece.label}</span>
            <span className="text-sm text-muted-foreground">{piece.value}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(piece.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {pieces.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Aucune pièce configurée
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium">Ajouter une pièce</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nom de la pièce</Label>
            <Input
              id="label"
              value={newPiece.label}
              onChange={(e) => setNewPiece({ ...newPiece, label: e.target.value })}
              placeholder="Ex: Procès-verbal de saisie"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Code (optionnel)</Label>
            <Input
              id="value"
              value={newPiece.value}
              onChange={(e) => setNewPiece({ ...newPiece, value: e.target.value })}
              placeholder="Ex: pv_saisie"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
}
