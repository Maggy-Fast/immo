/**
 * Page — Gestion des propriétaires
 */

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { utiliserProprietaires } from '../../application/hooks/utiliserProprietaires';
import CarteProprietaire from '../composants/proprietaires/CarteProprietaire';
import FormulaireProprietaire from '../composants/proprietaires/FormulaireProprietaire';
import './PageProprietaires.css';

export default function PageProprietaires() {
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [proprietaireEnEdition, setProprietaireEnEdition] = useState(null);

  const {
    proprietaires,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
  } = utiliserProprietaires(filtres);

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

  const ouvrirModalCreation = () => {
    setProprietaireEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalModification = (proprietaire) => {
    setProprietaireEnEdition(proprietaire);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setProprietaireEnEdition(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (proprietaireEnEdition) {
        await modifier({ id: proprietaireEnEdition.id, donnees });
      } else {
        await creer(donnees);
      }
      fermerModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppression = async (proprietaire) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${proprietaire.nom}" ?`)) {
      try {
        await supprimer(proprietaire.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  return (
    <div className="page-proprietaires">
      {/* En-tête */}
      <div className="page-proprietaires__entete">
        <div>
          <h1 className="page-proprietaires__titre">Propriétaires</h1>
          <p className="page-proprietaires__description">
            Gérez vos propriétaires et leurs biens
          </p>
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
          <Plus size={20} />
          Nouveau propriétaire
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="page-proprietaires__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={filtres.recherche}
            onChange={(e) => gererChangementRecherche(e.target.value)}
            className="champ-recherche__input"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="page-proprietaires__contenu">
        {chargement && (
          <div className="page-proprietaires__chargement">
            <div className="chargement__spinner" />
            <p>Chargement des propriétaires...</p>
          </div>
        )}

        {erreur && (
          <div className="page-proprietaires__erreur">
            <p>Une erreur est survenue lors du chargement des propriétaires.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && proprietaires.length === 0 && (
          <div className="page-proprietaires__vide">
            <p>Aucun propriétaire trouvé.</p>
            {filtres.recherche ? (
              <button className="bouton bouton--secondaire" onClick={() => gererChangementRecherche('')}>
                Réinitialiser la recherche
              </button>
            ) : (
              <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
                <Plus size={20} />
                Créer votre premier propriétaire
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && proprietaires.length > 0 && (
          <div className="page-proprietaires__grille">
            {proprietaires.map((proprietaire) => (
              <CarteProprietaire
                key={proprietaire.id}
                proprietaire={proprietaire}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulaireProprietaire
          proprietaire={proprietaireEnEdition}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}
    </div>
  );
}
