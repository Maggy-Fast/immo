/**
 * Page — Gestion des biens immobiliers
 */

import { useState } from 'react';
import { Plus, Search, Filter, List, Map as MapIcon, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { utiliserBiens } from '../../application/hooks/utiliserBiens';
import { utiliserProprietaires } from '../../application/hooks/utiliserProprietaires';
import { useCarteInteractive } from '../../application/hooks/useCarteInteractive';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import CarteBien from '../composants/biens/CarteBien';
import FormulaireBien from '../composants/biens/FormulaireBien';
import ModaleDetailsBien from '../composants/biens/ModaleDetailsBien';
import { OPTIONS_TYPES_BIEN } from '../../domaine/valeursObjets/typeBien';
import { OPTIONS_STATUTS_BIEN } from '../../domaine/valeursObjets/statutBien';
import { formaterMontant } from '../../application/utils/formatters';
import './PageBiens.css';

// Correction icônes Leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const iconeBien = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function PageBiens() {
  const [filtres, setFiltres] = useState({
    type: '',
    statut: '',
    recherche: '',
  });

  const [modalOuverte, setModalOuverte] = useState(false);
  const [modalDetailsOuverte, setModalDetailsOuverte] = useState(false);
  const [bienEnSelection, setBienEnSelection] = useState(null);
  const [bienEnEdition, setBienEnEdition] = useState(null);
  const [afficherFiltres, setAfficherFiltres] = useState(false);
  const [vueArchive, setVueArchive] = useState(false); // Vue archive pour les ventes
  const [confirmationSuppression, setConfirmationSuppression] = useState({ ouverte: false, bien: null });
  const [vue, setVue] = useState('liste'); // 'liste' ou 'carte'


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

  const { proprietaires, chargement: chargementProprietaires } = utiliserProprietaires();
  const { donneesCarte } = useCarteInteractive();

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
    setModalDetailsOuverte(false);
  };

  const ouvrirModalDetails = (bien) => {
    setBienEnSelection(bien);
    setModalDetailsOuverte(true);
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

  const gererSuppression = (bien) => {
    setConfirmationSuppression({ ouverte: true, bien });
  };

  const confirmerSuppression = async () => {
    const { bien } = confirmationSuppression;
    if (!bien) return;

    try {
      await supprimer(bien.id);
      setConfirmationSuppression({ ouverte: false, bien: null });
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const filtresActifs = Object.values(filtres).some((v) => v !== '');

  // Filtrer les biens selon la vue (archive ou actifs)
  const biensFiltres = biens.filter(bien => {
    if (vueArchive) {
      // Vue archive : montrer les biens vendus, réservés, ou en vente
      return ['vendu', 'reserve', 'en_vente'].includes(bien.statut);
    } else {
      // Vue normale : exclure les biens vendus
      return bien.statut !== 'vendu';
    }
  });

  return (
    <div className="page-biens">
      {/* En-tête */}
      <div className="page-biens__entete">
        <div>
          <h1 className="page-biens__titre">
            {vueArchive ? '📦 Archive des Ventes' : '🏠 Biens Immobiliers'}
          </h1>
          <p className="page-biens__description">
            {vueArchive 
              ? 'Consultez l\'historique des biens vendus et réservés'
              : 'Gérez votre portefeuille de biens immobiliers'
            }
          </p>
        </div>
        <div className="page-biens__actions">
          <div className="page-biens__actions-principales">
            <button 
              className={`bouton ${vueArchive ? 'bouton--secondaire' : 'bouton--primaire'}`}
              onClick={() => setVueArchive(!vueArchive)}
            >
              {vueArchive ? '📋 Biens Actifs' : '📦 Archive Ventes'}
            </button>
            {!vueArchive && (
              <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
                <Plus size={20} />
                Nouveau bien
              </button>
            )}
          </div>
        </div>
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

        <div className="page-biens__actions-secondaires">
          <div className="toggle-vue">
            <button
              className={`toggle-vue__bouton ${vue === 'liste' ? 'toggle-vue__bouton--actif' : ''}`}
              onClick={() => setVue('liste')}
              title="Vue Liste"
            >
              <List size={20} />
            </button>
            <button
              className={`toggle-vue__bouton ${vue === 'carte' ? 'toggle-vue__bouton--actif' : ''}`}
              onClick={() => setVue('carte')}
              title="Vue Carte"
            >
              <MapIcon size={20} />
            </button>
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
            <Loader2 size={24} className="chargement__spinner" />
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

        {!chargement && !erreur && biensFiltres.length === 0 && (
          <div className="page-biens__vide">
            <p>{vueArchive ? 'Aucun bien dans l\'archive des ventes.' : 'Aucun bien trouvé.'}</p>
            {filtresActifs ? (
              <button className="bouton bouton--secondaire" onClick={reinitialiserFiltres}>
                Réinitialiser les filtres
              </button>
            ) : !vueArchive && (
              <button className="bouton bouton--primaire" onClick={ouvrirModalCreation}>
                <Plus size={20} />
                Créer votre premier bien
              </button>
            )}
          </div>
        )}

        {!chargement && !erreur && biensFiltres.length > 0 && vue === 'liste' && (
          <div className="page-biens__grille">
            {biensFiltres.map((bien) => (
              <CarteBien
                key={bien.id}
                bien={bien}
                surClic={ouvrirModalDetails}
                surModifier={ouvrirModalModification}
                surSupprimer={gererSuppression}
              />
            ))}
          </div>
        )}

        {!chargement && !erreur && biensFiltres.length > 0 && vue === 'carte' && (
          <div className="page-biens__carte">
             <MapContainer
                center={donneesCarte.length > 0 ? donneesCarte[0].coordonnees : [14.4974, -14.4524]}
                zoom={13}
                style={{ height: '600px', width: '100%', borderRadius: '12px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {donneesCarte.filter(p => p.type === 'bien' && biensFiltres.some(b => b.id === p.idOriginal)).map((point) => (
                  <Marker 
                    key={point.id} 
                    position={point.coordonnees}
                    icon={iconeBien}
                    eventHandlers={{
                      click: () => {
                        const bienOriginal = biensFiltres.find(b => b.id === point.idOriginal);
                        if (bienOriginal) ouvrirModalDetails(bienOriginal);
                      }
                    }}
                  >
                    <Popup>
                      <div className="popup-bien">
                        <h4 className="popup-bien__titre">{point.titre}</h4>
                        <p className="popup-bien__adresse">{point.adresse}</p>
                        <p className="popup-bien__prix">{formaterMontant(point.budget)}</p>
                        <button 
                          className="bouton bouton--primaire bouton--petit"
                          onClick={() => {
                            const bienOriginal = biensFiltres.find(b => b.id === point.idOriginal);
                            if (bienOriginal) ouvrirModalDetails(bienOriginal);
                          }}
                        >
                          Détails
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
          </div>
        )}
      </div>

      {/* Modal détails */}
      {modalDetailsOuverte && (
        <ModaleDetailsBien
          bien={bienEnSelection}
          surModifier={ouvrirModalModification}
          surFermer={() => setModalDetailsOuverte(false)}
        />
      )}

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
      {/* Modale de confirmation de suppression */}
      <ModaleConfirmation
        ouverte={confirmationSuppression.ouverte}
        titre="Supprimer le bien"
        message={`Êtes-vous sûr de vouloir supprimer le bien situé à "${confirmationSuppression.bien?.adresse}" ? Cette action est irréversible.`}
        surConfirmer={confirmerSuppression}
        surAnnuler={() => setConfirmationSuppression({ ouverte: false, bien: null })}
        enCours={enCoursSuppression}
        type="danger"
        texteConfirmer="Supprimer"
      />
    </div>
  );
}
