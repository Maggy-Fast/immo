/**
 * Page — Gestion des biens immobiliers
 */

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { utiliserBiens } from '../../application/hooks/utiliserBiens';
import CarteBien from '../composants/biens/CarteBien';
import FormulaireBien from '../composants/biens/FormulaireBien';
import { OPTIONS_TYPES_BIEN } from '../../domaine/valeursObjets/typeBien';
import { OPTIONS_STATUTS_BIEN } from '../../domaine/valeursObjets/statutBien';
import './PageBiens.css';

export default function PageBiens() {
  const [filtres, setFiltres] = useState({
    type: '',
    statut: '',
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [bienEnEdition, setBienEnEdition] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  const {
    biens,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
    enCoursSuppression,
  } = utiliserBiens(filtres);

  // Mock proprietaires - à remplacer par un vrai hook
  const proprietaires = [
    { id: 1, nom: 'Ibrahima Sow' },
    { id: 2, nom: 'Fatou Diop' },
    { id: 3, nom: 'Amadou Ba' },
  ];

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const reinitialiserFiltres = () => {
    setFiltres({ type: '', statut: '', recherche: '' });
  };

  const ouvrirModalCreation = () => {
    setBienEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalModification = (bien) => {
    setBienEnEdition(bien);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setBienEnEdition(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (bienEnEdition) {
        await modifier({ id: bienEnEdition.id, donnees });
      } else {
        await creer(donnees);
      }
      fermerModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppression = async (bien) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le bien "${bien.adresse}" ?`)) {
      try {
        await supprimer(bien.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const filtresActifs = Object.values(filtres).some((v) => v !== '');

  return (
    <div className="page-biens">
      {/* En-tête */}
      <div className="page-biens__entete">
        <div>
          <h1 className="page-biens__titre">Biens Immobiliers</h1>
          <p className="page-biens__description">
            Gérez votre portefeuille de biens immobiliers
          </p>
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
          <Plus size={20} />
          Nouveau bien
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="page-biens__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher par adresse..."
            value={filtres.recherche}
            onChange={(e) => gererChangementFiltre('recherche', e.target.value)}
            className="champ-recherche__input"
          />
        </div>

        <button
          className={`bouton bouton--secondaire ${afficherFiltres ? 'bouton--actif' : ''}`}
          onClick={() => setAfficherFiltres(!afficherFiltres)}
        >
          <Filter size={20} />
          Filtres
          {filtresActifs && <span className="badge-notification">{Object.values(filtres).filter(v => v !== '').length}</span>}
        </button>
      </div>

      {/* Panneau de filtres */}
      {afficherFiltres && (
        <div className="page-biens__filtres">
          <div className="page-biens__filtres-grille">
            <div className="champ-formulaire">
              <label className="champ-formulaire__label">Type de bien</label>
              <select
                value={filtres.type}
                onChange={(e) => gererChangementFiltre('type', e.target.value)}
                className="champ-formulaire__select"
              >
                <option value="">Tous les types</option>
                {OPTIONS_TYPES_BIEN.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="champ-formulaire">
              <label className="champ-formulaire__label">Statut</label>
              <select
                value={filtres.statut}
                onChange={(e) => gererChangementFiltre('statut', e.target.value)}
                className="champ-formulaire__select"
              >
                <option value="">Tous les statuts</option>
                {OPTIONS_STATUTS_BIEN.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filtresActifs && (
            <button className="bouton bouton--texte" onClick={reinitialiserFiltres}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* Contenu */}
      <div className="page-biens__contenu">
        {chargement && (
          <div className="page-biens__chargement">
            <div className="chargement__spinner" />
            <p>Chargement des biens...</p>
          </div>
        )}

        {erreur && (
          <div className="page-biens__erreur">
            <p>Une erreur est survenue lors du chargement des biens.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && biens.length === 0 && (
          <div className="page-biens__vide">
            <p>Aucun bien trouvé.</p>
            {filtresActifs ? (
              <button className="bouton bouton--secondaire" onClick={reinitialiserFiltres}>
                Réinitialiser les filtres
              </button>
            ) : (
              <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
                <Plus size={20} />
                Créer votre premier bien
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && biens.length > 0 && (
          <div className="page-biens__grille">
            {biens.map((bien) => (
              <CarteBien
                key={bien.id}
                bien={bien}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulaireBien
          bien={bienEnEdition}
          proprietaires={proprietaires}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}
    </div>
  );
}
