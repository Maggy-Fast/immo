/**
 * Page — Gestion des propriétaires
 */

import { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { utiliserProprietaires } from '../../application/hooks/utiliserProprietaires';
import { ModaleConfirmation } from '../composants/communs';
import CarteProprietaire from '../composants/proprietaires/CarteProprietaire';
import FormulaireProprietaire from '../composants/proprietaires/FormulaireProprietaire';
import ModaleDetailsProprietaire from '../composants/proprietaires/ModaleDetailsProprietaire';
import ModaleDetailsBien from '../composants/biens/ModaleDetailsBien';
import './PageProprietaires.css';

export default function PageProprietaires() {
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [modalDetailsBienOuverte, setModalDetailsBienOuverte] = useState(false);
  const [proprietaireEnSelection, setProprietaireEnSelection] = useState(null);
  const [bienEnSelection, setBienEnSelection] = useState(null);
  const [proprietaireEnEdition, setProprietaireEnEdition] = useState(null);
  const [confirmationSuppression, setConfirmationSuppression] = useState({ ouverte: false, proprietaire: null });


  const {
    proprietaires,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
    enCoursSuppression,
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

  const ouvrirModalDetails = (proprietaire) => {
    setProprietaireEnSelection(proprietaire);
    setModalDetailsOuverte(true);
  };

  const ouvrirModalDetailsBien = (bien) => {
    setBienEnSelection(bien);
    setModalDetailsBienOuverte(true);
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

  const gererSuppression = (proprietaire) => {
    setConfirmationSuppression({ ouverte: true, proprietaire });
  };

  const confirmerSuppression = async () => {
    const { proprietaire } = confirmationSuppression;
    if (!proprietaire) return;

    try {
      await supprimer(proprietaire.id);
      setConfirmationSuppression({ ouverte: false, proprietaire: null });
    } catch (error) {
      console.error('Erreur suppression:', error);
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
            <Loader2 size={24} className="chargement__spinner" />
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
                surClic={ouvrirModalDetails}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal détails propriétaire */}
      {modalDetailsOuverte && (
        <ModaleDetailsProprietaire
          proprietaire={proprietaireEnSelection}
          surFermer={() => setModalDetailsOuverte(false)}
          surModifierProprietaire={ouvrirModalModification}
          surVoirDetailsBien={ouvrirModalDetailsBien}
        />
      )}

      {/* Modal détails bien (si on clique sur un bien du propriétaire) */}
      {modalDetailsBienOuverte && (
        <ModaleDetailsBien 
          bien={bienEnSelection}
          surFermer={() => setModalDetailsBienOuverte(false)}
          surModifier={() => {
            // Optionnel: rediriger vers la page des biens ou ouvrir modale modif bien
            setModalDetailsBienOuverte(false);
          }}
        />
      )}

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulaireProprietaire
          proprietaire={proprietaireEnEdition}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}
      {/* Modale de confirmation de suppression */}
      <ModaleConfirmation
        ouverte={confirmationSuppression.ouverte}
        titre="Supprimer le propriétaire"
        message={`Êtes-vous sûr de vouloir supprimer le propriétaire "${confirmationSuppression.proprietaire?.nom}" ? cette action est irréversible et supprimera également les données associées.`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => setConfirmationSuppression({ ouverte: false, proprietaire: null })}
        enCours={enCoursSuppression}
        type="danger"
        texteConfirmer="Supprimer"
      />
    </div>
  );
}
