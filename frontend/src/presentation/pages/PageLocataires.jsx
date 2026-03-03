/**
 * Page — Gestion des locataires
 */

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { utiliserLocataires } from '../../application/hooks/utiliserLocataires';
import CarteLocataire from '../composants/locataires/CarteLocataire';
import FormulaireLocataire from '../composants/locataires/FormulaireLocataire';
import './PageLocataires.css';

export default function PageLocataires() {
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [locataireEnEdition, setLocataireEnEdition] = useState(null);

  const {
    locataires,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
  } = utiliserLocataires(filtres);

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

  const ouvrirModalCreation = () => {
    setLocataireEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalModification = (locataire) => {
    setLocataireEnEdition(locataire);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setLocataireEnEdition(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (locataireEnEdition) {
        await modifier({ id: locataireEnEdition.id, donnees });
      } else {
        await creer(donnees);
      }
      fermerModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppression = async (locataire) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${locataire.nom}" ?`)) {
      try {
        await supprimer(locataire.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  return (
    <div className="page-locataires">
      {/* En-tête */}
      <div className="page-locataires__entete">
        <div>
          <h1 className="page-locataires__titre">Locataires</h1>
          <p className="page-locataires__description">
            Gérez vos locataires et leurs contrats
          </p>
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
          <Plus size={20} />
          Nouveau locataire
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="page-locataires__barre-recherche">
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
      <div className="page-locataires__contenu">
        {chargement && (
          <div className="page-locataires__chargement">
            <div className="chargement__spinner" />
            <p>Chargement des locataires...</p>
          </div>
        )}

        {erreur && (
          <div className="page-locataires__erreur">
            <p>Une erreur est survenue lors du chargement des locataires.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && locataires.length === 0 && (
          <div className="page-locataires__vide">
            <p>Aucun locataire trouvé.</p>
            {filtres.recherche ? (
              <button className="bouton bouton--secondaire" onClick={() => gererChangementRecherche('')}>
                Réinitialiser la recherche
              </button>
            ) : (
              <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
                <Plus size={20} />
                Créer votre premier locataire
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && locataires.length > 0 && (
          <div className="page-locataires__grille">
            {locataires.map((locataire) => (
              <CarteLocataire
                key={locataire.id}
                locataire={locataire}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulaireLocataire
          locataire={locataireEnEdition}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}
    </div>
  );
}
