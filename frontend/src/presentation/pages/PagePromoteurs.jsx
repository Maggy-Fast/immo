import React, { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import utiliserPromoteurs from '../../application/hooks/utiliserPromoteurs';
import CartePromoteur from './CartePromoteur';
import FormulairePromoteur from './FormulairePromoteur';
import { useToast } from '../composants/communs/ToastContext';
import { Modale } from '../composants/communs';

const PagePromoteurs = () => {
  const [modalOuverte, setModalOuverte] = useState(false);
  const [promoteurEnEdition, setPromoteurEnEdition] = useState(null);
  const [termeRecherche, setTermeRecherche] = useState('');
  const { notifier } = useToast();

  const { promoteurs, chargement, erreur, lister, supprimer } = utiliserPromoteurs();

  const ouvrirModalCreation = () => {
    setPromoteurEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalEdition = (promoteur) => {
    setPromoteurEnEdition(promoteur);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setPromoteurEnEdition(null);
  };

  const gererSoumission = () => {
    fermerModal();
    notifier(promoteurEnEdition ? 'Promoteur modifié avec succès' : 'Promoteur créé avec succès', 'success');
  };

  const confirmerSuppression = async (promoteur) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le promoteur "${promoteur.nom}" ?`)) {
      try {
        await supprimer(promoteur.id);
        notifier('Promoteur supprimé avec succès', 'success');
      } catch (error) {
        notifier('Erreur lors de la suppression du promoteur', 'error');
      }
    }
  };

  const gererRecherche = (terme) => {
    setTermeRecherche(terme);
    lister({ recherche: terme });
  };

  return (
    <div className="page-promoteurs">
      <div className="page__en-tete">
        <div className="page__titre">
          <h1>Promoteurs</h1>
          <p>Gestion des promoteurs immobiliers</p>
        </div>
        
        <div className="page__actions">
          <div className="entete__recherche">
            <Search size={16} className="entete__recherche-icone" />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => gererRecherche(e.target.value)}
              placeholder="Rechercher un promoteur..."
              className="entete__recherche-input"
            />
          </div>
          
          <button
            className="bouton bouton--primaire"
            onClick={ouvrirModalCreation}
          >
            <Plus size={18} />
            Nouveau promoteur
          </button>
        </div>
      </div>

      <div className="page__contenu">
        {chargement ? (
          <div className="chargement">
            <Loader2 className="animate-spin" />
            <p>Chargement des promoteurs...</p>
          </div>
        ) : erreur ? (
          <div className="erreur">
            <p>{typeof erreur === 'string' ? erreur : erreur.message || 'Une erreur est survenue lors du chargement des promoteurs.'}</p>
          </div>
        ) : promoteurs.length === 0 ? (
          <div className="vide">
            <p>Aucun promoteur trouvé.</p>
            <button
              className="bouton bouton--primaire"
              onClick={ouvrirModalCreation}
            >
              <Plus size={18} />
              Ajouter un promoteur
            </button>
          </div>
        ) : (
          <div className="promoteurs__grid">
            {promoteurs.map((promoteur) => (
              <CartePromoteur
                key={promoteur.id}
                promoteur={promoteur}
                onModifier={ouvrirModalEdition}
                onSupprimer={confirmerSuppression}
              />
            ))}
          </div>
        )}
      </div>

      {modalOuverte && (
        <Modale
          titre={promoteurEnEdition ? 'Modifier le promoteur' : 'Nouveau promoteur'}
          surFermer={fermerModal}
          taille="grand"
        >
          <FormulairePromoteur
            promoteur={promoteurEnEdition}
            surAnnuler={fermerModal}
            surSoumission={gererSoumission}
          />
        </Modale>
      )}
    </div>
  );
};

export default PagePromoteurs;
