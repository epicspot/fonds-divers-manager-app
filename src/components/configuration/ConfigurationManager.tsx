
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SaisissantsConfigModal } from "./SaisissantsConfigModal";
import { ChefsConfigModal } from "./ChefsConfigModal";
import { PiecesConfigModal } from "./PiecesConfigModal";
import { IntervenantsConfigModal } from "./IntervenantsConfigModal";

export const ConfigurationManager = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const configOptions = [
    { id: "saisissants", label: "Agents Saisissants", modal: SaisissantsConfigModal },
    { id: "chefs", label: "Chefs", modal: ChefsConfigModal },
    { id: "intervenants", label: "Intervenants", modal: IntervenantsConfigModal },
    { id: "pieces", label: "Nature des Pièces", modal: PiecesConfigModal },
  ];

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setActiveModal("menu")}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Configuration
      </Button>

      {/* Menu de sélection */}
      {activeModal === "menu" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Configuration</h2>
            <div className="space-y-2">
              {configOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveModal(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setActiveModal(null)}
            >
              Fermer
            </Button>
          </div>
        </div>
      )}

      {/* Modales de configuration */}
      {configOptions.map((option) => {
        const Modal = option.modal;
        return (
          <Modal
            key={option.id}
            isOpen={activeModal === option.id}
            onClose={() => setActiveModal(null)}
          />
        );
      })}
    </div>
  );
};
