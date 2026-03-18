/**
 * Page — Gestion des Parcelles Coopérative
 */

import { useState } from 'react';
import { Plus, Search, Filter, MapPin, Maximize, DollarSign, User, Calendar, Loader2 } from 'lucide-react';
import { utiliserParcellesCooperative } from '../../application/hooks/utiliserParcellesCooperative';
import { lireIdGroupeCooperativeActif } from '../../application/utils/groupeCooperativeActif';
import FormulaireParcelleCooperative from '../composants/cooperative/FormulaireParcelleCooperative';
import FormulaireAttributionParcelle from '../composants/cooperative/FormulaireAttributionParcelle';
import FormulaireRetraitAttribution from '../composants/cooperative/FormulaireRetraitAttribution';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import Modale from '../composants/communs/Modal';
import ModaleDetailsParcelleCooperative from '../composants/cooperative/ModaleDetailsParcelleCooperative';
import ChampFormulaire from '../composants/communs/ChampFormulaire';
import SelecteurGroupeCooperative from '../composants/cooperative/SelecteurGroupeCooperative';
import { useToast } from '../composants/communs/ToastContext';
import { formaterMontant } from '../../application/utils/formatters';
import './PageParcellesCooperative.css';

export default function PageParcellesCooperative() {
  const [idGroupe, setIdGroupe] = useState(() => lireIdGroupeCooperativeActif());
  const [filtres, setFiltres] = useState({ statut: '', recherche: '' });
  const [modalParcelleOuverte, setModalParcelleOuverte] = useState(false);
  const [modalAttributionOuverte, setModalAttributionOuverte] = useState(false);
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [parcelleEnEdition, setParcelleEnEdition] = useState(null);
  const [parcelleSelectionnee, setParcelleSelectionnee] = useState(null);
  const [parcelleEnConsultation, setParcelleEnConsultation] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const { notifier } = useToast();

  // États pour les modales de confirmation et motif
  const [modalSuppressionOuverte, setModalSuppressionOuverte] = useState(false);
  const [modalRetraitOuverte, setModalRetraitOuverte] = useState(false);
  const [motifRetrait, setMotifRetrait] = useState('');

  const {
    parcelles,
    statistiques,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    attribuer,
    retirer,
    enCoursCreation,
    enCoursModification,
    enCoursAttribution,
    enCoursSuppression,
    enCoursRetrait,
  } = utiliserParcellesCooperative({ ...filtres, id_groupe: idGroupe || null });

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const ouvrirModalCreation = () => {
    setParcelleEnEdition(null);
    setModalParcelleOuverte(true);
  };

  const ouvrirModalModification = (parcelle) => {
    setParcelleEnEdition(parcelle);
    setModalParcelleOuverte(true);
  };

  const fermerModalParcelle = () => {
    setModalParcelleOuverte(false);
    setParcelleEnEdition(null);
  };

  const ouvrirModalAttribution = (parcelle) => {
    setParcelleSelectionnee(parcelle);
    setModalAttributionOuverte(true);
  };

  const fermerModalAttribution = () => {
    setModalAttributionOuverte(false);
    setParcelleSelectionnee(null);
  };

  const ouvrirModalDetails = (parcelle) => {
    setParcelleEnConsultation(parcelle);
    setModalDetailsOuverte(true);
  };

  const fermerModalDetails = () => {
    setModalDetailsOuverte(false);
    setParcelleEnConsultation(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (parcelleEnEdition) {
        await modifier({ id: parcelleEnEdition.id, formData: donnees });
        notifier('Parcelle modifiée avec succès');
      } else {
        await creer(donnees);
        notifier('Parcelle créée avec succès');
      }
      fermerModalParcelle();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
    }
  };

  const gererAttribution = async (donnees) => {
    try {
      await attribuer({ id: parcelleSelectionnee.id, donnees });
      notifier('Parcelle attribuée avec succès');
      fermerModalAttribution();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de l\'attribution', 'error');
    }
  };

  const gererRetrait = async (donnees) => {
    try {
      await retirer({ id: parcelleSelectionnee.id, motif: donnees.motif });
      notifier('Attribution retirée avec succès');
      setModalRetraitOuverte(false);
      setParcelleSelectionnee(null);
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors du retrait', 'error');
    }
  };

  const confirmerSuppression = async () => {
    try {
      await supprimer(parcelleSelectionnee.id);
      notifier('Parcelle supprimée avec succès');
      setModalSuppressionOuverte(false);
      setParcelleSelectionnee(null);
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const obtenirBadgeStatut = (statut) => {
    const badges = {
      disponible: { classe: 'badge--succes', texte: 'Disponible' },
      attribuee: { classe: 'badge--info', texte: 'Attribuée' },
      vendue: { classe: 'badge--secondaire', texte: 'Vendue' },
    };
    return badges[statut] || badges.disponible;
  };

  return (
    <div className="page-parcelles-cooperative">
      {/* En-tête */}
      <div className="page-parcelles-cooperative__entete">
        <div>
          <h1 className="page-parcelles-cooperative__titre">Parcelles Coopérative</h1>
          <p className="page-parcelles-cooperative__description">
            Gestion des parcelles et attributions
          </p>
        </div>
        <div style={{ minWidth: 260 }}>
          <SelecteurGroupeCooperative
            valeur={idGroupe ? String(idGroupe) : ''}
            surChangement={(v) => setIdGroupe(v ? parseInt(v, 10) : null)}
          />
        </div>
        <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
          <Plus size={20} />
          Nouvelle parcelle
        </button>
      </div>

      {/* Statistiques */}
      {statistiques && (
        <div className="page-parcelles-cooperative__stats">
          <div className="carte-stat carte-stat--bleu">
            <div className="carte-stat__icone">
              <MapPin size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">Total Parcelles</p>
              <p className="carte-stat__valeur">{statistiques.total_parcelles || 0}</p>
            </div>
          </div>

          <div className="carte-stat carte-stat--vert">
            <div className="carte-stat__icone">
              <MapPin size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">Disponibles</p>
              <p className="carte-stat__valeur">{statistiques.disponibles || 0}</p>
            </div>
          </div>

          <div className="carte-stat carte-stat--violet">
            <div className="carte-stat__icone">
              <User size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">Attribuées</p>
              <p className="carte-stat__valeur">{statistiques.attribuees || 0}</p>
            </div>
          </div>

          <div className="carte-stat carte-stat--gris">
            <div className="carte-stat__icone">
              <MapPin size={24} />
            </div>
            <div className="carte-stat__contenu">
              <p className="carte-stat__label">Vendues</p>
              <p className="carte-stat__valeur">{statistiques.vendues || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="page-parcelles-cooperative__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher par numéro..."
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
        <div className="page-parcelles-cooperative__filtres">
          <div className="champ-formulaire">
            <label className="champ-formulaire__label">Statut</label>
            <select
              value={filtres.statut}
              onChange={(e) => gererChangementFiltre('statut', e.target.value)}
              className="champ-formulaire__select"
            >
              <option value="">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="attribuee">Attribuée</option>
              <option value="vendue">Vendue</option>
            </select>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="page-parcelles-cooperative__contenu">
        {chargement && (
          <div className="page-parcelles-cooperative__chargement">
            <Loader2 size={24} className="chargement__spinner" />
            <p>Chargement des parcelles...</p>
          </div>
        )}

        {erreur && (
          <div className="page-parcelles-cooperative__erreur">
            <p>Erreur lors du chargement des parcelles</p>
          </div>
        )}

        {!chargement && !erreur && parcelles.length === 0 && (
          <div className="page-parcelles-cooperative__vide">
            <p>Aucune parcelle trouvée</p>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
              <Plus size={20} />
              Créer la première parcelle
            </button>
          </div>
        )}

        {!chargement && !erreur && parcelles.length > 0 && (
          <div className="page-parcelles-cooperative__grille">
            {parcelles.map((parcelle) => {
              const badge = obtenirBadgeStatut(parcelle.statut);

              return (
                <div key={parcelle.id} className="carte-parcelle" onClick={() => ouvrirModalDetails(parcelle)}>
                  {/* Photo de la parcelle */}
                  {parcelle.photo ? (
                    <div className="carte-parcelle__photo" onClick={(e) => e.stopPropagation()}>
                      <img 
                        src={parcelle.photo} 
                        alt={`Photo de la parcelle ${parcelle.numero}`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = '#f8f9fa';
                        }}
                        onLoad={(e) => {
                          e.target.style.display = 'block';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="carte-parcelle__photo carte-parcelle__photo--placeholder">
                      <MapPin size={48} color="#6c757d" />
                      <span>Aucune photo</span>
                    </div>
                  )}
                  
                  <div className="carte-parcelle__entete">
                    <div className="carte-parcelle__numero">
                      <MapPin size={20} />
                      <span>{parcelle.numero}</span>
                    </div>
                    <span className={`badge ${badge.classe}`}>{badge.texte}</span>
                  </div>

                  <div className="carte-parcelle__corps">
                    <div className="carte-parcelle__detail">
                      <Maximize size={16} />
                      <span>{parcelle.surface} m²</span>
                    </div>
                    <div className="carte-parcelle__detail">
                      <DollarSign size={16} />
                      <span className="carte-parcelle__prix">
                        {formaterMontant(parcelle.prix)}
                      </span>
                    </div>
                    {parcelle.description && (
                      <p className="carte-parcelle__description">{parcelle.description}</p>
                    )}
                    {parcelle.adherents && parcelle.adherents.length > 0 ? (
                      <div className="carte-parcelle__adherent">
                        <User size={16} />
                        <div className="carte-parcelle__liste-adherents">
                          {parcelle.adherents.map((adh, idx) => (
                            <span key={`adherent-${adh.id}-${idx}`} className="badge-adherent">
                              {adh.prenom} {adh.nom}
                              <small>({Math.round(adh.pivot?.pourcentage_possession)}%)</small>
                              {idx < parcelle.adherents.length - 1 && ' • '}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : parcelle.adherent && (
                      <div className="carte-parcelle__adherent">
                        <User size={16} />
                        <span>
                          {parcelle.adherent.prenom} {parcelle.adherent.nom}
                        </span>
                      </div>
                    )}
                    {parcelle.date_attribution && (
                      <div className="carte-parcelle__detail">
                        <Calendar size={16} />
                        <span>
                          Attribuée le {new Date(parcelle.date_attribution).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="carte-parcelle__actions">
                    {parcelle.statut === 'disponible' && (
                      <button
                        className="bouton bouton--primaire bouton--petit"
                        onClick={(e) => {
                          e.stopPropagation();
                          ouvrirModalAttribution(parcelle);
                        }}
                      >
                        Attribuer
                      </button>
                    )}
                    {parcelle.statut === 'attribuee' && (
                      <button
                        className="bouton bouton--avertissement bouton--petit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setParcelleSelectionnee(parcelle);
                          setModalRetraitOuverte(true);
                        }}
                      >
                        Retirer
                      </button>
                    )}
                    <button
                      className="bouton bouton--secondaire bouton--petit"
                      onClick={(e) => {
                        e.stopPropagation();
                        ouvrirModalModification(parcelle);
                      }}
                    >
                      Modifier
                    </button>
                    {parcelle.statut === 'disponible' && (
                      <button
                        className="bouton bouton--danger bouton--petit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setParcelleSelectionnee(parcelle);
                          setModalSuppressionOuverte(true);
                        }}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal parcelle */}
      {modalParcelleOuverte && (
        <FormulaireParcelleCooperative
          parcelle={parcelleEnEdition}
          initialIdGroupe={idGroupe}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModalParcelle}
          enCours={enCoursCreation || enCoursModification}
        />
      )}

      {/* Modal attribution */}
      {modalAttributionOuverte && parcelleSelectionnee && (
        <FormulaireAttributionParcelle
          parcelle={parcelleSelectionnee}
          surSoumettre={gererAttribution}
          surAnnuler={fermerModalAttribution}
          enCours={enCoursAttribution}
        />
      )}

      {/* Modale Confirmation Suppression */}
      <ModaleConfirmation
        ouverte={modalSuppressionOuverte}
        titre="Supprimer la parcelle"
        message={`Voulez-vous vraiment supprimer la parcelle ${parcelleSelectionnee?.numero} ? Cette action est irréversible.`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => {
          setModalSuppressionOuverte(false);
          setParcelleSelectionnee(null);
        }}
        enCours={enCoursSuppression}
      />

      {/* Modal Retrait d'attribution */}
      {modalRetraitOuverte && parcelleSelectionnee && (
        <FormulaireRetraitAttribution
          parcelle={parcelleSelectionnee}
          surSoumettre={gererRetrait}
          surAnnuler={() => {
            setModalRetraitOuverte(false);
            setParcelleSelectionnee(null);
          }}
          enCours={enCoursRetrait}
        />
      )}

      {/* Modale de détails */}
      {modalDetailsOuverte && (
        <ModaleDetailsParcelleCooperative
          parcelle={parcelleEnConsultation}
          surFermer={fermerModalDetails}
          surModifier={ouvrirModalModification}
        />
      )}
    </div>
  );
}
