/**
 * Page — Gestion des lotissements et parcelles
 */

import { useState } from 'react';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { utiliserLotissements } from '../../application/hooks/utiliserLotissements';
import { utiliserParcelles } from '../../application/hooks/utiliserParcelles';
import CarteLotissement from '../composants/lotissements/CarteLotissement';
import CarteParcelle from '../composants/parcelles/CarteParcelle';
import FormulaireLotissement from '../composants/lotissements/FormulaireLotissement';
import FormulaireParcelle from '../composants/parcelles/FormulaireParcelle';
import './PageLotissements.css';

export default function PageLotissements() {
  const [vue, setVue] = useState('lotissements'); // 'lotissements' ou 'parcelles'
  const [lotissementSelectionne, setLotissementSelectionne] = useState(null);
  
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalLotissementOuverte, setModalLotissementOuverte] = useState(false);
  const [lotissementEnEdition, setLotissementEnEdition] = useState(null);

  const [modalParcelleOuverte, setModalParcelleOuverte] = useState(false);
  const [parcelleEnEdition, setParcelleEnEdition] = useState(null);

  const {
    lotissements,
    chargement: chargementLotissements,
    erreur: erreurLotissements,
    creer: creerLotissement,
    modifier: modifierLotissement,
    supprimer: supprimerLotissement,
    enCoursCreation: enCoursCreationLotissement,
    enCoursModification: enCoursModificationLotissement,
  } = utiliserLotissements(filtres);

  const filtresParcelles = lotissementSelectionne 
    ? { idLotissement: lotissementSelectionne.id }
    : {};

  const {
    parcelles,
    chargement: chargementParcelles,
    erreur: erreurParcelles,
    creer: creerParcelle,
    modifier: modifierParcelle,
    supprimer: supprimerParcelle,
    enCoursCreation: enCoursCreationParcelle,
    enCoursModification: enCoursModificationParcelle,
  } = utiliserParcelles(filtresParcelles);

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

  // Lotissements
  const ouvrirModalCreationLotissement = () => {
    setLotissementEnEdition(null);
    setModalLotissementOuverte(true);
  };

  const ouvrirModalModificationLotissement = (lotissement) => {
    setLotissementEnEdition(lotissement);
    setModalLotissementOuverte(true);
  };

  const fermerModalLotissement = () => {
    setModalLotissementOuverte(false);
    setLotissementEnEdition(null);
  };

  const gererSoumissionLotissement = async (donnees) => {
    try {
      if (lotissementEnEdition) {
        await modifierLotissement({ id: lotissementEnEdition.id, donnees });
      } else {
        await creerLotissement(donnees);
      }
      fermerModalLotissement();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppressionLotissement = async (lotissement) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${lotissement.nom}" ?`)) {
      try {
        await supprimerLotissement(lotissement.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const voirParcelles = (lotissement) => {
    setLotissementSelectionne(lotissement);
    setVue('parcelles');
  };

  const retourLotissements = () => {
    setLotissementSelectionne(null);
    setVue('lotissements');
  };

  // Parcelles
  const ouvrirModalCreationParcelle = () => {
    setParcelleEnEdition(null);
    setModalParcelleOuverte(true);
  };

  const ouvrirModalModificationParcelle = (parcelle) => {
    setParcelleEnEdition(parcelle);
    setModalParcelleOuverte(true);
  };

  const fermerModalParcelle = () => {
    setModalParcelleOuverte(false);
    setParcelleEnEdition(null);
  };

  const gererSoumissionParcelle = async (donnees) => {
    try {
      if (parcelleEnEdition) {
        await modifierParcelle({ id: parcelleEnEdition.id, donnees });
      } else {
        await creerParcelle(donnees);
      }
      fermerModalParcelle();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppressionParcelle = async (parcelle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la parcelle "${parcelle.numero}" ?`)) {
      try {
        await supprimerParcelle(parcelle.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  return (
    <div className="page-lotissements">
      {/* Vue Lotissements */}
      {vue === 'lotissements' && (
        <>
          <div className="page-lotissements__entete">
            <div>
              <h1 className="page-lotissements__titre">Lotissements</h1>
              <p className="page-lotissements__description">
                Gérez vos lotissements et parcelles
              </p>
            </div>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreationLotissement}>
              <Plus size={20} />
              Nouveau lotissement
            </button>
          </div>

          <div className="page-lotissements__barre-recherche">
            <div className="champ-recherche">
              <Search size={20} className="champ-recherche__icone" />
              <input
                type="text"
                placeholder="Rechercher un lotissement..."
                value={filtres.recherche}
                onChange={(e) => gererChangementRecherche(e.target.value)}
                className="champ-recherche__input"
              />
            </div>
          </div>

          <div className="page-lotissements__contenu">
            {chargementLotissements && (
              <div className="page-lotissements__chargement">
                <div className="chargement__spinner" />
                <p>Chargement des lotissements...</p>
              </div>
            )}

            {erreurLotissements && (
              <div className="page-lotissements__erreur">
                <p>Une erreur est survenue.</p>
                <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
                  Réessayer
                </button>
              </div>
            )}

            {!chargementLotissements && !erreurLotissements && lotissements.length === 0 && (
              <div className="page-lotissements__vide">
                <p>Aucun lotissement trouvé.</p>
                <button className="bouton bouton--primaire" onClick={ouvrirModalCreationLotissement}>
                  <Plus size={20} />
                  Créer votre premier lotissement
                </button>
              </div>
            )}

            {!chargementLotissements && !erreurLotissements && lotissements.length > 0 && (
              <div className="page-lotissements__grille">
                {lotissements.map((lotissement) => (
                  <CarteLotissement
                    key={lotissement.id}
                    lotissement={lotissement}
                    surModifier={ouvrirModalModificationLotissement}
                    surSupprimer={gererSuppressionLotissement}
                    surVoirParcelles={voirParcelles}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Vue Parcelles */}
      {vue === 'parcelles' && lotissementSelectionne && (
        <>
          <div className="page-lotissements__entete">
            <div>
              <button className="bouton bouton--texte" onClick={retourLotissements}>
                <ArrowLeft size={18} />
                Retour aux lotissements
              </button>
              <h1 className="page-lotissements__titre">
                Parcelles - {lotissementSelectionne.nom}
              </h1>
              <p className="page-lotissements__description">
                {lotissementSelectionne.localisation}
              </p>
            </div>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreationParcelle}>
              <Plus size={20} />
              Nouvelle parcelle
            </button>
          </div>

          <div className="page-lotissements__contenu">
            {chargementParcelles && (
              <div className="page-lotissements__chargement">
                <div className="chargement__spinner" />
                <p>Chargement des parcelles...</p>
              </div>
            )}

            {erreurParcelles && (
              <div className="page-lotissements__erreur">
                <p>Une erreur est survenue.</p>
              </div>
            )}

            {!chargementParcelles && !erreurParcelles && parcelles.length === 0 && (
              <div className="page-lotissements__vide">
                <p>Aucune parcelle trouvée.</p>
                <button className="bouton bouton--primaire" onClick={ouvrirModalCreationParcelle}>
                  <Plus size={20} />
                  Créer la première parcelle
                </button>
              </div>
            )}

            {!chargementParcelles && !erreurParcelles && parcelles.length > 0 && (
              <div className="page-lotissements__grille">
                {parcelles.map((parcelle) => (
                  <CarteParcelle
                    key={parcelle.id}
                    parcelle={parcelle}
                    surModifier={ouvrirModalModificationParcelle}
                    surSupprimer={gererSuppressionParcelle}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {modalLotissementOuverte && (
        <FormulaireLotissement
          lotissement={lotissementEnEdition}
          surSoumettre={gererSoumissionLotissement}
          surAnnuler={fermerModalLotissement}
          enCours={enCoursCreationLotissement || enCoursModificationLotissement}
        />
      )}

      {modalParcelleOuverte && (
        <FormulaireParcelle
          parcelle={parcelleEnEdition}
          lotissements={lotissements}
          lotissementParDefaut={lotissementSelectionne}
          surSoumettre={gererSoumissionParcelle}
          surAnnuler={fermerModalParcelle}
          enCours={enCoursCreationParcelle || enCoursModificationParcelle}
        />
      )}
    </div>
  );
}
