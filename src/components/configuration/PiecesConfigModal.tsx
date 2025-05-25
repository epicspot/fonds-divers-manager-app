
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface PiecesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Piece {
  id: string;
  label: string;
  value: string;
}

export const PiecesConfigModal = ({ isOpen, onClose }: PiecesConfigModalProps) => {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [newPiece, setNewPiece] = useState({ label: "", value: "" });

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("pieces_config");
      if (saved) {
        setPieces(JSON.parse(saved));
      } else {
        // Données par défaut
        setPieces([
          { id: "1", label: "Procès-verbal de saisie original", value: "pv_saisie_original" },
          { id: "2", label: "Procès-verbal de constat d'infraction", value: "pv_constat_infraction" },
          { id: "3", label: "Factures commerciales (3 exemplaires)", value: "factures_commerciales" },
          { id: "4", label: "Connaissement maritime", value: "connaissement_maritime" },
        ]);
      }
    }
  }, [isOpen]);

  const savePieces = (newList: Piece[]) => {
    setPieces(newList);
    localStorage.setItem("pieces_config", JSON.stringify(newList));
    toast.success("Configuration sauvegardée");
  };

  const addPiece = () => {
    if (!newPiece.label.trim()) return;

    const piece: Piece = {
      id: crypto.randomUUID(),
      label: newPiece.label,
      value: newPiece.value || newPiece.label.toLowerCase().replace(/\s+/g, "_"),
    };

    savePieces([...pieces, piece]);
    setNewPiece({ label: "", value: "" });
  };

  const removePiece = (id: string) => {
    savePieces(pieces.filter(p => p.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuration de la Nature des Pièces</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Liste existante */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {pieces.map((piece) => (
              <div key={piece.id} className="flex items-center gap-2 p-2 border rounded">
                <span className="flex-1">{piece.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePiece(piece.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Ajouter nouveau */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="label">Nom de la pièce</Label>
                <Input
                  id="label"
                  value={newPiece.label}
                  onChange={(e) => setNewPiece({ ...newPiece, label: e.target.value })}
                  placeholder="Ex: Certificat d'origine"
                />
              </div>
              <div>
                <Label htmlFor="value">Code (optionnel)</Label>
                <Input
                  id="value"
                  value={newPiece.value}
                  onChange={(e) => setNewPiece({ ...newPiece, value: e.target.value })}
                  placeholder="Ex: certificat_origine"
                />
              </div>
            </div>
            <Button onClick={addPiece} className="mt-2 gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
