/**
 * Page — Gestion des Cotisations
 */

import { useState } from 'react';
import { Plus, Search, Filter, DollarSign, Calendar, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { utiliserCotisations } from '../../application/hooks/utiliserCotisations';
import { lireIdGroupeCooperativeActif } from '../../application/utils/groupeCooperativeActif';
import FormulairePaiement from '../composants/cooperative/FormulairePaiement';
import FormulaireParametreCotisation from '../composants/cooperative/FormulaireParametreCotisation';
import SelecteurGroupeCooperative from '../composants/cooperative/SelecteurGroupeCooperative';
import { formaterMontant } from '../../application/utils/formatters';
import './PageCotisations.css';

export default function PageCotisations() {
  const [idGroupe, setIdGroupe] = useState(() => lireIdGroupeCooperativeActif());
  const [filtres, setFiltres] = useState({ statut: '', id_adherent: '', mois: '' });
  const [modalPaiementOuverte, setModalPaiementOuverte] = useState(false);
  const [modalParametreOuverte, setModalParametreOuverte] = useState(false);
  const [echeanceSelectionnee, setEcheanceSelectionnee] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const [ongletActif, setOngletActif] = useState('echeances'); // 'echeances' ou 'parametres'

  const {
    echeances,
    parametreActif,
    statistiques,
    chargement,
    erreur,
    payerEcheance,
    creerParametre,
    genererEcheances,
    verifierRetards,
    enCoursPaiement,
  } = utiliserCotisations({ ...filtres, id_groupe: idGroupe || null });

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const ouvrirModalPaiement = (echeance) => {
    setEcheanceSelectionnee(echeance);
    setModalPaiementOuverte(true);
  };

  const fermerModalPaiement = () => {
    setModalPaiementOuverte(false);
    setEcheanceSelectionnee(null);
  };

  const gererPaiement = async (donnees) => {
    try {
      await payerEcheance({ id: echeanceSelectionnee.id, donnees });
      fermerModalPaiement();
    } catch (error) {
      console.error('Erreur paiement:', error);
    }
  };

  const gererCreationParametre = async (donnees) => {
    try {
      await creerParametre({ ...donnees, id_groupe: idGroupe || null });
      setModalParametreOuverte(false);
    } catch (error) {
      console.error('Erreur création paramètre:', error);
    }
  };

  const obtenirBadgeStatut = (statut) => {
    const badges = {
      a_payer: { classe: 'badge--info', texte: 'À payer', icone: AlertCircle },
      paye: { classe: 'badge--succes', texte: 'Payé', icone: CheckCircle },
      en_retard: { classe: 'badge--danger', texte: 'En retard', icone: XCircle },
    };
    return badges[statut] || badges.a_payer;
  };

  return (
    <div className="page-cotisations">
      {/* En-tête */}
      <div className="page-cotisations__entete">
        <div>
          <h1 className="page-cotisations__titre">Cotisations</h1>
          <p className="page-cotisations__description">
            Gestion des cotisations et échéances
          </p>
        </div>
        <div style={{ minWidth: 260 }}>
          <SelecteurGroupeCooperative
            valeur={idGroupe ? String(idGroupe) : ''}
            surChangement={(v) => setIdGroupe(v ? parseInt(v, 10) : null)}
          />
        </div>
        <div className="page-cotisations__actions">
          <button
            className="bouton bouton--secondaire"
            onClick={() => verifierRetards()}
          >
            Vérifier les retards
          </button>
          <button
            className="bouton bouton--primaire"
            onClick={() => setModalParametreOuverte(true)}
          >
            <Plus size={20} />
            Configurer cotisation
          </button>
        </div>
      </div>

      {/* Statistiques */}
      {statistiques && (
        <div className="page-cotisations__stats">
          <div className="carte-stat carte-stat--vert">
            <div className="carte-stat__icone">
              <CheckCircle size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">Total Encaissé</p>
              <p className="carte-stat__valeur">
                {formaterMontant(statistiques.total_encaisse || 0)}
              </p>
              <p className="carte-stat__detail">
                {statistiques.nb_echeances_payees || 0} paiements
              </p>
            </div>
          </div>

          <div className="carte-stat carte-stat--bleu">
            <div className="carte-stat__icone">
              <AlertCircle size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">En Attente</p>
              <p className="carte-stat__valeur">
                {formaterMontant(statistiques.total_en_attente || 0)}
              </p>
            </div>
          </div>

          <div className="carte-stat carte-stat--rouge">
            <div className="carte-stat__icone">
              <XCircle size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">En Retard</p>
              <p className="carte-stat__valeur">
                {formaterMontant(statistiques.total_en_retard || 0)}
              </p>
              <p className="carte-stat__detail">
                {statistiques.nb_echeances_retard || 0} échéances
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="page-cotisations__onglets">
        <button
          className={`onglet ${ongletActif === 'echeances' ? 'onglet--actif' : ''}`}
          onClick={() => setOngletActif('echeances')}
        >
          Échéances
        </button>
        <button
          className={`onglet ${ongletActif === 'parametres' ? 'onglet--actif' : ''}`}
          onClick={() => setOngletActif('parametres')}
        >
          Paramètres
        </button>
      </div>

      {/* Contenu Échéances */}
      {ongletActif === 'echeances' && (
        <>
          {/* Barre de recherche et filtres */}
          <div className="page-cotisations__barre-recherche">
            <div className="champ-recherche">
              <Search size={20} className="champ-recherche__icone" />
              <input
                type="text"
                placeholder="Rechercher par adhérent..."
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
            </button>
          </div>

          {/* Filtres */}
          {afficherFiltres && (
            <div className="page-cotisations__filtres">
              <div className="page-cotisations__filtres-grille">
                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Statut</label>
                  <select
                    value={filtres.statut}
                    onChange={(e) => gererChangementFiltre('statut', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="a_payer">À payer</option>
                    <option value="paye">Payé</option>
                    <option value="en_retard">En retard</option>
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
            </div>
          )}

          {/* Liste des échéances */}
          <div className="page-cotisations__contenu">
            {chargement && (
              <div className="page-cotisations__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des échéances...</p>
              </div>
            )}

            {erreur && (
              <div className="page-cotisations__erreur">
                <p>Erreur lors du chargement des échéances</p>
              </div>
            )}

            {!chargement && !erreur && echeances.length === 0 && (
              <div className="page-cotisations__vide">
                <p>Aucune échéance trouvée</p>
              </div>
            )}

            {!chargement && !erreur && echeances.length > 0 && (
              <div className="page-cotisations__liste">
                {echeances.map((echeance) => {
                  const badge = obtenirBadgeStatut(echeance.statut);
                  const Icone = badge.icone;

                  return (
                    <div key={echeance.id} className="carte-echeance">
                      <div className="carte-echeance__entete">
                        <div className="carte-echeance__info">
                          <h3 className="carte-echeance__adherent">
                            {echeance.adherent?.prenom} {echeance.adherent?.nom}
                          </h3>
                          <p className="carte-echeance__numero">
                            {echeance.adherent?.numero}
                          </p>
                        </div>
                        <span className={`badge ${badge.classe}`}>
                          <Icone size={14} />
                          {badge.texte}
                        </span>
                      </div>

                      <div className="carte-echeance__corps">
                        <div className="carte-echeance__detail">
                          <Calendar size={16} />
                          <span>
                            Échéance: {new Date(echeance.date_echeance).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="carte-echeance__detail">
                          <DollarSign size={16} />
                          <span className="carte-echeance__montant">
                            {formaterMontant(echeance.montant)}
                          </span>
                        </div>
                        {echeance.date_paiement && (
                          <div className="carte-echeance__detail">
                            <CheckCircle size={16} />
                            <span>
                              Payé le {new Date(echeance.date_paiement).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                        {echeance.mode_paiement && (
                          <div className="carte-echeance__detail">
                            <span className="badge badge--secondaire">
                              {echeance.mode_paiement}
                            </span>
                          </div>
                        )}
                      </div>

                      {echeance.statut !== 'paye' && (
                        <div className="carte-echeance__actions">
                          <button
                            className="bouton bouton--primaire bouton--petit"
                            onClick={() => ouvrirModalPaiement(echeance)}
                          >
                            Enregistrer paiement
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Contenu Paramètres */}
      {ongletActif === 'parametres' && (
        <div className="page-cotisations__parametres">
          {parametreActif ? (
            <div className="carte">
              <div className="carte__entete">
                <h3 className="carte__titre">Paramètre Actif</h3>
              </div>
              <div className="carte__corps">
                <div className="liste-stats">
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Montant</span>
                    <span className="stat-ligne__valeur">
                      {formaterMontant(parametreActif.montant)}
                    </span>
                  </div>
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Fréquence</span>
                    <span className="stat-ligne__valeur">{parametreActif.frequence}</span>
                  </div>
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Jour d'échéance</span>
                    <span className="stat-ligne__valeur">{parametreActif.jour_echeance}</span>
                  </div>
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Période de grâce</span>
                    <span className="stat-ligne__valeur">{parametreActif.periode_grace_jours} jours</span>
                  </div>
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Max retards avant suspension</span>
                    <span className="stat-ligne__valeur">{parametreActif.max_echeances_retard}</span>
                  </div>
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Date de début</span>
                    <span className="stat-ligne__valeur">
                      {new Date(parametreActif.date_debut).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="stat-ligne">
                    <span className="stat-ligne__label">Mode de pénalité</span>
                    <span className="stat-ligne__valeur">
                      {parametreActif.mode_penalite === 'pourcentage' ? 'Pourcentage' :
                        parametreActif.mode_penalite === 'fixe' ? 'Montant Fixe' : 'Aucune'}
                    </span>
                  </div>
                  {parametreActif.mode_penalite === 'pourcentage' && (
                    <div className="stat-ligne">
                      <span className="stat-ligne__label">Pourcentage</span>
                      <span className="stat-ligne__valeur">{parametreActif.pourcentage_penalite}%</span>
                    </div>
                  )}
                  {parametreActif.mode_penalite === 'fixe' && (
                    <div className="stat-ligne">
                      <span className="stat-ligne__label">Montant fixe</span>
                      <span className="stat-ligne__valeur">
                        {formaterMontant(parametreActif.montant_penalite_fixe)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="page-cotisations__vide">
              <p>Aucun paramètre de cotisation configuré</p>
              <button
                className="bouton bouton--primaire"
                onClick={() => setModalParametreOuverte(true)}
              >
                <Plus size={20} />
                Créer un paramètre
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal paiement */}
      {modalPaiementOuverte && echeanceSelectionnee && (
        <FormulairePaiement
          echeance={echeanceSelectionnee}
          surSoumettre={gererPaiement}
          surAnnuler={fermerModalPaiement}
          enCours={enCoursPaiement}
        />
      )}

      {/* Modal paramètre */}
      {modalParametreOuverte && (
        <FormulaireParametreCotisation
          surSoumettre={gererCreationParametre}
          surAnnuler={() => setModalParametreOuverte(false)}
        />
      )}
    </div>
  );
}
