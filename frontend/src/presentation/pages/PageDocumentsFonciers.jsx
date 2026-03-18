import { useMemo, useState } from 'react';
import { Plus, Search, FileText, Download, Trash2, Filter, Loader2, Eye } from 'lucide-react';
import { utiliserDocumentsFonciers } from '../../application/hooks/utiliserDocumentsFonciers';
import { utiliserBiens } from '../../application/hooks/utiliserBiens';
import { serviceDocumentsFonciers } from '../../infrastructure/api/serviceDocumentsFonciers';
import { Modale, Formulaire, ChampFormulaire, ActionsFormulaire, ModaleConfirmation } from '../composants/communs';
import { useToast } from '../composants/communs';
import './PageDocumentsFonciers.css';

const TYPES_DOCUMENTS = [
  { valeur: '', label: 'Tous les types' },
  { valeur: 'titre_foncier', label: 'Titre foncier' },
  { valeur: 'plan', label: 'Plan' },
  { valeur: 'attestation', label: 'Attestation' },
  { valeur: 'autre', label: 'Autre' },
];

function obtenirNomFichierDepuisUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname.split('/').pop() || 'document.pdf';
  } catch {
    return 'document.pdf';
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

export default function PageDocumentsFonciers() {
  const { notifier } = useToast();
  const [filtres, setFiltres] = useState({
    recherche: '',
    type: '',
    idBien: '',
  });

  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [confirmationSuppression, setConfirmationSuppression] = useState({ ouverte: false, document: null });

  const {
    documents,
    chargement,
    erreur,
    creer,
    supprimer,
    enCoursCreation,
    enCoursSuppression,
  } = utiliserDocumentsFonciers(filtres);

  const { biens } = utiliserBiens({});

  const optionsBiens = useMemo(() => {
    return [
      { valeur: '', label: 'Tous les biens' },
      ...biens.map((b) => ({ valeur: String(b.id), label: b.adresse || `Bien #${b.id}` })),
    ];
  }, [biens]);

  const [formulaire, setFormulaire] = useState({
    idBien: '',
    titre: '',
    type: 'titre_foncier',
    fichier: null,
  });

  const [erreursFormulaire, setErreursFormulaire] = useState({});

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const reinitialiserFiltres = () => {
    setFiltres({ recherche: '', type: '', idBien: '' });
  };

  const ouvrirModale = () => {
    setErreursFormulaire({});
    setFormulaire({ idBien: '', titre: '', type: 'titre_foncier', fichier: null });
    setModaleOuverte(true);
  };

  const fermerModale = () => {
    if (enCoursCreation) return;
    setModaleOuverte(false);
  };

  const validerFormulaire = () => {
    const errs = {};
    if (!formulaire.idBien) errs.idBien = 'Le bien est requis';
    if (!formulaire.titre) errs.titre = 'Le titre est requis';
    if (!formulaire.type) errs.type = 'Le type est requis';
    if (!formulaire.fichier) errs.fichier = 'Le fichier est requis';

    setErreursFormulaire(errs);
    return Object.keys(errs).length === 0;
  };

  const soumettre = async () => {
    if (!validerFormulaire()) return;

    try {
      await creer({
        idBien: formulaire.idBien,
        titre: formulaire.titre,
        type: formulaire.type,
        fichier: formulaire.fichier,
      });
      setModaleOuverte(false);
    } catch (erreur) {
      const message = await extraireMessageErreurDepuisAxios(erreur);
      notifier(message || "Erreur lors de l'ajout du document", 'error');
    }
  };

  const demanderSuppression = (document) => {
    setConfirmationSuppression({ ouverte: true, document });
  };

  const confirmerSuppression = async () => {
    const doc = confirmationSuppression.document;
    if (!doc) return;
    await supprimer(doc.id);
    setConfirmationSuppression({ ouverte: false, document: null });
  };

  const apercuDocument = async (doc) => {
    if (!doc?.id) return;
    
    try {
      const reponse = await serviceDocumentsFonciers.telecharger(doc.id);
      const contentType = (reponse?.headers?.['content-type'] || '').toString().toLowerCase();

      if (!contentType.includes('application/pdf')) {
        notifier("Ce document n'est pas un PDF valide", 'error');
        return;
      }

      const blob = reponse.data;
      const url = window.URL.createObjectURL(blob);
      
      // Ouvrir le PDF dans une nouvelle fenêtre pour aperçu
      const nouvelleFenetre = window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
      
      if (!nouvelleFenetre) {
        // Si le popup est bloqué, proposer le téléchargement
        notifier("Le popup a été bloqué. Utilisez le bouton de téléchargement.", 'warning');
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        // Nettoyer l'URL après fermeture de la fenêtre
        const verifierFermeture = setInterval(() => {
          if (nouvelleFenetre.closed) {
            clearInterval(verifierFermeture);
            window.URL.revokeObjectURL(url);
          }
        }, 1000);
      }
    } catch (erreur) {
      notifier("Erreur lors de l'aperçu du document", 'error');
    }
  };

  const telecharger = (doc) => {
    if (!doc?.id) return;
    serviceDocumentsFonciers
      .telecharger(doc.id)
      .then(async (reponse) => {
        const contentType = (reponse?.headers?.['content-type'] || '').toString().toLowerCase();

        if (!contentType.includes('application/pdf')) {
          try {
            const texte = await reponse.data?.text?.();
            notifier(texte || "Le serveur n'a pas renvoyé un PDF.", 'error');
          } catch {
            notifier("Le serveur n'a pas renvoyé un PDF.", 'error');
          }
          return;
        }

        const blob = reponse.data;
        const url = window.URL.createObjectURL(blob);

        const nom = `${(doc.titre || 'document-foncier').toString().trim() || 'document-foncier'}.pdf`;

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
        notifier(message || 'Erreur lors du téléchargement du document', 'error');
      });
  };

  const filtresActifs = Object.values(filtres).some((v) => v !== '');

  return (
    <div className="page-documents-fonciers">
      <div className="page-documents-fonciers__entete">
        <div>
          <h1 className="page-documents-fonciers__titre">Documents Fonciers</h1>
          <p className="page-documents-fonciers__description">
            Centralisez et sécurisez les documents liés à vos biens (PDF)
          </p>
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModale}>
          <Plus size={20} />
          Nouveau document
        </button>
      </div>

      <div className="page-documents-fonciers__barre">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher par titre ou type..."
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
              {Object.values(filtres).filter((v) => v !== '').length}
            </span>
          )}
        </button>
      </div>

      {afficherFiltres && (
        <div className="page-documents-fonciers__filtres">
          <div className="page-documents-fonciers__filtres-grille">
            <div className="champ-formulaire">
              <label className="champ-formulaire__label">Bien</label>
              <select
                value={filtres.idBien}
                onChange={(e) => gererChangementFiltre('idBien', e.target.value)}
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
                value={filtres.type}
                onChange={(e) => gererChangementFiltre('type', e.target.value)}
                className="champ-formulaire__select"
              >
                {TYPES_DOCUMENTS.map((opt) => (
                  <option key={opt.valeur} value={opt.valeur}>
                    {opt.label}
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

      <div className="page-documents-fonciers__contenu">
        {chargement && (
          <div className="page-documents-fonciers__chargement">
            <Loader2 size={24} className="chargement__spinner" />
            <p>Chargement des documents...</p>
          </div>
        )}

        {erreur && (
          <div className="page-documents-fonciers__erreur">
            <p>Une erreur est survenue lors du chargement des documents.</p>
            <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
              Réessayer
            </button>
          </div>
        )}

        {!chargement && !erreur && documents.length === 0 && (
          <div className="page-documents-fonciers__vide">
            <div className="page-documents-fonciers__vide-icone">
              <FileText size={48} />
            </div>
            <p>Aucun document trouvé.</p>
            <button className="bouton bouton--primaire" onClick={ouvrirModale}>
              <Plus size={20} />
              Ajouter votre premier document
            </button>
          </div>
        )}

        {!chargement && !erreur && documents.length > 0 && (
          <div className="page-documents-fonciers__liste">
            {documents.map((doc) => (
              <div key={doc.id} className="document-foncier">
                <div className="document-foncier__icone">
                  <FileText size={22} />
                </div>

                <div className="document-foncier__infos">
                  <div className="document-foncier__titre">{doc.titre}</div>
                  <div className="document-foncier__meta">
                    <span className="document-foncier__badge">{doc.type}</span>
                    {doc?.bien?.adresse && <span className="document-foncier__bien">{doc.bien.adresse}</span>}
                  </div>
                </div>

                <div className="document-foncier__actions">
                  <button
                    className="bouton bouton--primaire bouton--petit"
                    onClick={() => apercuDocument(doc)}
                    disabled={!doc.url}
                    title="Aperçu"
                    type="button"
                  >
                    <Eye size={16} />
                    Aperçu
                  </button>

                  <button
                    className="bouton bouton--secondaire bouton--petit"
                    onClick={() => telecharger(doc)}
                    disabled={!doc.url}
                    title="Télécharger"
                    type="button"
                  >
                    <Download size={16} />
                    Télécharger
                  </button>

                  <button
                    className="bouton bouton--danger bouton--petit"
                    onClick={() => demanderSuppression(doc)}
                    disabled={enCoursSuppression}
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

      {modaleOuverte && (
        <Modale
          titre="Nouveau document foncier (PDF)"
          surFermer={fermerModale}
          taille="grand"
          enCours={enCoursCreation}
        >
          <Formulaire surSoumettre={soumettre} colonnes={2}>
            <ChampFormulaire
              label="Bien"
              type="select"
              valeur={formulaire.idBien}
              onChange={(val) => setFormulaire((p) => ({ ...p, idBien: val }))}
              options={optionsBiens.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaire.idBien}
              required
            />

            <ChampFormulaire
              label="Type"
              type="select"
              valeur={formulaire.type}
              onChange={(val) => setFormulaire((p) => ({ ...p, type: val }))}
              options={TYPES_DOCUMENTS.filter((o) => o.valeur !== '')}
              erreur={erreursFormulaire.type}
              required
            />

            <ChampFormulaire
              label="Titre"
              type="text"
              valeur={formulaire.titre}
              onChange={(val) => setFormulaire((p) => ({ ...p, titre: val }))}
              placeholder="Ex: Titre foncier - Parcelle A"
              erreur={erreursFormulaire.titre}
              required
              largeurComplete
            />

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="champ-formulaire">
                <label className="champ-formulaire__label">Fichier</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setFormulaire((p) => ({ ...p, fichier: e.target.files?.[0] || null }))}
                  className={`champ-formulaire__input ${erreursFormulaire.fichier ? 'champ-formulaire__input--erreur' : ''}`}
                  required
                  disabled={enCoursCreation}
                />
                {erreursFormulaire.fichier && (
                  <small className="champ-formulaire__erreur">{erreursFormulaire.fichier}</small>
                )}
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <ActionsFormulaire
                surAnnuler={fermerModale}
                texteBoutonPrincipal="Ajouter"
                texteChargement="Ajout..."
                enCours={enCoursCreation}
              />
            </div>
          </Formulaire>
        </Modale>
      )}

      <ModaleConfirmation
        ouverte={confirmationSuppression.ouverte}
        titre="Supprimer le document"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmationSuppression.document?.titre}" ?`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => setConfirmationSuppression({ ouverte: false, document: null })}
        enCours={enCoursSuppression}
        type="danger"
        texteConfirmer="Supprimer"
      />
    </div>
  );
}
