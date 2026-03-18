import { X, RefreshCw, Loader2 } from 'lucide-react';
import './ModaleLogs.css';

/**
 * Composant ModaleLogs — Affiche les logs système
 */
export default function ModaleLogs({ logs, onClose, onRefresh, chargement }) {
    return (
        <div className="modal-fond" onClick={onClose}>
            <div className="modal modal--large" onClick={(e) => e.stopPropagation()}>
                <div className="modal__entete">
                    <h2 className="modal__titre">Logs système</h2>
                    <div style={{ display: 'flex', gap: 'var(--espace-2)' }}>
                        <button 
                            className="bouton bouton--fantome bouton--petit"
                            onClick={onRefresh}
                            disabled={chargement}
                        >
                            <RefreshCw size={16} className={chargement ? 'rotation' : ''} />
                        </button>
                        <button 
                            className="bouton bouton--fantome bouton--petit"
                            onClick={onClose}
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                <div className="modal__corps">
                    {chargement ? (
                        <div style={{ textAlign: 'center', padding: 'var(--espace-8)' }}>
                            <Loader2 size={24} className="chargement__spinner" style={{ margin: '0 auto' }} />
                            <p style={{ marginTop: 'var(--espace-4)', color: 'var(--couleur-gris)' }}>
                                Chargement des logs...
                            </p>
                        </div>
                    ) : logs && logs.length > 0 ? (
                        <div className="logs-container">
                            <pre className="logs-content">
                                {logs.join('')}
                            </pre>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--espace-8)', color: 'var(--couleur-gris)' }}>
                            Aucun log disponible
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
