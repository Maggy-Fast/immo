import React, { useState } from 'react';
import { Plus, Search, Loader2, Users, AlertCircle } from 'lucide-react';
import utiliserPromoteurs from '../../application/hooks/utiliserPromoteurs';
import CartePromoteur from '../composants/promoteurs/CartePromoteur';
import FormulairePromoteur from '../composants/promoteurs/FormulairePromoteur';
import { useToast } from '../composants/communs/ToastContext';
import { Modale } from '../composants/communs';
import './PagePromoteurs.css';

const PagePromoteurs = () => {
  const [filtres, setFiltres] = useState({ recherche: '' });
  const [modalOuverte, setModalOuverte] = useState(false);
  const [promoteurEnEdition, setPromoteurEnEdition] = useState(null);
  const { notifier } = useToast();

  const { promoteurs, chargement, erreur, lister, supprimer } = utiliserPromoteurs(filtres);

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

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

  return (
    <div className="page-promoteurs">
      {/* En-tête */}
      <div className="page-promoteurs__entete">
        <div>
          <h1 className="page-promoteurs__titre">Gestion des Promoteurs</h1>
          <p className="page-promoteurs__description">
            Supervisez vos partenaires immobiliers et leurs documents officiels.
          </p>
        </div>
        <button
          className="bouton bouton--primaire"
          onClick={ouvrirModalCreation}
        >
          <Plus size={20} />
          Nouveau promoteur
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="page-promoteurs__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            value={filtres.recherche}
            onChange={(e) => gererChangementRecherche(e.target.value)}
            placeholder="Rechercher par nom, téléphone..."
            className="champ-recherche__input"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="page-promoteurs__contenu">
        {chargement && (
          <div className="page-promoteurs__chargement">
            <Loader2 size={24} className="chargement__spinner" />
            <p>Chargement des promoteurs...</p>
          </div>
        )}

        {erreur && (
          <div className="page-promoteurs__erreur">
            <p>Une erreur est survenue lors du chargement des promoteurs.</p>
            <button className="bouton bouton--secondaire" onClick={() => lister()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && promoteurs.length === 0 && (
          <div className="page-promoteurs__vide">
            <Users size={48} style={{ color: 'var(--couleur-gris-clair)', marginBottom: 'var(--espace-4)' }} />
            <p>Aucun promoteur trouvé.</p>
            {filtres.recherche ? (
              <button className="bouton bouton--secondaire" onClick={() => gererChangementRecherche('')}>
                Réinitialiser la recherche
              </button>
            ) : (
              <button
                className="bouton bouton--primaire"
                onClick={ouvrirModalCreation}
              >
                <Plus size={20} />
                Ajouter votre premier promoteur
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && promoteurs.length > 0 && (
          <div className="page-promoteurs__grille">
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
          titre={promoteurEnEdition ? 'Modifier le partenaire' : 'Nouveau partenaire immobilier'}
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
