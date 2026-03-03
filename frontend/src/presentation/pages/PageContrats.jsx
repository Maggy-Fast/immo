/**
 * Page — Gestion des contrats de bail
 */

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { utiliserContrats } from '../../application/hooks/utiliserContrats';
import { utiliserBiens } from '../../application/hooks/utiliserBiens';
import { utiliserLocataires } from '../../application/hooks/utiliserLocataires';
import CarteContrat from '../composants/contrats/CarteContrat';
import FormulaireContrat from '../composants/contrats/FormulaireContrat';
import { OPTIONS_STATUTS_CONTRAT } from '../../domaine/valeursObjets/statutContrat';
import './PageContrats.css';

export default function PageContrats() {
  const [filtres, setFiltres] = useState({
    statut: '',
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [contratEnEdition, setContratEnEdition] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  const {
    contrats,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
  } = utiliserContrats(filtres);

  // Charger biens et locataires pour le formulaire
  const { biens } = utiliserBiens();
  const { locataires } = utiliserLocataires();

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const reinitialiserFiltres = () => {
    setFiltres({ statut: '', recherche: '' });
  };

  const ouvrirModalCreation = () => {
    setContratEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalModification = (contrat) => {
    setContratEnEdition(contrat);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setContratEnEdition(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (contratEnEdition) {
        await modifier({ id: contratEnEdition.id, donnees });
      } else {
        await creer(donnees);
      }
      fermerModal();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const gererSuppression = async (contrat) => {
    const message = `Êtes-vous sûr de vouloir supprimer ce contrat ?`;
    if (window.confirm(message)) {
      try {
        await supprimer(contrat.id);
      } catch (error) {
        console.error('Erreur suppression:', error);
      }
    }
  };

  const filtresActifs = Object.values(filtres).some((v) => v !== '');

  return (
    <div className="page-contrats">
      {/* En-tête */}
      <div className="page-contrats__entete">
        <div>
          <h1 className="page-contrats__titre">Contrats de Bail</h1>
          <p className="page-contrats__description">
            Gérez vos contrats de location
          </p>
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
          <Plus size={20} />
          Nouveau contrat
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="page-contrats__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher..."
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
          {filtresActifs && (
            <span className="badge-notification">
              {Object.values(filtres).filter(v => v !== '').length}
            </span>
          )}
        </button>
      </div>

      {/* Panneau de filtres */}
      {afficherFiltres && (
        <div className="page-contrats__filtres">
          <div className="page-contrats__filtres-grille">
            <div className="champ-formulaire">
              <label className="champ-formulaire__label">Statut</label>
              <select
                value={filtres.statut}
                onChange={(e) => gererChangementFiltre('statut', e.target.value)}
                className="champ-formulaire__select"
              >
                <option value="">Tous les statuts</option>
                {OPTIONS_STATUTS_CONTRAT.map((option) => (
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
      <div className="page-contrats__contenu">
        {chargement && (
          <div className="page-contrats__chargement">
            <div className="chargement__spinner" />
            <p>Chargement des contrats...</p>
          </div>
        )}

        {erreur && (
          <div className="page-contrats__erreur">
            <p>Une erreur est survenue lors du chargement des contrats.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && contrats.length === 0 && (
          <div className="page-contrats__vide">
            <p>Aucun contrat trouvé.</p>
            {filtresActifs ? (
              <button className="bouton bouton--secondaire" onClick={reinitialiserFiltres}>
                Réinitialiser les filtres
              </button>
            ) : (
              <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
                <Plus size={20} />
                Créer votre premier contrat
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && contrats.length > 0 && (
          <div className="page-contrats__grille">
            {contrats.map((contrat) => (
              <CarteContrat
                key={contrat.id}
                contrat={contrat}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulaireContrat
          contrat={contratEnEdition}
          biens={biens}
          locataires={locataires}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}
    </div>
  );
}
