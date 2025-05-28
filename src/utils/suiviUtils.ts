
import { ActionSuivi, SuiviHierarchique, NotificationSuivi } from "@/types/suivi";
import { AffaireContentieuse } from "@/types/affaire";

export const creerActionSuivi = (
  affaireId: string,
  type: ActionSuivi['type'],
  utilisateur: string,
  commentaire?: string,
  delaiPrevu?: number
): ActionSuivi => {
  const dateAction = new Date().toISOString();
  const dateEcheance = delaiPrevu 
    ? new Date(Date.now() + delaiPrevu * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  return {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    affaireId,
    type,
    statut: 'en_cours',
    utilisateur,
    commentaire,
    dateAction,
    delaiPrevu,
    dateEcheance
  };
};

export const ajouterActionSuivi = (action: ActionSuivi): void => {
  const suivis = obtenirSuivis();
  const suiviExistant = suivis.find(s => s.affaireId === action.affaireId);

  if (suiviExistant) {
    suiviExistant.actions.push(action);
  } else {
    const nouveauSuivi: SuiviHierarchique = {
      affaireId: action.affaireId,
      numeroAffaire: '', // Sera mis à jour depuis l'affaire
      statutActuel: 'en_cours',
      actions: [action]
    };
    suivis.push(nouveauSuivi);
  }

  localStorage.setItem('suivis_hierarchiques', JSON.stringify(suivis));
};

export const obtenirSuivis = (): SuiviHierarchique[] => {
  const suivis = localStorage.getItem('suivis_hierarchiques');
  return suivis ? JSON.parse(suivis) : [];
};

export const obtenirSuiviAffaire = (affaireId: string): SuiviHierarchique | undefined => {
  const suivis = obtenirSuivis();
  return suivis.find(s => s.affaireId === affaireId);
};

export const calculerDelaiTransmission = (dateTransmission: string): number => {
  const transmission = new Date(dateTransmission);
  const maintenant = new Date();
  const diffTime = maintenant.getTime() - transmission.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const genererNotificationsRetard = (): NotificationSuivi[] => {
  const suivis = obtenirSuivis();
  const notifications: NotificationSuivi[] = [];
  const seuilRetard = 7; // 7 jours

  suivis.forEach(suivi => {
    const derniereAction = suivi.actions[suivi.actions.length - 1];
    
    if (derniereAction && derniereAction.dateEcheance) {
      const echeance = new Date(derniereAction.dateEcheance);
      const maintenant = new Date();
      
      if (maintenant > echeance && derniereAction.statut === 'en_cours') {
        const retard = Math.floor((maintenant.getTime() - echeance.getTime()) / (1000 * 60 * 60 * 24));
        
        notifications.push({
          id: `notif_${Date.now()}_${suivi.affaireId}`,
          affaireId: suivi.affaireId,
          type: 'retard',
          message: `Affaire ${suivi.numeroAffaire} en retard de ${retard} jour(s)`,
          dateCreation: new Date().toISOString(),
          lu: false,
          priorite: retard > 14 ? 'urgente' : retard > 7 ? 'haute' : 'normale'
        });
      }
    }
  });

  return notifications;
};

export const mettreAJourSuiviAffaire = (affaire: AffaireContentieuse): void => {
  const suivis = obtenirSuivis();
  const suiviIndex = suivis.findIndex(s => s.affaireId === affaire.id);

  if (suiviIndex !== -1) {
    suivis[suiviIndex].numeroAffaire = affaire.numeroAffaire;
    suivis[suiviIndex].statutActuel = affaire.statut;
    suivis[suiviIndex].dateTransmission = affaire.dateTransmissionHierarchie;
    suivis[suiviIndex].dateValidation = affaire.dateApprobationHierarchie;

    if (affaire.dateTransmissionHierarchie) {
      suivis[suiviIndex].delaiTransmission = calculerDelaiTransmission(affaire.dateTransmissionHierarchie);
    }

    localStorage.setItem('suivis_hierarchiques', JSON.stringify(suivis));
  }
};
