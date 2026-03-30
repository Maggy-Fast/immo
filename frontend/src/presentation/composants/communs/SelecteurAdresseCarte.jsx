import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Navigation, Search, Loader2, Info, Crosshair } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './SelecteurAdresseCarte.css';

// Correction icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Composant de mise à jour du centre de la carte
 */
function ChangeVue({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center && center[0] && center[1]) {
            map.setView(center, zoom || 15);
        }
    }, [center, zoom, map]);
    return null;
}

/**
 * Composant de gestion des clics sur la carte
 */
function ClicCarte({ onLocationSelected }) {
    useMapEvents({
        click(e) {
            onLocationSelected(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function SelecteurAdresseCarte({
    adresseInitial = '',
    latInitial = '',
    lngInitial = '',
    onChangement,
    label = 'Adresse et Localisation',
    placeholder = 'Tapez une adresse ou cliquez sur la carte...'
}) {
    const [recherche, setRecherche] = useState(adresseInitial);
    const [suggestions, setSuggestions] = useState([]);
    const [chargement, setChargement] = useState(false);
    const [position, setPosition] = useState([
        latInitial ? parseFloat(latInitial) : 14.6937, // Dakar par défaut
        lngInitial ? parseFloat(lngInitial) : -17.4441
    ]);
    const [zoom, setZoom] = useState(latInitial && lngInitial ? 15 : 12);
    const [suggestionsVisibles, setSuggestionsVisibles] = useState(false);
    const timeoutRef = useRef(null);

    // Synchronisation initiale
    useEffect(() => {
        if (latInitial && lngInitial) {
            setPosition([parseFloat(latInitial), parseFloat(lngInitial)]);
            setZoom(15);
        }
        if (adresseInitial) {
            setRecherche(adresseInitial);
        }
    }, [latInitial, lngInitial, adresseInitial]);

    const rechercherAdresse = useCallback(async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setChargement(true);
        try {
            // Utilisation de Nominatim (OSM)
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=sn` // SN pour limiter au Sénégal par défaut
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Erreur Nominatim:', error);
        } finally {
            setChargement(false);
        }
    }, []);

    const gererSaisie = (e) => {
        const val = e.target.value;
        setRecherche(val);
        setSuggestionsVisibles(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            rechercherAdresse(val);
        }, 500);
    };

    const selectionnerSuggestion = (item) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const fullAddress = item.display_name;

        setPosition([lat, lon]);
        setRecherche(fullAddress);
        setSuggestionsVisibles(false);
        setZoom(17);

        onChangement({
            adresse: fullAddress,
            latitude: lat,
            longitude: lon
        });
    };

    const selectionnerSurCarte = async (lat, lng) => {
        setPosition([lat, lng]);
        setZoom(17);
        
        // Tentative de géocodage inverse pour récupérer l'adresse
        try {
            setChargement(true);
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data && data.display_name) {
                setRecherche(data.display_name);
                onChangement({
                    adresse: data.display_name,
                    latitude: lat,
                    longitude: lng
                });
            } else {
                onChangement({
                    adresse: recherche,
                    latitude: lat,
                    longitude: lng
                });
            }
        } catch (error) {
            console.error('Erreur géocodage inverse:', error);
            onChangement({
                adresse: recherche,
                latitude: lat,
                longitude: lng
            });
        } finally {
            setChargement(false);
        }
    };

    const meLocaliser = () => {
        if (!navigator.geolocation) return;
        
        setChargement(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                selectionnerSurCarte(latitude, longitude);
            },
            () => {
                setChargement(false);
                alert("Impossible de vous localiser. Vérifiez vos permissions.");
            }
        );
    };

    return (
        <div className="selecteur-adresse">
            <label className="champ__label">{label}</label>
            
            <div className="selecteur-adresse__recherche">
                <div className="recherche" style={{ margin: 0, width: '100%' }}>
                    <Search className="recherche__icone" size={18} />
                    <input 
                        type="text" 
                        placeholder={placeholder}
                        className="recherche__input"
                        value={recherche}
                        onChange={gererSaisie}
                        onFocus={() => setSuggestionsVisibles(true)}
                        onBlur={() => setTimeout(() => setSuggestionsVisibles(false), 200)}
                    />
                    {chargement && <Loader2 className="selecteur-adresse__chargement" size={16} />}
                </div>

                {suggestionsVisibles && suggestions.length > 0 && (
                    <div className="selecteur-adresse__suggestions fade-in">
                        {suggestions.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="selecteur-adresse__suggestion-item"
                                onMouseDown={(e) => {
                                    e.preventDefault(); // Empêche le onBlur de l'input avant le clic
                                    selectionnerSuggestion(item);
                                }}
                            >
                                <MapPin size={16} className="texte-gris" style={{ marginTop: '2px' }} />
                                <div>
                                    <div className="selecteur-adresse__suggestion-nom">{item.name}</div>
                                    <div className="selecteur-adresse__suggestion-adresse">{item.display_name}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="selecteur-adresse__carte-conteneur">
                <MapContainer 
                    center={position} 
                    zoom={zoom} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    <ChangeVue center={position} zoom={zoom} />
                    <ClicCarte onLocationSelected={selectionnerSurCarte} />
                    <Marker position={position} draggable={true} eventHandlers={{
                        dragend: (e) => {
                            const marker = e.target;
                            const pos = marker.getLatLng();
                            selectionnerSurCarte(pos.lat, pos.lng);
                        }
                    }} />
                </MapContainer>

                <div className="selecteur-adresse__carte-overlay">
                    <button 
                        type="button" 
                        className="selecteur-adresse__bouton-localiser"
                        onClick={meLocaliser}
                        title="Me localiser"
                    >
                        <Crosshair size={20} />
                    </button>
                </div>
            </div>

            <div className="selecteur-adresse__indications">
                <span><Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Cliquez ou glissez le marqueur pour affiner</span>
                <div className="coordonnees-badge">
                    {position[0].toFixed(5)}, {position[1].toFixed(5)}
                </div>
            </div>
        </div>
    );
}
