/**
 * Page — Gestion des partenariats
 */

import { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { utiliserPartenariats, utiliserCalculRepartition } from '../../application/hooks/utiliserPartenariats';
import { utiliserProprietaires } from '../../application/hooks/utiliserProprietaires';
import { utiliserLotissements } from '../../application/hooks/utiliserLotissements';
import { utiliserPromoteurs } from '../../application/hooks/utiliserPromoteurs';
import CartePartenariat from '../composants/partenariats/CartePartenariat';
import FormulairePartenariat from '../composants/partenariats/FormulairePartenariat';
import ModalRepartition from '../composants/partenariats/ModalRepartition';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import { useToast } from '../composants/communs/ToastContext';
import './PagePartenariats.css';

export default function PagePartenariats() {
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [partenariatEnEdition, setPartenariatEnEdition] = useState(null);

  const [modalRepartitionOuverte, setModalRepartitionOuverte] = useState(false);
  const [partenariatSelectionne, setPartenariatSelectionne] = useState(null);

  const [modalSuppressionOuverte, setModalSuppressionOuverte] = useState(false);
  const { notifier } = useToast();

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
  const { promoteurs } = utiliserPromoteurs();

  const { repartition, chargement: chargementRepartition, calculer } = utiliserCalculRepartition();

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
        notifier('Partenariat modifié avec succès');
      } else {
        await creer(donnees);
        notifier('Partenariat créé avec succès');
      }
      fermerModal();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
    }
  };

  const confirmerSuppression = async () => {
    try {
      await supprimer(partenariatSelectionne.id);
      notifier('Partenariat supprimé avec succès');
      setModalSuppressionOuverte(false);
      setPartenariatSelectionne(null);
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const ouvrirModalRepartition = async (partenariat) => {
    setPartenariatSelectionne(partenariat);
    setModalRepartitionOuverte(true);
    await calculer(partenariat.id);
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
            <Loader2 size={24} className="chargement__spinner" />
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
                surSupprimer={(p) => {
                  setPartenariatSelectionne(p);
                  setModalSuppressionOuverte(true);
                }}
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
          promoteurs={promoteurs}
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

      {/* Modale Confirmation Suppression */}
      <ModaleConfirmation
        ouverte={modalSuppressionOuverte}
        titre="Supprimer le partenariat"
        message={`Voulez-vous vraiment supprimer le partenariat pour le lotissement ${partenariatSelectionne?.lotissement?.nom} ?`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => {
          setModalSuppressionOuverte(false);
          setPartenariatSelectionne(null);
        }}
      />
    </div>
  );
}
