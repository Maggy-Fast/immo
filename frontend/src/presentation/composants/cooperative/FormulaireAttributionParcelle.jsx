/**
 * Composant — Formulaire Attribution Parcelle - Design Moderne
 */

import { useState, useMemo } from 'react';
import { User, AlertCircle, CheckCircle, MapPin, Maximize, DollarSign, Plus, Trash2, Loader2, Users } from 'lucide-react';
import { utiliserAdherents } from '../../../application/hooks/utiliserAdherents';
import { utiliserGroupesCooperative } from '../../../application/hooks/utiliserGroupesCooperative';
import { serviceAdherent } from '../../../infrastructure/api/serviceAdherent';
import Modal from '../communs/Modal';
import ChampFormulaire from '../communs/ChampFormulaire';
import { useToast } from '../communs/ToastContext';
import { formaterMontant } from '../../../application/utils/formatters';
import './FormulaireAttributionParcelle.css';

export default function FormulaireAttributionParcelle({ parcelle, surSoumettre, surAnnuler, enCours }) {
  const [typeAcquisition, setTypeAcquisition] = useState(parcelle?.id_groupe ? 'groupe' : 'individuel');
  const [attributions, setAttributions] = useState([{ idAdherent: '', pourcentage: 100 }]);
  const [idGroupe, setIdGroupe] = useState(parcelle?.id_groupe || '');
  const [eligibilites, setEligibilites] = useState({});
  const [chargementEligibilite, setChargementEligibilite] = useState({});
  const { notifier } = useToast();

  // Charger les adhérents actifs
  const { adherents = [], chargement: chargementAdherents } = utiliserAdherents({ statut: 'actif' });
  const { groupes = [] } = utiliserGroupesCooperative();

  const optionsGroupes = useMemo(() => [
    { valeur: '', label: 'Sélectionner un groupe' },
    ...groupes.map(g => ({ valeur: String(g.id), label: g.nom }))
  ], [groupes]);

  const verifierEligibilite = async (id, index) => {
    if (!id) return;
    setChargementEligibilite(prev => ({ ...prev, [index]: true }));
    try {
      const result = await serviceAdherent.verifierEligibilite(id);
      setEligibilites(prev => ({ ...prev, [index]: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setChargementEligibilite(prev => ({ ...prev, [index]: false }));
    }
  };

  const ajouterProprietaire = () => {
    setAttributions([...attributions, { idAdherent: '', pourcentage: 0 }]);
  };

  const supprimerProprietaire = (index) => {
    const nouvelles = attributions.filter((_, i) => i !== index);
    setAttributions(nouvelles);

    const nouvellesElig = { ...eligibilites };
    delete nouvellesElig[index];
    setEligibilites(nouvellesElig);
  };

  const gererChangement = (index, champ, valeur) => {
    const nouvelles = [...attributions];
    nouvelles[index][champ] = valeur;
    setAttributions(nouvelles);

    if (champ === 'idAdherent') {
      verifierEligibilite(valeur, index);
    }
  };

  const gererSoumission = (e) => {
    e.preventDefault();

    if (typeAcquisition === 'individuel') {
      const total = attributions.reduce((sum, a) => sum + parseFloat(a.pourcentage || 0), 0);
      if (total !== 100) {
        notifier(`Le total des pourcentages doit être égal à 100% (actuel: ${total}%)`, 'error');
        return;
      }

      const ineligibles = attributions.some((_, index) => eligibilites[index]?.eligible === false);
      if (ineligibles) {
        notifier('Certains adhérents ne sont pas éligibles.', 'error');
        return;
      }

      surSoumettre({
        id_groupe: null, // Signale une création auto de groupe au backend
        attributions: attributions.map(a => ({
          id_adherent: parseInt(a.idAdherent),
          pourcentage: parseFloat(a.pourcentage)
        }))
      });
    } else {
      if (!idGroupe) {
        notifier('Veuillez sélectionner un groupe.', 'error');
        return;
      }
      surSoumettre({
        id_groupe: parseInt(idGroupe, 10),
        attributions: [] // Signale une attribution par groupe existant
      });
    }
  };

  // Préparer les options pour le select
  const optionsAdherents = [
    { valeur: '', label: 'Sélectionner un adhérent' },
    ...adherents.map((adherent) => ({
      valeur: adherent.id.toString(),
      label: `${adherent.numero} - ${adherent.prenom} ${adherent.nom}`,
    })),
  ];

  return (
    <Modal
      titre="Attribuer une parcelle"
      surFermer={surAnnuler}
      taille="moyen"
    >
      <form onSubmit={gererSoumission} className="formulaire-attribution">
        {/* Informations parcelle */}
        <div className="formulaire-attribution__info-parcelle">
          <h3 className="formulaire-attribution__sous-titre">
            <MapPin size={18} />
            Informations de la parcelle
          </h3>
          <div className="formulaire-attribution__details">
            <div className="detail-item">
              <span className="detail-item__label">Numéro</span>
              <span className="detail-item__valeur">{parcelle?.numero}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Surface</span>
              <span className="detail-item__valeur">
                <Maximize size={14} />
                {parcelle?.surface} m²
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-item__label">Prix</span>
              <span className="detail-item__valeur detail-item__valeur--prix">
                <DollarSign size={14} />
                {parcelle?.prix && formaterMontant(parcelle.prix)}
              </span>
            </div>
          </div>
        </div>

        {/* Choix du type d'acquisition */}
        <div className="formulaire-attribution__choix-type">
          <label className="formulaire-attribution__label-principal">Type d'acquisition</label>
          <div className="acquisition-toggle">
            <button
              type="button"
              className={`acquisition-toggle__btn ${typeAcquisition === 'groupe' ? 'active' : ''}`}
              onClick={() => setTypeAcquisition('groupe')}
            >
              <Users size={16} />
              Groupe existant
            </button>
            <button
              type="button"
              className={`acquisition-toggle__btn ${typeAcquisition === 'individuel' ? 'active' : ''}`}
              onClick={() => setTypeAcquisition('individuel')}
            >
              <User size={16} />
              Individuels (Nouveau groupe)
            </button>
          </div>
        </div>

        {/* Sélection du groupe (Mode Groupe) */}
        {typeAcquisition === 'groupe' && (
          <div className="formulaire-attribution__groupe">
            <ChampFormulaire
              label="Sélectionner le groupe"
              type="select"
              valeur={idGroupe}
              onChange={setIdGroupe}
              options={optionsGroupes}
              icone={Users}
              aide="La parcelle sera rattachée à ce groupe"
              className="formulaire-attribution__champ-groupe"
            />
          </div>
        )}

        {/* Sélection des adhérents (Mode Individuel) */}
        {typeAcquisition === 'individuel' && (
          <div className="formulaire-attribution__selection">
            <div className="formulaire-attribution__header-section">
              <h3 className="formulaire-attribution__sous-titre">
                <User size={18} />
                Acquéreurs Individuels
                <small className="aide-texte">Un groupe sera créé automatiquement</small>
              </h3>
              <button
                type="button"
                className="bouton bouton--secondaire bouton--petit"
                onClick={ajouterProprietaire}
              >
                <Plus size={16} />
                Ajouter un acquéreur
              </button>
            </div>

            {chargementAdherents ? (
              <div className="formulaire-attribution__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des adhérents...</p>
              </div>
            ) : (
              <div className="formulaire-attribution__liste-acqueurs">
                {attributions.map((attr, index) => (
                  <div key={index} className="acqueur-row">
                    <div className="acqueur-row__principal">
                      <ChampFormulaire
                        label={`Acquéreur ${index + 1}`}
                        type="select"
                        valeur={attr.idAdherent}
                        onChange={(val) => gererChangement(index, 'idAdherent', val)}
                        options={optionsAdherents}
                        required
                        className="acqueur-row__select"
                      />
                      <ChampFormulaire
                        label="Part (%)"
                        type="number"
                        valeur={attr.pourcentage}
                        onChange={(val) => gererChangement(index, 'pourcentage', val)}
                        required
                        min="1"
                        max="100"
                        className="acqueur-row__pourcentage"
                      />
                      {attributions.length > 1 && (
                        <button
                          type="button"
                          className="bouton-supprimer-acqueur"
                          onClick={() => supprimerProprietaire(index)}
                          title="Supprimer cet acquéreur"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>

                    {/* Éligibilité pour cette ligne */}
                    {attr.idAdherent && (
                      <div className="acqueur-row__status">
                        {chargementEligibilite[index] ? (
                          <span className="chargement-icon">Vérification...</span>
                        ) : eligibilites[index] ? (
                          eligibilites[index].eligible ? (
                            <span className="text-succes"><CheckCircle size={14} /> Éligible</span>
                          ) : (
                            <span className="text-danger" title={eligibilites[index].raisons?.join(', ')}>
                              <AlertCircle size={14} /> Non éligible
                            </span>
                          )
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="formulaire-attribution__total">
              <span>Total : {attributions.reduce((sum, a) => sum + parseFloat(a.pourcentage || 0), 0)}%</span>
            </div>
          </div>
        )}

        <div className="formulaire-attribution__actions">
          <button
            type="button"
            className="bouton bouton--secondaire"
            onClick={surAnnuler}
            disabled={enCours}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bouton bouton--primaire"
            disabled={enCours || (typeAcquisition === 'individuel' && attributions.some(a => !a.idAdherent)) || (typeAcquisition === 'groupe' && !idGroupe)}
          >
            {enCours ? 'Traitement en cours...' : 'Attribuer la parcelle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
