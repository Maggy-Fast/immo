/**
 * Page — Gestion des loyers et paiements
 */

import { useState } from 'react';
import { Filter, TrendingUp, TrendingDown, DollarSign, Loader2, Play } from 'lucide-react';
import { utiliserLoyers } from '../../application/hooks/utiliserLoyers';
import LigneLoyer from '../composants/loyers/LigneLoyer';
import ModalPaiement from '../composants/loyers/ModalPaiement';
import { OPTIONS_STATUTS_LOYER } from '../../domaine/valeursObjets/statutLoyer';
import { formaterMontant } from '../../application/utils/formatters';
import './PageLoyers.css';

export default function PageLoyers() {
  const [filtres, setFiltres] = useState({
    statut: '',
    mois: '',
  });

  const [modalPaiementOuverte, setModalPaiementOuverte] = useState(false);
  const [loyerEnPaiement, setLoyerEnPaiement] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  const {
    loyers,
    chargement,
    erreur,
    enregistrerPaiement,
    telechargerQuittance,
    generer,
    enCoursPaiement,
    enCoursTelechargement,
    enCoursGeneration,
  } = utiliserLoyers(filtres);

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const reinitialiserFiltres = () => {
    setFiltres({ statut: '', mois: '' });
  };

  const ouvrirModalPaiement = (loyer) => {
    setLoyerEnPaiement(loyer);
    setModalPaiementOuverte(true);
  };

  const fermerModalPaiement = () => {
    setModalPaiementOuverte(false);
    setLoyerEnPaiement(null);
  };

  const gererPaiement = async (donnees) => {
    try {
      await enregistrerPaiement({ id: loyerEnPaiement.id, donnees });
      fermerModalPaiement();
    } catch (error) {
      console.error('Erreur paiement:', error);
    }
  };

  const gererTelechargementQuittance = async (idLoyer) => {
    try {
      await telechargerQuittance(idLoyer);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  const gererGenerationLoyers = async () => {
    try {
      await generer();
      alert('Génération terminée avec succès !');
    } catch (error) {
      console.error('Erreur génération:', error);
      alert('Erreur lors de la génération des loyers.');
    }
  };

  // Calculer statistiques
  const stats = loyers.reduce(
    (acc, loyer) => {
      acc.total += loyer.montant;
      if (loyer.statut === 'paye') {
        acc.payes += loyer.montant;
      } else {
        acc.impayes += loyer.montant;
      }
      return acc;
    },
    { total: 0, payes: 0, impayes: 0 }
  );

  const tauxRecouvrement = stats.total > 0 ? Math.round((stats.payes / stats.total) * 100) : 0;

  const filtresActifs = Object.values(filtres).some((v) => v !== '');

  return (
    <div className="page-loyers">
      {/* En-tête */}
      <div className="page-loyers__entete">
        <div>
          <h1 className="page-loyers__titre">Loyers & Paiements</h1>
          <p className="page-loyers__description">
            Suivez les paiements et générez les quittances
          </p>
        </div>
        <button 
          className="bouton bouton--primaire" 
          onClick={gererGenerationLoyers}
          disabled={enCoursGeneration}
        >
          {enCoursGeneration ? (
            <Loader2 size={20} className="chargement__spinner" />
          ) : (
            <Play size={20} />
          )}
          Générer les loyers du mois
        </button>
      </div>

      {/* Statistiques */}
      {!chargement && loyers.length > 0 && (
        <div className="page-loyers__stats">
          <div className="stat-carte">
            <div className="stat-carte__icone stat-carte__icone--primaire">
              <DollarSign size={24} />
            </div>
            <div className="stat-carte__contenu">
              <span className="stat-carte__label">Total attendu</span>
              <span className="stat-carte__valeur">{formaterMontant(stats.total)}</span>
            </div>
          </div>

          <div className="stat-carte">
            <div className="stat-carte__icone stat-carte__icone--success">
              <TrendingUp size={24} />
            </div>
            <div className="stat-carte__contenu">
              <span className="stat-carte__label">Payés</span>
              <span className="stat-carte__valeur">{formaterMontant(stats.payes)}</span>
            </div>
          </div>

          <div className="stat-carte">
            <div className="stat-carte__icone stat-carte__icone--danger">
              <TrendingDown size={24} />
            </div>
            <div className="stat-carte__contenu">
              <span className="stat-carte__label">Impayés</span>
              <span className="stat-carte__valeur">{formaterMontant(stats.impayes)}</span>
            </div>
          </div>

          <div className="stat-carte">
            <div className="stat-carte__contenu stat-carte__contenu--centre">
              <span className="stat-carte__label">Taux de recouvrement</span>
              <span className="stat-carte__valeur stat-carte__valeur--pourcentage">
                {tauxRecouvrement}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="page-loyers__barre-filtres">
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

      {afficherFiltres && (
        <div className="page-loyers__filtres">
          <div className="page-loyers__filtres-grille">
            <div className="champ-formulaire">
              <label className="champ-formulaire__label">Statut</label>
              <select
                value={filtres.statut}
                onChange={(e) => gererChangementFiltre('statut', e.target.value)}
                className="champ-formulaire__select"
              >
                <option value="">Tous les statuts</option>
                {OPTIONS_STATUTS_LOYER.map((option) => (
                  <option key={option.valeur} value={option.valeur}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="champ-formulaire">
              <label className="champ-formulaire__label">Mois</label>
              <input
                type="month"
                value={filtres.mois}
                onChange={(e) => gererChangementFiltre('mois', e.target.value)}
                className="champ-formulaire__input"
              />
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
      <div className="page-loyers__contenu">
        {chargement && (
          <div className="page-loyers__chargement">
            <Loader2 size={24} className="chargement__spinner" />
            <p>Chargement des loyers...</p>
          </div>
        )}

        {erreur && (
          <div className="page-loyers__erreur">
            <p>Une erreur est survenue lors du chargement des loyers.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && loyers.length === 0 && (
          <div className="page-loyers__vide">
            <p>Aucun loyer trouvé.</p>
            {filtresActifs && (
              <button className="bouton bouton--secondaire" onClick={reinitialiserFiltres}>
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && loyers.length > 0 && (
          <div className="page-loyers__tableau-conteneur">
            <table className="tableau-loyers">
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Bien / Locataire</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loyers.map((loyer) => (
                  <LigneLoyer
                    key={loyer.id}
                    loyer={loyer}
                    surPayer={ouvrirModalPaiement}
                    surTelechargerQuittance={gererTelechargementQuittance}
                    enCoursTelechargement={enCoursTelechargement}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal paiement */}
      {modalPaiementOuverte && loyerEnPaiement && (
        <ModalPaiement
          loyer={loyerEnPaiement}
          surSoumettre={gererPaiement}
          surAnnuler={fermerModalPaiement}
          enCours={enCoursPaiement}
        />
      )}
    </div>
  );
}
