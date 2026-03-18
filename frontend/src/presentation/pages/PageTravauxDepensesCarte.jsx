import React, { Suspense } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './PageTravauxDepensesCarte.css';
import { useCarteInteractive } from '../../application/hooks/useCarteInteractive';
import EtatVideCarte from '../composants/communs/EtatVideCarte';
import { formaterMontant } from '../../application/utils/formatters';
import { 
  Hammer, 
  Euro, 
  Home, 
  Users, 
  Layers, 
  Settings2, 
  RotateCcw, 
  AlertTriangle,
  Map as MapIcon,
  LayoutDashboard,
  Maximize2,
  TrendingUp,
  Box,
  Handshake
} from 'lucide-react';

// Correction pour les icônes Leaflet dans React
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PageTravauxDepensesCarte = () => {
  const {
    donneesCarte,
    donneesSansCoordonnees,
    pointsCarteBruts,
    loading,
    error,
    stats,
    selectedType,
    budgetRange,
    setSelectedType,
    setBudgetRange,
    effacerFiltres,
    rafraichirDonnees
  } = useCarteInteractive();

  const getIconByType = (type) => {
    let iconUrl;
    switch(type) {
      case 'travaux':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
        break;
      case 'depenses':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png';
        break;
      case 'lotissements':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
        break;
      case 'bien':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png';
        break;
      case 'parcelles_cooperative':
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png';
        break;
      default:
        iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png';
    }

    return new Icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  const getStatutLibelle = (statut) => {
    if (!statut) return 'Non spécifié';
    const mapping = {
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'planifie': 'Planifié',
      'annule': 'Annulé',
      'disponible': 'Disponible',
      'loue': 'Loué'
    };
    return mapping[statut] || statut;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const MapBounds = ({ data }) => {
    const map = useMap();

    React.useEffect(() => {
      if (data && data.length > 0) {
        const validBounds = data
          .filter(item => item && item.coordonnees && Array.isArray(item.coordonnees))
          .map(item => item.coordonnees);

        if (validBounds.length > 0) {
          try {
            map.fitBounds(validBounds, { padding: [100, 100], maxZoom: 15 });
          } catch (error) {
            console.warn('Erreur lors du centrage de la carte:', error);
          }
        }
      }
    }, [data, map]);

    return null;
  };

  if (loading) {
    return (
      <div className="page-carte-immobiliere">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Initialisation de l'expérience cartographique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-carte-immobiliere">
        <div className="conteneur-erreur" style={{ 
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--ombre-xl)', textAlign: 'center'
        }}>
          <AlertTriangle color="var(--couleur-erreur)" size={48} style={{ marginBottom: '1rem' }} />
          <p style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>{error}</p>
          <button onClick={rafraichirDonnees} className="bouton bouton--primaire">
            <RotateCcw size={16} /> Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-carte-immobiliere">
      {/* En-tête Flottant */}
      <header className="page-carte-immobiliere__entete">
        <h1 className="page-carte-immobiliere__titre">
          <MapIcon size={24} style={{ marginRight: '10px', verticalAlign: 'middle', color: 'var(--couleur-primaire)' }} />
          MaggyFast Explore
        </h1>
        <p className="page-carte-immobiliere__sous-titre">Intelligence Géographique</p>
      </header>

      {/* Tableau de bord statistique (Panneau Latéral Flottant) */}
      <aside className="tableau-bord">
        <div className="tableau-bord__grille">
          <div className="carte-statistique">
            <div className="carte-statistique__icone" style={{ color: 'var(--z-info)' }}><TrendingUp size={20} /></div>
            <div className="carte-statistique__contenu">
              <div className="carte-statistique__nombre">{stats?.total || 0}</div>
              <div className="carte-statistique__label">Points d'intérêt</div>
            </div>
          </div>
          
          <div className="carte-statistique">
            <div className="carte-statistique__icone" style={{ color: 'var(--couleur-succes)' }}><Euro size={20} /></div>
            <div className="carte-statistique__contenu">
              <div className="carte-statistique__nombre">{formaterMontant(stats?.budgetTotal || 0)}</div>
              <div className="carte-statistique__label">Budget Global</div>
            </div>
          </div>
          
          <div className="carte-statistique">
            <div className="carte-statistique__icone" style={{ color: 'var(--couleur-avertissement)' }}><Hammer size={20} /></div>
            <div className="carte-statistique__contenu">
              <div className="carte-statistique__nombre">{stats?.travauxCount || 0}</div>
              <div className="carte-statistique__label">Travaux Actifs</div>
            </div>
          </div>

          <div className="carte-statistique">
            <div className="carte-statistique__icone" style={{ color: 'var(--couleur-primaire)' }}><Layers size={20} /></div>
            <div className="carte-statistique__contenu">
              <div className="carte-statistique__nombre">{stats?.lotissementsCount || 0}</div>
              <div className="carte-statistique__label">Lotissements</div>
            </div>
          </div>

          <div className="carte-statistique">
            <div className="carte-statistique__icone" style={{ color: 'var(--couleur-secondaire)' }}><Home size={20} /></div>
            <div className="carte-statistique__contenu">
              <div className="carte-statistique__nombre">{stats?.biensCount || 0}</div>
              <div className="carte-statistique__label">Patrimoine Bâti</div>
            </div>
          </div>

          <div className="carte-statistique">
            <div className="carte-statistique__icone" style={{ color: '#8B5CF6' }}><Handshake size={20} /></div>
            <div className="carte-statistique__contenu">
              <div className="carte-statistique__nombre">{stats?.partenariatsCount || 0}</div>
              <div className="carte-statistique__label">Partenariats</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Barre de Filtres Flottante (Bas) */}
      <section className="section-filtres">
        <div className="section-filtres__entete">
          <Settings2 size={20} color="white" />
          <button className="bouton bouton--lien" onClick={effacerFiltres} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            RAZ
          </button>
        </div>
        
        <div className="filtres-conteneur">
          <div className="filtre-groupe">
            <label className="filtre-label">Catégorie</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filtre-select"
            >
              <option value="tous">Tout afficher</option>
              <option value="travaux">🔨 Travaux</option>
              <option value="depenses">📄 Dépenses</option>
              <option value="lotissements">🏗️ Lotissements</option>
              <option value="bien">🏠 Biens Immobiliers</option>
              <option value="parcelles_cooperative">🟣 Parcelles Coopérative</option>
            </select>
          </div>

          <div className="filtre-groupe">
            <label className="filtre-label">Budget Max: {formaterMontant(budgetRange.max)}</label>
            <div className="budget-controles">
              <input
                type="range"
                min="0"
                max={Math.max(budgetRange.max * 1.2, 100000)}
                step="5000"
                value={budgetRange.max}
                onChange={(e) => setBudgetRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="budget-slider"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Alerte Eléments non localisés */}
      {donneesSansCoordonnees && donneesSansCoordonnees.length > 0 && (
        <section className="section-donnees-sans-coordonnees">
          <div className="section-donnees-sans-coordonnees__titre">
            <AlertTriangle size={14} style={{ marginRight: '6px' }} />
            {donneesSansCoordonnees.length} éléments hors-carte
          </div>
          <div className="donnees-sans-coordonnees__liste">
            {donneesSansCoordonnees.map((item, index) => (
              <div key={index} className="item-sans-coordonnees" style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{item.titre}</div>
                <div style={{ fontSize: '10px', color: '#666' }}>{item.adresse || 'Sans adresse'}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Carte Interactive Plein Écran */}
      <main className="section-carte">
        <Suspense fallback={<div className="loading-container"><div className="spinner"></div></div>}>
          <div className="conteneur-carte">
            <MapContainer 
              center={[14.4974, -14.4524]} // Dakar, Sénégal
              zoom={10} 
              zoomControl={false}
              style={{ height: '600px', width: '100%' }}
              className="carte-interactive"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Theme plus élégant/clair
                attribution='&copy; CARTO'
              />
              
              {/* <MapBounds data={donneesCarte} /> */}
              
              {donneesCarte.map((item, index) => (
                <Marker
                  key={item.id || index}
                  position={item.coordonnees}
                  icon={getIconByType(item.type)}
                >
                  <Popup>
                    <div className="popup-contenu">
                      <h3>{item.titre || 'Détail Élément'}</h3>
                      <div className="popup-info">
                        <p><strong>Type</strong> <span>{item.type.toUpperCase()}</span></p>
                        {item.budget > 0 && <p><strong>Budget</strong> <span>{formaterMontant(item.budget)}</span></p>}
                        <p><strong>Statut</strong> <span>{getStatutLibelle(item.statut)}</span></p>
                        {item.dateDebut && <p><strong>Période</strong> <span>{formatDate(item.dateDebut)}</span></p>}
                        <p><strong>Localisation</strong> <span>{item.adresse || 'N/A'}</span></p>
                        {item.type === 'parcelles_cooperative' && (
                          <>
                            {item.groupeNom && <p><strong>Groupe</strong> <span>{item.groupeNom}</span></p>}
                            {item.adherentNom && <p><strong>Adhérent</strong> <span>{item.adherentNom}</span></p>}
                            {item.surface && <p><strong>Surface</strong> <span>{item.surface} m²</span></p>}
                          </>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </Suspense>
      </main>

      {/* Légende Discrète */}
      <footer className="section-legende">
        <h3 className="section-legende__titre">Légende</h3>
        <div className="legende-contenu">
          <div className="legende-item">
            <div className="legende-marqueur" style={{ backgroundColor: '#2ecc71', borderRadius: '50%' }}></div>
            <span>Travaux</span>
          </div>
          <div className="legende-item">
            <div className="legende-marqueur" style={{ backgroundColor: '#3498db', borderRadius: '50%' }}></div>
            <span>Dépenses</span>
          </div>
          <div className="legende-item">
            <div className="legende-marqueur" style={{ backgroundColor: '#e74c3c', borderRadius: '50%' }}></div>
            <span>Lotissements</span>
          </div>
          <div className="legende-item">
            <div className="legende-marqueur" style={{ backgroundColor: '#f1c40f', borderRadius: '50%' }}></div>
            <span>Biens</span>
          </div>
          <div className="legende-item">
            <div className="legende-marqueur" style={{ backgroundColor: '#8B5CF6', borderRadius: '50%' }}></div>
            <span>Parcelles Coopérative</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PageTravauxDepensesCarte;
