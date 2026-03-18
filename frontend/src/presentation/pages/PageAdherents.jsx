/**
 * Page — Gestion des Adhérents
 */

import { useState } from 'react';
import { Plus, Search, Filter, User, Phone, Mail, MapPin, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { utiliserAdherents } from '../../application/hooks/utiliserAdherents';
import { lireIdGroupeCooperativeActif } from '../../application/utils/groupeCooperativeActif';
import FormulaireAdherent from '../composants/cooperative/FormulaireAdherent';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import { useToast } from '../composants/communs/ToastContext';
import SelecteurGroupeCooperative from '../composants/cooperative/SelecteurGroupeCooperative';
import './PageAdherents.css';

export default function PageAdherents() {
  const [idGroupe, setIdGroupe] = useState(() => lireIdGroupeCooperativeActif());
  const [filtres, setFiltres] = useState({ statut: '', recherche: '' });
  const [modalOuverte, setModalOuverte] = useState(false);
  const [parcelleEnEdition, setParcelleEnEdition] = useState(null);
  const [adherentEnEdition, setAdherentEnEdition] = useState(null);
  const [adherentSelectionne, setAdherentSelectionne] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const [modalSuppressionOuverte, setModalSuppressionOuverte] = useState(false);
  const { notifier } = useToast();

  const {
    adherents,
    chargement,
    erreur,
    creer,
    modifier,
    supprimer,
    enCoursCreation,
    enCoursModification,
  } = utiliserAdherents({ ...filtres, id_groupe: idGroupe || null });

  const gererChangementFiltre = (champ, valeur) => {
    setFiltres((prev) => ({ ...prev, [champ]: valeur }));
  };

  const ouvrirModalCreation = () => {
    setAdherentEnEdition(null);
    setModalOuverte(true);
  };

  const ouvrirModalModification = (adherent) => {
    setAdherentEnEdition(adherent);
    setModalOuverte(true);
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setAdherentEnEdition(null);
  };

  const gererSoumission = async (donnees) => {
    try {
      if (adherentEnEdition) {
        await modifier({ id: adherentEnEdition.id, donnees: { ...donnees, id_groupe: idGroupe || null } });
        notifier('Adhérent modifié avec succès');
      } else {
        await creer({ ...donnees, id_groupe: idGroupe || null });
        notifier('Adhérent créé avec succès');
      }
      fermerModal();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
    }
  };

  const confirmerSuppression = async () => {
    try {
      await supprimer(adherentSelectionne.id);
      notifier('Adhérent supprimé avec succès');
      setModalSuppressionOuverte(false);
      setAdherentSelectionne(null);
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const obtenirBadgeStatut = (statut) => {
    const badges = {
      actif: { classe: 'badge--succes', texte: 'Actif' },
      suspendu: { classe: 'badge--avertissement', texte: 'Suspendu' },
      radie: { classe: 'badge--danger', texte: 'Radié' },
    };
    return badges[statut] || badges.actif;
  };

  return (
    <div className="page-adherents">
      {/* En-tête */}
      <div className="page-adherents__entete">
        <div>
          <h1 className="page-adherents__titre">Adhérents</h1>
          <p className="page-adherents__description">
            Gestion des membres de la coopérative
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
          Nouvel adhérent
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="page-adherents__barre-recherche">
        <div className="champ-recherche">
          <Search size={20} className="champ-recherche__icone" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou numéro..."
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
        <div className="page-adherents__filtres">
          <div className="champ-formulaire">
            <label className="champ-formulaire__label">Statut</label>
            <select
              value={filtres.statut}
              onChange={(e) => gererChangementFiltre('statut', e.target.value)}
              className="champ-formulaire__select"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="suspendu">Suspendu</option>
              <option value="radie">Radié</option>
            </select>
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="page-adherents__contenu">
        {chargement && (
          <div className="page-adherents__chargement">
            <Loader2 size={24} className="chargement__spinner" />
            <p>Chargement des adhérents...</p>
          </div>
        )}

        {erreur && (
          <div className="page-adherents__erreur">
            <p>Erreur lors du chargement des adhérents</p>
          </div>
        )}

        {!chargement && !erreur && adherents.length === 0 && (
          <div className="page-adherents__vide">
            <p>Aucun adhérent trouvé</p>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
              <Plus size={20} />
              Créer le premier adhérent
            </button>
          </div>
        )}

        {!chargement && !erreur && adherents.length > 0 && (
          <div className="page-adherents__grille">
            {adherents.map((adherent) => {
              const badge = obtenirBadgeStatut(adherent.statut);
              return (
                <div key={adherent.id} className="carte-adherent">
                  <div className="carte-adherent__entete">
                    <div className="carte-adherent__avatar">
                      <User size={24} />
                    </div>
                    <div className="carte-adherent__info">
                      <h3 className="carte-adherent__nom">
                        {adherent.prenom} {adherent.nom}
                      </h3>
                      <p className="carte-adherent__numero">{adherent.numero}</p>
                    </div>
                    <span className={`badge ${badge.classe}`}>{badge.texte}</span>
                  </div>

                  <div className="carte-adherent__corps">
                    <div className="carte-adherent__detail">
                      <Phone size={16} />
                      <span>{adherent.telephone}</span>
                    </div>
                    {adherent.email && (
                      <div className="carte-adherent__detail">
                        <Mail size={16} />
                        <span>{adherent.email}</span>
                      </div>
                    )}
                    {adherent.adresse && (
                      <div className="carte-adherent__detail">
                        <MapPin size={16} />
                        <span>{adherent.adresse}</span>
                      </div>
                    )}
                    <div className="carte-adherent__detail">
                      <Calendar size={16} />
                      <span>Adhésion: {new Date(adherent.date_adhesion).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {adherent.echeances_en_retard > 0 && (
                      <div className="carte-adherent__detail carte-adherent__detail--alerte">
                        <AlertCircle size={16} />
                        <span>{adherent.echeances_en_retard} échéance(s) en retard</span>
                      </div>
                    )}
                  </div>

                  <div className="carte-adherent__actions">
                    <button
                      className="bouton bouton--secondaire bouton--petit"
                      onClick={() => ouvrirModalModification(adherent)}
                    >
                      Modifier
                    </button>
                    <button
                      className="bouton bouton--danger bouton--petit"
                      onClick={() => {
                        setAdherentSelectionne(adherent);
                        setModalSuppressionOuverte(true);
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {modalOuverte && (
        <FormulaireAdherent
          adherent={adherentEnEdition}
          surSoumettre={gererSoumission}
          surAnnuler={fermerModal}
          enCours={enCoursCreation || enCoursModification}
        />
      )}

      {/* Modale Confirmation Suppression */}
      <ModaleConfirmation
        ouverte={modalSuppressionOuverte}
        titre="Supprimer l'adhérent"
        message={`Voulez-vous vraiment supprimer l'adhérent ${adherentSelectionne?.prenom} ${adherentSelectionne?.nom} ? Cette action supprimera également ses données liées.`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => {
          setModalSuppressionOuverte(false);
          setAdherentSelectionne(null);
        }}
      />
    </div>
  );
}
