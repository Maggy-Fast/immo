import { useMemo, useState } from 'react';
import { Plus, Search, Hammer, DollarSign, Download, Trash2, Filter, FileText, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { utiliserTravaux } from '../../application/hooks/utiliserTravaux';
import { utiliserDepenses } from '../../application/hooks/utiliserDepenses';
import { utiliserBiens } from '../../application/hooks/utiliserBiens';
import { serviceDepenses } from '../../infrastructure/api/serviceDepenses';
import { formaterMontant } from '../../application/utils/formatters';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire, ModaleConfirmation } from '../composants/communs';
import { useToast } from '../composants/communs';
import './PageTravauxDepenses.css';

const STATUTS_TRAVAUX = [
  { valeur: '', label: 'Tous les statuts' },
  { valeur: 'planifie', label: 'Planifié' },
  { valeur: 'en_cours', label: 'En cours' },
  { valeur: 'termine', label: 'Terminé' },
  { valeur: 'annule', label: 'Annulé' },
];

const TYPES_DEPENSES = [
  { valeur: '', label: 'Tous les types' },
  { valeur: 'materiaux', label: 'Matériaux' },
  { valeur: 'main_oeuvre', label: "Main d'œuvre" },
  { valeur: 'autres', label: 'Autres' },
  { valeur: 'frais_administratif', label: 'Frais administratifs' },
];

const STATUTS_PAIEMENT = [
  { valeur: '', label: 'Tous les statuts' },
  { valeur: 'paye', label: 'Payé' },
  { valeur: 'en_attente', label: 'En attente' },
  { valeur: 'impaye', label: 'Impayé' },
];

function obtenirNomFichierDepuisUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname.split('/').pop() || 'facture.pdf';
  } catch {
    return 'facture.pdf';
  }
}

async function extraireMessageErreurDepuisAxios(erreur) {
  const data = erreur?.response?.data;

  if (!data) return null;

  if (typeof data === 'string') return data;

  if (data instanceof Blob) {
    try {
      const texte = await data.text();
      try {
        const json = JSON.parse(texte);
        return json?.message || texte;
      } catch {
        return texte;
      }
    } catch {
      return null;
    }
  }

  if (typeof data === 'object' && data?.message) return data.message;

  return null;
}

export default function PageTravauxDepenses() {
  const { notifier } = useToast();
  const [ongletActif, setOngletActif] = useState('travaux');
  
  // État pour les travaux
  const [filtresTravaux, setFiltresTravaux] = useState({
    recherche: '',
    statut: '',
    idBien: '',
  });
  const [afficherFiltresTravaux, setAfficherFiltresTravaux] = useState(false);
  const [modaleTravailOuverte, setModaleTravailOuverte] = useState(false);
  const [confirmationSuppressionTravail, setConfirmationSuppressionTravail] = useState({ ouverte: false, travail: null });

  // État pour les dépenses
  const [filtresDepenses, setFiltresDepenses] = useState({
    recherche: '',
    typeDepense: '',
    statutPaiement: '',
    idBien: '',
    idTravaux: '',
  });
  const [afficherFiltresDepenses, setAfficherFiltresDepenses] = useState(false);
  const [modaleDepenseOuverte, setModaleDepenseOuverte] = useState(false);
  const [confirmationSuppressionDepense, setConfirmationSuppressionDepense] = useState({ ouverte: false, depense: null });

  // Hooks
  const {
    travaux,
    chargement: chargementTravaux,
    erreur: erreurTravaux,
    creer: creerTravail,
    supprimer: supprimerTravail,
    enCoursCreation: enCoursCreationTravail,
    enCoursSuppression: enCoursSuppressionTravail,
  } = utiliserTravaux(filtresTravaux);

  const {
    depenses,
    chargement: chargementDepenses,
    erreur: erreurDepenses,
    creer: creerDepense,
    supprimer: supprimerDepense,
    enCoursCreation: enCoursCreationDepense,
    enCoursSuppression: enCoursSuppressionDepense,
  } = utiliserDepenses(filtresDepenses);

  const { biens } = utiliserBiens({});

  const optionsBiens = useMemo(() => {
    return [
      { valeur: '', label: 'Tous les biens' },
      ...biens.map((b) => ({ valeur: String(b.id), label: b.adresse || `Bien #${b.id}` })),
    ];
  }, [biens]);

  const optionsTravaux = useMemo(() => {
    return [
      { valeur: '', label: 'Aucun travail' },
      ...travaux.map((t) => ({ valeur: String(t.id), label: t.intitule })),
    ];
  }, [travaux]);

  // Formulaires
  const [formulaireTravail, setFormulaireTravail] = useState({
    idBien: '',
    intitule: '',
    description: '',
    montantEstime: '',
    dateDebut: '',
    dateFin: '',
    statut: 'planifie',
  });

  const [formulaireDepense, setFormulaireDepense] = useState({
    idBien: '',
    idTravaux: '',
    intitule: '',
    description: '',
    montant: '',
    dateDepense: '',
    typeDepense: 'materiaux',
    statutPaiement: 'en_attente',
    fichierFacture: null,
  });

  const [erreursFormulaireTravail, setErreursFormulaireTravail] = useState({});
  const [erreursFormulaireDepense, setErreursFormulaireDepense] = useState({});

  // Gestionnaires pour les travaux
  const gererChangementFiltreTravaux = (champ, valeur) => {
    setFiltresTravaux((prev) => ({ ...prev, [champ]: valeur }));
  };

  const reinitialiserFiltresTravaux = () => {
    setFiltresTravaux({ recherche: '', statut: '', idBien: '' });
  };

  const ouvrirModaleTravail = () => {
    setErreursFormulaireTravail({});
    setFormulaireTravail({
      idBien: '',
      intitule: '',
      description: '',
      montantEstime: '',
      dateDebut: '',
      dateFin: '',
      statut: 'planifie',
    });
    setModaleTravailOuverte(true);
  };

  const fermerModaleTravail = () => {
    if (enCoursCreationTravail) return;
    setModaleTravailOuverte(false);
  };

  const validerFormulaireTravail = () => {
    const errs = {};
    if (!formulaireTravail.idBien) errs.idBien = 'Le bien est requis';
    if (!formulaireTravail.intitule) errs.intitule = "L'intitulé est requis";
    if (!formulaireTravail.statut) errs.statut = 'Le statut est requis';

    setErreursFormulaireTravail(errs);
    return Object.keys(errs).length === 0;
  };

  const soumettreTravail = async () => {
    if (!validerFormulaireTravail()) return;

    try {
      await creerTravail({
        id_bien: formulaireTravail.idBien,
        intitule: formulaireTravail.intitule,
        description: formulaireTravail.description,
        montant_estime: formulaireTravail.montantEstime || null,
        date_debut: formulaireTravail.dateDebut || null,
        date_fin: formulaireTravail.dateFin || null,
        statut: formulaireTravail.statut,
      });
      setModaleTravailOuverte(false);
    } catch (erreur) {
      const message = await extraireMessageErreurDepuisAxios(erreur);
      notifier(message || "Erreur lors de l'ajout du travail", 'error');
    }
  };

  const demanderSuppressionTravail = (travail) => {
    setConfirmationSuppressionTravail({ ouverte: true, travail });
  };

  const confirmerSuppressionTravail = async () => {
    const travail = confirmationSuppressionTravail.travail;
    if (!travail) return;
    await supprimerTravail(travail.id);
    setConfirmationSuppressionTravail({ ouverte: false, travail: null });
  };

  // Gestionnaires pour les dépenses
  const gererChangementFiltreDepenses = (champ, valeur) => {
    setFiltresDepenses((prev) => ({ ...prev, [champ]: valeur }));
  };

  const reinitialiserFiltresDepenses = () => {
    setFiltresDepenses({ recherche: '', typeDepense: '', statutPaiement: '', idBien: '', idTravaux: '' });
  };

  const ouvrirModaleDepense = () => {
    setErreursFormulaireDepense({});
    setFormulaireDepense({
      idBien: '',
      idTravaux: '',
      intitule: '',
      description: '',
      montant: '',
      dateDepense: '',
      typeDepense: 'materiaux',
      statutPaiement: 'en_attente',
      fichierFacture: null,
    });
    setModaleDepenseOuverte(true);
  };

  const fermerModaleDepense = () => {
    if (enCoursCreationDepense) return;
    setModaleDepenseOuverte(false);
  };

  const validerFormulaireDepense = () => {
    const errs = {};
    if (!formulaireDepense.idBien) errs.idBien = 'Le bien est requis';
    if (!formulaireDepense.intitule) errs.intitule = "L'intitulé est requis";
    if (!formulaireDepense.montant) errs.montant = 'Le montant est requis';
    if (!formulaireDepense.dateDepense) errs.dateDepense = 'La date est requise';
    if (!formulaireDepense.typeDepense) errs.typeDepense = 'Le type est requis';
    if (!formulaireDepense.statutPaiement) errs.statutPaiement = 'Le statut de paiement est requis';

    setErreursFormulaireDepense(errs);
    return Object.keys(errs).length === 0;
  };

  const soumettreDepense = async () => {
    if (!validerFormulaireDepense()) return;

    try {
      await creerDepense({
        idBien: formulaireDepense.idBien,
        idTravaux: formulaireDepense.idTravaux || null,
        intitule: formulaireDepense.intitule,
        description: formulaireDepense.description,
        montant: parseFloat(formulaireDepense.montant),
        dateDepense: formulaireDepense.dateDepense,
        typeDepense: formulaireDepense.typeDepense,
        statutPaiement: formulaireDepense.statutPaiement,
        fichierFacture: formulaireDepense.fichierFacture,
      });
      setModaleDepenseOuverte(false);
    } catch (erreur) {
      const message = await extraireMessageErreurDepuisAxios(erreur);
      notifier(message || "Erreur lors de l'ajout de la dépense", 'error');
    }
  };

  const demanderSuppressionDepense = (depense) => {
    setConfirmationSuppressionDepense({ ouverte: true, depense });
  };

  const confirmerSuppressionDepense = async () => {
    const depense = confirmationSuppressionDepense.depense;
    if (!depense) return;
    await supprimerDepense(depense.id);
    setConfirmationSuppressionDepense({ ouverte: false, depense: null });
  };

  const telechargerFacture = (depense) => {
    if (!depense?.id) return;
    serviceDepenses
      .telechargerFacture(depense.id)
      .then((reponse) => {
        const blob = reponse.data;
        const url = window.URL.createObjectURL(blob);

        const nom = `facture-${(depense.intitule || 'depense').toString().trim() || 'depense'}.${(depense.fichier_facture || '').split('.').pop() || 'pdf'}`;

        const lien = document.createElement('a');
        lien.href = url;
        lien.download = nom;
        document.body.appendChild(lien);
        lien.click();
        document.body.removeChild(lien);

        window.URL.revokeObjectURL(url);
      })
      .catch(async (erreur) => {
        const message = await extraireMessageErreurDepuisAxios(erreur);
        notifier(message || 'Erreur lors du téléchargement de la facture', 'error');
      });
  };

  const filtresActifsTravaux = Object.values(filtresTravaux).some((v) => v !== '');
  const filtresActifsDepenses = Object.values(filtresDepenses).some((v) => v !== '');

  // Calcul des totaux
  const totalDepenses = depenses.reduce((sum, dep) => sum + (parseFloat(dep.montant) || 0), 0);
  const montantTravauxEnCours = travaux
    .filter(t => t.statut === 'en_cours')
    .reduce((sum, t) => sum + (parseFloat(t.montant_estime) || 0), 0);

  return (
    <div className="page-travaux-depenses">
      <div className="page-travaux-depenses__entete">
        <div>
          <h1 className="page-travaux-depenses__titre">Travaux & Dépenses</h1>
          <p className="page-travaux-depenses__description">
            Suivez et gérez tous vos travaux immobiliers et les dépenses associées
          </p>
        </div>
        <div className="page-travaux-depenses__statistiques">
          <div className="statistique-carte">
            <div className="statistique-carte__icone">
              <Hammer size={20} />
            </div>
            <div className="statistique-carte__contenu">
              <div className="statistique-carte__valeur">{travaux.filter(t => t.statut === 'en_cours').length}</div>
              <div className="statistique-carte__label">Travaux en cours</div>
            </div>
          </div>
          <div className="statistique-carte">
            <div className="statistique-carte__icone">
              <DollarSign size={20} />
            </div>
            <div className="statistique-carte__contenu">
              <div className="statistique-carte__valeur">{formaterMontant(totalDepenses)}</div>
              <div className="statistique-carte__label">Total dépenses</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-travaux-depenses__onglets">
        <button
          className={`onglet ${ongletActif === 'travaux' ? 'onglet--actif' : ''}`}
          onClick={() => setOngletActif('travaux')}
        >
          <Hammer size={18} />
          Travaux
        </button>
        <button
          className={`onglet ${ongletActif === 'depenses' ? 'onglet--actif' : ''}`}
          onClick={() => setOngletActif('depenses')}
        >
          <DollarSign size={18} />
          Dépenses
        </button>
      </div>

      {ongletActif === 'travaux' && (
        <div className="page-travaux-depenses__section">
          <div className="page-travaux-depenses__barre">
            <div className="champ-recherche">
              <Search size={20} className="champ-recherche__icone" />
              <input
                type="text"
                placeholder="Rechercher un travail..."
                value={filtresTravaux.recherche}
                onChange={(e) => gererChangementFiltreTravaux('recherche', e.target.value)}
                className="champ-recherche__input"
              />
            </div>

            <button
              className={`bouton bouton--secondaire ${afficherFiltresTravaux ? 'bouton--actif' : ''}`}
              onClick={() => setAfficherFiltresTravaux(!afficherFiltresTravaux)}
            >
              <Filter size={20} />
              Filtres
              {filtresActifsTravaux && (
                <span className="badge-notification">
                  {Object.values(filtresTravaux).filter((v) => v !== '').length}
                </span>
              )}
            </button>

            <button className="bouton bouton--primaire" onClick={ouvrirModaleTravail}>
              <Plus size={20} />
              Nouveau travail
            </button>
          </div>

          {afficherFiltresTravaux && (
            <div className="page-travaux-depenses__filtres">
              <div className="page-travaux-depenses__filtres-grille">
                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Bien</label>
                  <select
                    value={filtresTravaux.idBien}
                    onChange={(e) => gererChangementFiltreTravaux('idBien', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    {optionsBiens.map((opt) => (
                      <option key={opt.valeur} value={opt.valeur}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Statut</label>
                  <select
                    value={filtresTravaux.statut}
                    onChange={(e) => gererChangementFiltreTravaux('statut', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    {STATUTS_TRAVAUX.map((opt) => (
                      <option key={opt.valeur} value={opt.valeur}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filtresActifsTravaux && (
                <button className="bouton bouton--texte" onClick={reinitialiserFiltresTravaux}>
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          <div className="page-travaux-depenses__contenu">
            {chargementTravaux && (
              <div className="page-travaux-depenses__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des travaux...</p>
              </div>
            )}

            {erreurTravaux && (
              <div className="page-travaux-depenses__erreur">
                <p>Une erreur est survenue lors du chargement des travaux.</p>
                <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
                  Réessayer
                </button>
              </div>
            )}

            {!chargementTravaux && !erreurTravaux && travaux.length === 0 && (
              <div className="page-travaux-depenses__vide">
                <div className="page-travaux-depenses__vide-icone">
                  <Hammer size={48} />
                </div>
                <p>Aucun travail trouvé.</p>
                <button className="bouton bouton--primaire" onClick={ouvrirModaleTravail}>
                  <Plus size={20} />
                  Ajouter votre premier travail
                </button>
              </div>
            )}

            {!chargementTravaux && !erreurTravaux && travaux.length > 0 && (
              <div className="page-travaux-depenses__liste">
                {travaux.map((travail) => (
                  <div key={travail.id} className="travail-item">
                    <div className="travail-item__icone">
                      <Hammer size={22} />
                    </div>

                    <div className="travail-item__infos">
                      <div className="travail-item__titre">{travail.intitule}</div>
                      <div className="travail-item__meta">
                        <span className={`travail-item__statut travail-item__statut--${travail.statut}`}>
                          {STATUTS_TRAVAUX.find(s => s.valeur === travail.statut)?.label || travail.statut}
                        </span>
                        {travail?.bien?.adresse && <span className="travail-item__bien">{travail.bien.adresse}</span>}
                        {travail.montant_estime && (
                          <span className="travail-item__montant">{formaterMontant(travail.montant_estime)}</span>
                        )}
                      </div>
                      {travail.description && (
                        <div className="travail-item__description">{travail.description}</div>
                      )}
                    </div>

                    <div className="travail-item__actions">
                      <button
                        className="bouton bouton--danger bouton--petit"
                        onClick={() => demanderSuppressionTravail(travail)}
                        disabled={enCoursSuppressionTravail}
                        title="Supprimer"
                        type="button"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {ongletActif === 'depenses' && (
        <div className="page-travaux-depenses__section">
          <div className="page-travaux-depenses__barre">
            <div className="champ-recherche">
              <Search size={20} className="champ-recherche__icone" />
              <input
                type="text"
                placeholder="Rechercher une dépense..."
                value={filtresDepenses.recherche}
                onChange={(e) => gererChangementFiltreDepenses('recherche', e.target.value)}
                className="champ-recherche__input"
              />
            </div>

            <button
              className={`bouton bouton--secondaire ${afficherFiltresDepenses ? 'bouton--actif' : ''}`}
              onClick={() => setAfficherFiltresDepenses(!afficherFiltresDepenses)}
            >
              <Filter size={20} />
              Filtres
              {filtresActifsDepenses && (
                <span className="badge-notification">
                  {Object.values(filtresDepenses).filter((v) => v !== '').length}
                </span>
              )}
            </button>

            <button className="bouton bouton--primaire" onClick={ouvrirModaleDepense}>
              <Plus size={20} />
              Nouvelle dépense
            </button>
          </div>

          {afficherFiltresDepenses && (
            <div className="page-travaux-depenses__filtres">
              <div className="page-travaux-depenses__filtres-grille">
                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Bien</label>
                  <select
                    value={filtresDepenses.idBien}
                    onChange={(e) => gererChangementFiltreDepenses('idBien', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    {optionsBiens.map((opt) => (
                      <option key={opt.valeur} value={opt.valeur}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Type</label>
                  <select
                    value={filtresDepenses.typeDepense}
                    onChange={(e) => gererChangementFiltreDepenses('typeDepense', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    {TYPES_DEPENSES.map((opt) => (
                      <option key={opt.valeur} value={opt.valeur}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Statut paiement</label>
                  <select
                    value={filtresDepenses.statutPaiement}
                    onChange={(e) => gererChangementFiltreDepenses('statutPaiement', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    {STATUTS_PAIEMENT.map((opt) => (
                      <option key={opt.valeur} value={opt.valeur}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="champ-formulaire">
                  <label className="champ-formulaire__label">Travail associé</label>
                  <select
                    value={filtresDepenses.idTravaux}
                    onChange={(e) => gererChangementFiltreDepenses('idTravaux', e.target.value)}
                    className="champ-formulaire__select"
                  >
                    {optionsTravaux.map((opt) => (
                      <option key={opt.valeur} value={opt.valeur}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filtresActifsDepenses && (
                <button className="bouton bouton--texte" onClick={reinitialiserFiltresDepenses}>
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}

          <div className="page-travaux-depenses__contenu">
            {chargementDepenses && (
              <div className="page-travaux-depenses__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des dépenses...</p>
              </div>
            )}

            {erreurDepenses && (
              <div className="page-travaux-depenses__erreur">
                <p>Une erreur est survenue lors du chargement des dépenses.</p>
                <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
                  Réessayer
                </button>
              </div>
            )}

            {!chargementDepenses && !erreurDepenses && depenses.length === 0 && (
              <div className="page-travaux-depenses__vide">
                <div className="page-travaux-depenses__vide-icone">
                  <DollarSign size={48} />
                </div>
                <p>Aucune dépense trouvée.</p>
                <button className="bouton bouton--primaire" onClick={ouvrirModaleDepense}>
                  <Plus size={20} />
                  Ajouter votre première dépense
                </button>
              </div>
            )}

            {!chargementDepenses && !erreurDepenses && depenses.length > 0 && (
              <div className="page-travaux-depenses__liste">
                {depenses.map((depense) => (
                  <div key={depense.id} className="depense-item">
                    <div className="depense-item__icone">
                      <DollarSign size={22} />
                    </div>

                    <div className="depense-item__infos">
                      <div className="depense-item__titre">{depense.intitule}</div>
                      <div className="depense-item__meta">
                        <span className="depense-item__montant">{formaterMontant(depense.montant)}</span>
                        <span className={`depense-item__statut depense-item__statut--${depense.statut_paiement}`}>
                          {STATUTS_PAIEMENT.find(s => s.valeur === depense.statut_paiement)?.label || depense.statut_paiement}
                        </span>
                        <span className="depense-item__type">{TYPES_DEPENSES.find(t => t.valeur === depense.type_depense)?.label || depense.type_depense}</span>
                        {depense?.bien?.adresse && <span className="depense-item__bien">{depense.bien.adresse}</span>}
                        {depense.date_depense && (
                          <span className="depense-item__date">
                            <Calendar size={14} />
                            {new Date(depense.date_depense).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                      {depense.description && (
                        <div className="depense-item__description">{depense.description}</div>
                      )}
                    </div>

                    <div className="depense-item__actions">
                      {depense.fichier_facture && (
                        <button
                          className="bouton bouton--secondaire bouton--petit"
                          onClick={() => telechargerFacture(depense)}
                          title="Télécharger la facture"
                          type="button"
                        >
                          <Download size={16} />
                          Facture
                        </button>
                      )}

                      <button
                        className="bouton bouton--danger bouton--petit"
                        onClick={() => demanderSuppressionDepense(depense)}
                        disabled={enCoursSuppressionDepense}
                        title="Supprimer"
                        type="button"
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modale pour les travaux */}
      {modaleTravailOuverte && (
        <Modale
          titre="Nouveau travail"
          surFermer={fermerModaleTravail}
          taille="moyen"
          enCours={enCoursCreationTravail}
        >
          <Formulaire surSoumettre={soumettreTravail} colonnes={2}>
            <ChampFormulaire
              label="Bien"
              type="select"
              valeur={formulaireTravail.idBien}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, idBien: val }))}
              options={optionsBiens.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaireTravail.idBien}
              required
            />

            <ChampFormulaire
              label="Statut"
              type="select"
              valeur={formulaireTravail.statut}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, statut: val }))}
              options={STATUTS_TRAVAUX.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaireTravail.statut}
              required
            />

            <ChampFormulaire
              label="Intitulé"
              type="text"
              valeur={formulaireTravail.intitule}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, intitule: val }))}
              placeholder="Ex: Rénovation toiture"
              erreur={erreursFormulaireTravail.intitule}
              required
              largeurComplete
            />

            <ChampFormulaire
              label="Description"
              type="textarea"
              valeur={formulaireTravail.description}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, description: val }))}
              placeholder="Description détaillée du travail..."
              largeurComplete
            />

            <ChampFormulaire
              label="Montant estimé (FCFA)"
              type="number"
              valeur={formulaireTravail.montantEstime}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, montantEstime: val }))}
              placeholder="0.00 FCFA"
              step="0.01"
              min="0"
            />

            <ChampFormulaire
              label="Date de début"
              type="date"
              valeur={formulaireTravail.dateDebut}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, dateDebut: val }))}
            />

            <ChampFormulaire
              label="Date de fin"
              type="date"
              valeur={formulaireTravail.dateFin}
              onChange={(val) => setFormulaireTravail((p) => ({ ...p, dateFin: val }))}
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <ActionsFormulaire
                surAnnuler={fermerModaleTravail}
                texteBoutonPrincipal="Ajouter"
                texteChargement="Ajout..."
                enCours={enCoursCreationTravail}
              />
            </div>
          </Formulaire>
        </Modale>
      )}

      {/* Modale pour les dépenses */}
      {modaleDepenseOuverte && (
        <Modale
          titre="Nouvelle dépense"
          surFermer={fermerModaleDepense}
          taille="grand"
          enCours={enCoursCreationDepense}
        >
          <Formulaire surSoumettre={soumettreDepense} colonnes={2}>
            <ChampFormulaire
              label="Bien"
              type="select"
              valeur={formulaireDepense.idBien}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, idBien: val }))}
              options={optionsBiens.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaireDepense.idBien}
              required
            />

            <ChampFormulaire
              label="Travail associé"
              type="select"
              valeur={formulaireDepense.idTravaux}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, idTravaux: val }))}
              options={optionsTravaux}
            />

            <ChampFormulaire
              label="Intitulé"
              type="text"
              valeur={formulaireDepense.intitule}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, intitule: val }))}
              placeholder="Ex: Achat de tuiles"
              erreur={erreursFormulaireDepense.intitule}
              required
              largeurComplete
            />

            <ChampFormulaire
              label="Description"
              type="textarea"
              valeur={formulaireDepense.description}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, description: val }))}
              placeholder="Description détaillée de la dépense..."
              largeurComplete
            />

            <ChampFormulaire
              label="Montant (FCFA)"
              type="number"
              valeur={formulaireDepense.montant}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, montant: val }))}
              placeholder="0.00 FCFA"
              step="0.01"
              min="0"
              erreur={erreursFormulaireDepense.montant}
              required
            />

            <ChampFormulaire
              label="Date de dépense"
              type="date"
              valeur={formulaireDepense.dateDepense}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, dateDepense: val }))}
              erreur={erreursFormulaireDepense.dateDepense}
              required
            />

            <ChampFormulaire
              label="Type de dépense"
              type="select"
              valeur={formulaireDepense.typeDepense}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, typeDepense: val }))}
              options={TYPES_DEPENSES.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaireDepense.typeDepense}
              required
            />

            <ChampFormulaire
              label="Statut de paiement"
              type="select"
              valeur={formulaireDepense.statutPaiement}
              onChange={(val) => setFormulaireDepense((p) => ({ ...p, statutPaiement: val }))}
              options={STATUTS_PAIEMENT.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaireDepense.statutPaiement}
              required
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="champ-formulaire">
                <label className="champ-formulaire__label">Facture (PDF/Image)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFormulaireDepense((p) => ({ ...p, fichierFacture: e.target.files?.[0] || null }))}
                  className={`champ-formulaire__input ${erreursFormulaireDepense.fichierFacture ? 'champ-formulaire__input--erreur' : ''}`}
                  disabled={enCoursCreationDepense}
                />
                {erreursFormulaireDepense.fichierFacture && (
                  <small className="champ-formulaire__erreur">{erreursFormulaireDepense.fichierFacture}</small>
                )}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ActionsFormulaire
                surAnnuler={fermerModaleDepense}
                texteBoutonPrincipal="Ajouter"
                texteChargement="Ajout..."
                enCours={enCoursCreationDepense}
              />
            </div>
          </Formulaire>
        </Modale>
      )}

      {/* Modales de confirmation */}
      <ModaleConfirmation
        ouverte={confirmationSuppressionTravail.ouverte}
        titre="Supprimer le travail"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmationSuppressionTravail.travail?.intitule}" ?`}
        surConfirmer={confirmerSuppressionTravail}
        surAnnuler={() => setConfirmationSuppressionTravail({ ouverte: false, travail: null })}
        enCours={enCoursSuppressionTravail}
        type="danger"
        texteConfirmer="Supprimer"
      />

      <ModaleConfirmation
        ouverte={confirmationSuppressionDepense.ouverte}
        titre="Supprimer la dépense"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmationSuppressionDepense.depense?.intitule}" ?`}
        surConfirmer={confirmerSuppressionDepense}
        surAnnuler={() => setConfirmationSuppressionDepense({ ouverte: false, depense: null })}
        enCours={enCoursSuppressionDepense}
        type="danger"
        texteConfirmer="Supprimer"
      />
    </div>
  );
}
