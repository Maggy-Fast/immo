/**
 * Page — Gestion des lotissements et parcelles
 */

import { useState } from 'react';
import { Plus, Search, ArrowLeft, Loader2 } from 'lucide-react';
import { utiliserLotissements } from '../../application/hooks/utiliserLotissements';
import { utiliserParcelles } from '../../application/hooks/utiliserParcelles';
import { utiliserPartenariats } from '../../application/hooks/utiliserPartenariats';
import { utiliserProprietaires } from '../../application/hooks/utiliserProprietaires';
import CarteLotissement from '../composants/lotissements/CarteLotissement';
import CarteParcelle from '../composants/parcelles/CarteParcelle';
import FormulaireLotissement from '../composants/lotissements/FormulaireLotissement';
import FormulaireParcelle from '../composants/parcelles/FormulaireParcelle';
import FormulairePartenariat from '../composants/partenariats/FormulairePartenariat';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import { useToast } from '../composants/communs/ToastContext';
import './PageLotissements.css';

export default function PageLotissements() {
  const [vue, setVue] = useState('lotissements'); // 'lotissements' ou 'parcelles'
  const [lotissementSelectionne, setLotissementSelectionne] = useState(null);

  const [filtres, setFiltres] = useState({
    recherche: '',
  });

  const [modalLotissementOuverte, setModalLotissementOuverte] = useState(false);
  const [lotissementEnEdition, setLotissementEnEdition] = useState(null);

  const [modalParcelleOuverte, setModalParcelleOuverte] = useState(false);
  const [parcelleEnEdition, setParcelleEnEdition] = useState(null);
  const [parcelleSelectionnee, setParcelleSelectionnee] = useState(null);

  const [modalPartenariatOuverte, setModalPartenariatOuverte] = useState(false);

  const [modalSuppressionLotissementOuverte, setModalSuppressionLotissementOuverte] = useState(false);
  const [modalSuppressionParcelleOuverte, setModalSuppressionParcelleOuverte] = useState(false);
  const { notifier } = useToast();

  const {
    lotissements,
    chargement: chargementLotissements,
    erreur: erreurLotissements,
    creer: creerLotissement,
    modifier: modifierLotissement,
    supprimer: supprimerLotissement,
    enCoursCreation: enCoursCreationLotissement,
    enCoursModification: enCoursModificationLotissement,
  } = utiliserLotissements(filtres);

  const {
    partenariats,
    loading: chargementPartenariats,
    calculerBeneficesParcellaires,
    creer: creerPartenariat,
    enCoursCreation: enCoursCreationPartenariat,
  } = utiliserPartenariats();

  const { proprietaires } = utiliserProprietaires();

  const filtresParcelles = lotissementSelectionne
    ? { idLotissement: lotissementSelectionne.id, partenariats: partenariats }
    : { partenariats: partenariats };

  const {
    parcelles,
    chargement: chargementParcelles,
    erreur: erreurParcelles,
    creer: creerParcelle,
    modifier: modifierParcelle,
    supprimer: supprimerParcelle,
    enCoursCreation: enCoursCreationParcelle,
    enCoursModification: enCoursModificationParcelle,
  } = utiliserParcelles(filtresParcelles);

  const gererChangementRecherche = (valeur) => {
    setFiltres((prev) => ({ ...prev, recherche: valeur }));
  };

  // Lotissements
  const ouvrirModalCreationLotissement = () => {
    setLotissementEnEdition(null);
    setModalLotissementOuverte(true);
  };

  const ouvrirModalModificationLotissement = (lotissement) => {
    setLotissementEnEdition(lotissement);
    setModalLotissementOuverte(true);
  };

  const fermerModalLotissement = () => {
    setModalLotissementOuverte(false);
    setLotissementEnEdition(null);
  };

  const gererSoumissionLotissement = async (donnees) => {
    try {
      if (lotissementEnEdition) {
        await modifierLotissement({ id: lotissementEnEdition.id, donnees });
        notifier('Lotissement modifié avec succès');
      } else {
        await creerLotissement(donnees);
        notifier('Lotissement créé avec succès');
      }
      fermerModalLotissement();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
    }
  };

  const confirmerSuppressionLotissement = async () => {
    try {
      await supprimerLotissement(lotissementSelectionne.id);
      notifier('Lotissement supprimé avec succès');
      setModalSuppressionLotissementOuverte(false);
      setLotissementSelectionne(null);
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  const voirParcelles = (lotissement) => {
    setLotissementSelectionne(lotissement);
    setVue('parcelles');
  };

  const retourLotissements = () => {
    setLotissementSelectionne(null);
    setVue('lotissements');
  };

  // Parcelles
  const ouvrirModalCreationParcelle = () => {
    setParcelleEnEdition(null);
    setModalParcelleOuverte(true);
  };

  const ouvrirModalModificationParcelle = (parcelle) => {
    setParcelleEnEdition(parcelle);
    setModalParcelleOuverte(true);
  };

  const fermerModalParcelle = () => {
    setModalParcelleOuverte(false);
    setParcelleEnEdition(null);
  };

  const gererSoumissionParcelle = async (donnees) => {
    try {
      if (parcelleEnEdition) {
        await modifierParcelle({ id: parcelleEnEdition.id, donnees });
        notifier('Parcelle modifiée avec succès');
      } else {
        await creerParcelle(donnees);
        notifier('Parcelle créée avec succès');
      }
      fermerModalParcelle();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de l\'enregistrement', 'error');
    }
  };

  const confirmerSuppressionParcelle = async () => {
    try {
      await supprimerParcelle(parcelleSelectionnee.id);
      notifier('Parcelle supprimée avec succès');
      setModalSuppressionParcelleOuverte(false);
      setParcelleSelectionnee(null);
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
    }
  };

  // Partenariats
  const ouvrirModalCreationPartenariat = () => {
    setModalPartenariatOuverte(true);
  };

  const fermerModalPartenariat = () => {
    setModalPartenariatOuverte(false);
  };

  const gererSoumissionPartenariat = async (donnees) => {
    try {
      // Re-formater les données pour correspondre à l'API (camelCase -> snake_case)
      const payload = {
        id_promoteur: donnees.idPromoteur,
        id_proprietaire: donnees.idProprietaire,
        id_lotissement: donnees.idLotissement,
        ticket_entree: donnees.ticketEntree,
        pourcentage_promoteur: donnees.pourcentagePromoteur,
        pourcentage_proprietaire: donnees.pourcentageProprietaire,
        statut: 'actif'
      };
      
      await creerPartenariat(payload);
      notifier('Partenariat créé avec succès');
      fermerModalPartenariat();
    } catch (error) {
      notifier(error.response?.data?.message || 'Erreur lors de la création du partenariat', 'error');
    }
  };

  return (
    <div className="page-lotissements">
      {/* Vue Lotissements */}
      {vue === 'lotissements' && (
        <>
          <div className="page-lotissements__entete">
            <div>
              <h1 className="page-lotissements__titre">Lotissements</h1>
              <p className="page-lotissements__description">
                Gérez vos lotissements et parcelles
              </p>
            </div>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreationLotissement}>
              <Plus size={20} />
              Nouveau lotissement
            </button>
          </div>

          <div className="page-lotissements__barre-recherche">
            <div className="champ-recherche">
              <Search size={20} className="champ-recherche__icone" />
              <input
                type="text"
                placeholder="Rechercher un lotissement..."
                value={filtres.recherche}
                onChange={(e) => gererChangementRecherche(e.target.value)}
                className="champ-recherche__input"
              />
            </div>
          </div>

          <div className="page-lotissements__contenu">
            {chargementLotissements && (
              <div className="page-lotissements__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des lotissements...</p>
              </div>
            )}

            {erreurLotissements && (
              <div className="page-lotissements__erreur">
                <p>Une erreur est survenue.</p>
                <button className="bouton bouton--secondaire" onClick={() => window.location.reload()}>
                  Réessayer
                </button>
              </div>
            )}

            {!chargementLotissements && !erreurLotissements && lotissements.length === 0 && (
              <div className="page-lotissements__vide">
                <p>Aucun lotissement trouvé.</p>
                <button className="bouton bouton--primaire" onClick={ouvrirModalCreationLotissement}>
                  <Plus size={20} />
                  Créer votre premier lotissement
                </button>
              </div>
            )}

            {!chargementLotissements && !erreurLotissements && lotissements.length > 0 && (
              <div className="page-lotissements__grille">
                {lotissements.map((lotissement) => {
                  // Récupérer les partenariats associés à ce lotissement
                  const partenariatsLotissement = partenariats.filter(p => p.id_lotissement === lotissement.id);
                  // Calculer les bénéfices parcellaires
                  const benefices = calculerBeneficesParcellaires(lotissement, partenariatsLotissement);
                  
                  return (
                    <CarteLotissement
                      key={lotissement.id}
                      lotissement={lotissement}
                      partenariats={partenariatsLotissement}
                      benefices={benefices}
                      surModifier={ouvrirModalModificationLotissement}
                      surSupprimer={(l) => {
                        setLotissementSelectionne(l);
                        setModalSuppressionLotissementOuverte(true);
                      }}
                      surVoirParcelles={voirParcelles}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Vue Parcelles */}
      {vue === 'parcelles' && lotissementSelectionne && (
        <>
          <div className="page-lotissements__entete">
            <div>
              <button className="bouton bouton--texte" onClick={retourLotissements}>
                <ArrowLeft size={18} />
                Retour aux lotissements
              </button>
              <h1 className="page-lotissements__titre">
                Parcelles - {lotissementSelectionne.nom}
              </h1>
              <p className="page-lotissements__description">
                {lotissementSelectionne.localisation}
              </p>
            </div>
            <button className="bouton bouton--primaire" onClick={ouvrirModalCreationParcelle}>
              <Plus size={20} />
              Nouvelle parcelle
            </button>
          </div>

          {/* Section Partenariats et Bénéfices */}
          {!chargementPartenariats && (
            <div className="page-lotissements__partenariats">
              <h2 className="page-lotissements__sous-titre">Partenariats et Bénéfices Parcellaires</h2>
              
              {(() => {
                const partenariatsLotissement = partenariats.filter(p => p.id_lotissement === lotissementSelectionne.id);
                const benefices = calculerBeneficesParcellaires(lotissementSelectionne, partenariatsLotissement);
                
                return (
                  <div className="partenariats-grid">
                    {partenariatsLotissement.length > 0 ? (
                      <>
                        {/* Carte résumé des bénéfices */}
                        <div className="carte-benefices">
                          <div className="carte-benefices__entete">
                            <h3>Répartition des Parcelles</h3>
                            <span className="carte-benefices__total">
                              {benefices.beneficePromoteur + benefices.beneficeProprietaire} / {benefices.totalParcelles} parcelles
                            </span>
                          </div>
                          <div className="carte-benefices__repartition">
                            <div className="repartition-item promoteur">
                              <div className="repartition-icone">🏗️</div>
                              <div className="repartition-info">
                                <span className="repartition-titre">Promoteur</span>
                                <span className="repartition-valeur">{benefices.beneficePromoteur} parcelles</span>
                              </div>
                            </div>
                            <div className="repartition-item proprietaire">
                              <div className="repartition-icone">👤</div>
                              <div className="repartition-info">
                                <span className="repartition-titre">Propriétaire</span>
                                <span className="repartition-valeur">{benefices.beneficeProprietaire} parcelles</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Liste des partenariats */}
                        {partenariatsLotissement.map((partenariat, index) => (
                          <div key={partenariat.id} className="carte-partenariat">
                            <div className="carte-partenariat__entete">
                              <h4>Partenariat #{index + 1}</h4>
                              <span className="carte-partenariat__statut actif">Actif</span>
                            </div>
                            <div className="carte-partenariat__details">
                              <div className="partenariat-detail">
                                <span className="partenariat-label">Ticket d'entrée:</span>
                                <span className="partenariat-valeur">
                                  {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'EUR'
                                  }).format(partenariat.ticket_entree || 0)}
                                </span>
                              </div>
                              <div className="partenariat-detail">
                                <span className="partenariat-label">Promoteur:</span>
                                <span className="partenariat-valeur">{partenariat.pourcentage_promoteur}%</span>
                              </div>
                              <div className="partenariat-detail">
                                <span className="partenariat-label">Propriétaire:</span>
                                <span className="partenariat-valeur">{partenariat.pourcentage_proprietaire}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="aucun-partenariat">
                        <div className="aucun-partenariat__icone">🤝</div>
                        <h3>Aucun partenariat</h3>
                        <p>Ce lotissement n'a pas encore de partenariat enregistré.</p>
                        <button className="bouton bouton--primaire" onClick={ouvrirModalCreationPartenariat}>
                          <Plus size={16} />
                          Créer un partenariat
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="page-lotissements__contenu">
            {chargementParcelles && (
              <div className="page-lotissements__chargement">
                <Loader2 size={24} className="chargement__spinner" />
                <p>Chargement des parcelles...</p>
              </div>
            )}

            {erreurParcelles && (
              <div className="page-lotissements__erreur">
                <p>Une erreur est survenue.</p>
              </div>
            )}

            {!chargementParcelles && !erreurParcelles && parcelles.length === 0 && (
              <div className="page-lotissements__vide">
                <p>Aucune parcelle trouvée.</p>
                <button className="bouton bouton--primaire" onClick={ouvrirModalCreationParcelle}>
                  <Plus size={20} />
                  Créer la première parcelle
                </button>
              </div>
            )}

            {!chargementParcelles && !erreurParcelles && parcelles.length > 0 && (
              <div className="page-lotissements__grille">
                {parcelles.map((parcelle) => (
                  <CarteParcelle
                    key={parcelle.id}
                    parcelle={parcelle}
                    surModifier={ouvrirModalModificationParcelle}
                    surSupprimer={(p) => {
                      setParcelleSelectionnee(p);
                      setModalSuppressionParcelleOuverte(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      {modalLotissementOuverte && (
        <FormulaireLotissement
          lotissement={lotissementEnEdition}
          surSoumettre={gererSoumissionLotissement}
          surAnnuler={fermerModalLotissement}
          enCours={enCoursCreationLotissement || enCoursModificationLotissement}
        />
      )}

      {modalParcelleOuverte && (
        <FormulaireParcelle
          parcelle={parcelleEnEdition}
          lotissements={lotissements}
          lotissementParDefaut={lotissementSelectionne}
          surSoumettre={gererSoumissionParcelle}
          surAnnuler={fermerModalParcelle}
          enCours={enCoursCreationParcelle || enCoursModificationParcelle}
        />
      )}

      {modalPartenariatOuverte && (
        <FormulairePartenariat
          proprietaires={proprietaires}
          lotissements={lotissements}
          partenariat={{ idLotissement: lotissementSelectionne?.id }}
          surSoumettre={gererSoumissionPartenariat}
          surAnnuler={fermerModalPartenariat}
          enCours={enCoursCreationPartenariat}
        />
      )}

      {/* Modale Confirmation Suppression Lotissement */}
      <ModaleConfirmation
        ouverte={modalSuppressionLotissementOuverte}
        titre="Supprimer le lotissement"
        message={`Voulez-vous vraiment supprimer le lotissement "${lotissementSelectionne?.nom}" ? Cela supprimera également toutes ses parcelles.`}
        surConfirmer={confirmerSuppressionLotissement}
        surAnnuler={() => {
          setModalSuppressionLotissementOuverte(false);
          setLotissementSelectionne(null);
        }}
      />

      {/* Modale Confirmation Suppression Parcelle */}
      <ModaleConfirmation
        ouverte={modalSuppressionParcelleOuverte}
        titre="Supprimer la parcelle"
        message={`Voulez-vous vraiment supprimer la parcelle "${parcelleSelectionnee?.numero}" ?`}
        surConfirmer={confirmerSuppressionParcelle}
        surAnnuler={() => {
          setModalSuppressionParcelleOuverte(false);
          setParcelleSelectionnee(null);
        }}
      />
    </div>
  );
}
