/**
 * Page — Gestion des partenariats
 */

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { utiliserPartenariats, utiliserCalculRepartition } from '../../application/hooks/utiliserPartenariats';
import { utiliserProprietaires } from '../../application/hooks/utiliserProprietaires';
import { utiliserLotissements } from '../../application/hooks/utiliserLotissements';
import CartePartenariat from '../composants/partenariats/CartePartenariat';
import FormulairePartenariat from '../composants/partenariats/FormulairePartenariat';
import ModalRepartition from '../composants/partenariats/ModalRepartition';
import './PagePartenariats.css';

export default function PagePartenariats() {
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [partenariatEnEdition, setPartenariatEnEdition] = useState(null);

  const [modalRepartitionOuverte, setModalRepartitionOuverte] = useState(false);
  const [partenariatSelectionne, setPartenariatSelectionne] = useState(null);

  const {
    partenariats,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
  } = utiliserPartenariats(filtres);

  const { proprietaires } = utiliserProprietaires();
  const { lotissements } = utiliserLotissements();

  const { repartition, chargement: chargementRepartition, calculer } = utiliserCalculRepartition(
    partenariatSelectionne?.id
  );

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

  const ouvrirModalCreation = () => {
    setPartenariatEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalModification = (partenariat) => {
    setPartenariatEnEdition(partenariat);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setPartenariatEnEdition(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (partenariatEnEdition) {
        await modifier({ id: partenariatEnEdition.id, donnees });
      } else {
        await creer(donnees);
      }
      fermerModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppression = async (partenariat) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce partenariat ?')) {
      try {
        await supprimer(partenariat.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const ouvrirModalRepartition = async (partenariat) => {
    setPartenariatSelectionne(partenariat);
    setModalRepartitionOuverte(true);
    await calculer();
  };

  const fermerModalRepartition = () => {
    setModalRepartitionOuverte(false);
    setPartenariatSelectionne(null);
  };

  return (
    <div className="page-partenariats">
      {/* En-tête */}
      <div className="page-partenariats__entete">
        <div>
          <h1 className="page-partenariats__titre">Partenariats</h1>
          <p className="page-partenariats__description">
            Gérez vos partenariats promoteur/propriétaire
          </p>
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
          <Plus size={20} />
          Nouveau partenariat
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="page-partenariats__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={filtres.recherche}
            onChange={(e) => gererChangementRecherche(e.target.value)}
            className="champ-recherche__input"
          />
        </div>
      </div>

      {/* Contenu */}
      <div className="page-partenariats__contenu">
        {chargement && (
          <div className="page-partenariats__chargement">
            <div className="chargement__spinner" />
            <p>Chargement des partenariats...</p>
          </div>
        )}

        {erreur && (
          <div className="page-partenariats__erreur">
            <p>Une erreur est survenue.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && partenariats.length === 0 && (
          <div className="page-partenariats__vide">
            <p>Aucun partenariat trouvé.</p>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
              <Plus size={20} />
              Créer votre premier partenariat
            </button>
          </div>
        )}

        {!chargement && !erreur && partenariats.length > 0 && (
          <div className="page-partenariats__grille">
            {partenariats.map((partenariat) => (
              <CartePartenariat
                key={partenariat.id}
                partenariat={partenariat}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
                surCalculer={ouvrirModalRepartition}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulairePartenariat
          partenariat={partenariatEnEdition}
          proprietaires={proprietaires}
          lotissements={lotissements}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}

      {/* Modal répartition */}
      {modalRepartitionOuverte && partenariatSelectionne && (
        <ModalRepartition
          partenariat={partenariatSelectionne}
          repartition={repartition}
          chargement={chargementRepartition}
          surFermer={fermerModalRepartition}
        />
      )}
    </div>
  );
}
