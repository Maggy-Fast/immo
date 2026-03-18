/**
 * Page — Gestion des locataires
 */

import { useState } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import { utiliserLocataires } from '../../application/hooks/utiliserLocataires';
import { ModaleConfirmation } from '../composants/communs';
import CarteLocataire from '../composants/locataires/CarteLocataire';
import FormulaireLocataire from '../composants/locataires/FormulaireLocataire';
import ModaleDetailsLocataire from '../composants/locataires/ModaleDetailsLocataire';
import './PageLocataires.css';

export default function PageLocataires() {
  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [locataireEnEdition, setLocataireEnEdition] = useState(null);
  const [confirmationSuppression, setConfirmationSuppression] = useState({ ouverte: false, locataire: null });
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [locataireEnConsultation, setLocataireEnConsultation] = useState(null);


  const {
    locataires,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
    enCoursSuppression,
  } = utiliserLocataires(filtres);

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

  const ouvrirModalCreation = () => {
    setLocataireEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalDetails = (locataire) => {
    setLocataireEnConsultation(locataire);
    setModalDetailsOuverte(true);
  };

  const fermerModalDetails = () => {
    setModalDetailsOuverte(false);
    setLocataireEnConsultation(null);
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

  const gererSuppression = (locataire) => {
    setConfirmationSuppression({ ouverte: true, locataire });
  };

  const confirmerSuppression = async () => {
    const { locataire } = confirmationSuppression;
    if (!locataire) return;

    try {
      await supprimer(locataire.id);
      setConfirmationSuppression({ ouverte: false, locataire: null });
    } catch (error) {
      console.error('Erreur suppression:', error);
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
            <Loader2 size={24} className="chargement__spinner" />
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
                surClic={ouvrirModalDetails}
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

      {/* Modale détails */}
      {modalDetailsOuverte && (
        <ModaleDetailsLocataire
          locataire={locataireEnConsultation}
          surFermer={fermerModalDetails}
          surModifierLocataire={(loc) => {
            fermerModalDetails();
            ouvrirModalModification(loc);
          }}
        />
      )}
      {/* Modale de confirmation de suppression */}
      <ModaleConfirmation
        ouverte={confirmationSuppression.ouverte}
        titre="Supprimer le locataire"
        message={`Êtes-vous sûr de vouloir supprimer le locataire "${confirmationSuppression.locataire?.nom}" ? cette action est irréversible et supprimera également les données associées.`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => setConfirmationSuppression({ ouverte: false, locataire: null })}
        enCours={enCoursSuppression}
        type="danger"
        texteConfirmer="Supprimer"
      />
    </div>
  );
}
