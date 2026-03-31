import { useState, useEffect } from 'react';
import { 
    ScrollText, 
    Search, 
    Calendar, 
    User, 
    Building2,
    Loader2,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Activity,
    X,
    Database,
    Hash,
    Terminal
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import './PageJournauxAudit.css';

export default function PageJournauxAudit() {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [chargement, setChargement] = useState(true);
    const [logSelectionne, setLogSelectionne] = useState(null);
    const [filtres, setFiltres] = useState({
        action: '',
        id_tenant: '',
        debut: '',
        fin: ''
    });
    const { notifier } = useToast();

    useEffect(() => {
        chargerLogs();
    }, [pagination.current_page]);

    const chargerLogs = async () => {
        try {
            setChargement(true);
            const data = await serviceAdmin.listerAuditLogs({
                page: pagination.current_page,
                ...filtres
            });
            setLogs(data.data);
            setPagination({
                current_page: data.current_page,
                last_page: data.last_page
            });
        } catch (erreur) {
            notifier('Erreur lors du chargement des logs', 'error');
        } finally {
            setChargement(false);
        }
    };

    const handleFiltrer = (e) => {
        e.preventDefault();
        setPagination({ ...pagination, current_page: 1 });
        chargerLogs();
    };

    const formaterDate = (dateString) => {
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBadgeClass = (action) => {
        const a = action.toLowerCase();
        if (a.includes('create') || a.includes('store')) return 'action-badge--create';
        if (a.includes('delete') || a.includes('destroy')) return 'action-badge--delete';
        if (a.includes('update') || a.includes('edit')) return 'action-badge--update';
        if (a.includes('login') || a.includes('connexion')) return 'action-badge--login';
        return '';
    };

    return (
        <div className="page-audit">
            {/* En-tête */}
            <header className="page-audit__entete">
                <div className="page-audit__titre-groupe">
                    <span className="page-audit__badge-section">Administration</span>
                    <h1 className="page-audit__titre">Journaux d'Audit</h1>
                    <p className="page-audit__soustitre">Traçabilité complète des actions effectuées sur la plateforme</p>
                </div>
                <div className="flex" style={{gap: '1rem'}}>
                    <div className="carte-petite flex-centre" style={{padding: '0.75rem 1.25rem', background: 'white', borderRadius: '12px', border: '1px solid var(--audit-glass-border)'}}>
                        <Activity size={18} className="texte-primaire" style={{marginRight: '0.75rem'}} />
                        <div>
                            <div className="texte-xs texte-gris">Dernière action</div>
                            <div className="texte-sm texte-gras">{logs[0]?.action || '--'}</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filtres */}
            <div className="filters-container">
                <form onSubmit={handleFiltrer} className="flex" style={{ width: '100%', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div className="filter-group">
                        <label><Activity size={14} /> Type d'action</label>
                        <div className="filter-input-wrapper">
                            <Terminal size={18} />
                            <input 
                                type="text" 
                                className="filter-input"
                                placeholder="ex: create_tenant, update..."
                                value={filtres.action}
                                onChange={(e) => setFiltres({...filtres, action: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="filter-group">
                        <label><Calendar size={14} /> Période (Début)</label>
                        <div className="filter-input-wrapper">
                            <Calendar size={18} />
                            <input 
                                type="date" 
                                className="filter-input"
                                value={filtres.debut}
                                onChange={(e) => setFiltres({...filtres, debut: e.target.value})}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-filter">
                        <Filter size={18} /> Filtrer les résultats
                    </button>
                </form>
            </div>

            {/* Table */}
            {chargement ? (
                <div className="flex-centre" style={{padding: '5rem'}}>
                    <Loader2 className="chargement__spinner" size={48} />
                </div>
            ) : (
                <div className="table-container fade-in">
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Date & Heure</th>
                                <th>Tenant</th>
                                <th>Acteur</th>
                                <th>Action</th>
                                <th>Entité</th>
                                <th style={{textAlign: 'right'}}>Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>
                                        <div className="flex-col">
                                            <span className="texte-gras">{new Date(log.created_at).toLocaleDateString()}</span>
                                            <span className="texte-gris texte-xs">{new Date(log.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex" style={{gap: '8px', alignItems: 'center'}}>
                                            <Building2 size={14} className="texte-primaire" />
                                            <span className="texte-sm">{log.tenant?.nom || 'Plateforme'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex" style={{gap: '10px', alignItems: 'center'}}>
                                            <div className="sidebar__avatar" style={{width: '28px', height: '28px', fontSize: '10px'}}>
                                                {log.utilisateur?.nom?.charAt(0) || 'S'}
                                            </div>
                                            <div className="flex-col">
                                                <span className="texte-sm texte-gras">{log.utilisateur?.nom || 'Système'}</span>
                                                <span className="texte-xs texte-gris">{log.adresse_ip || '127.0.0.1'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`action-badge ${getBadgeClass(log.action)}`}>
                                            {log.action?.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex" style={{gap: '6px', alignItems: 'center'}}>
                                            <Database size={14} className="texte-gris" />
                                            <code className="table-code">{log.table_concernee}</code>
                                            <span className="texte-gris texte-xs">#{log.id_enregistrement}</span>
                                        </div>
                                    </td>
                                    <td style={{textAlign: 'right'}}>
                                        <button 
                                            className="bouton bouton--carre bouton--gris-clair"
                                            onClick={() => setLogSelectionne(log)}
                                            title="Voir les détails"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination" style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <button 
                            className="pagination__bouton"
                            disabled={pagination.current_page === 1}
                            onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                        >
                            <ChevronLeft size={16} /> Précédent
                        </button>
                        <div className="flex-centre" style={{gap: '0.5rem'}}>
                            <span className="texte-sm texte-gris">Page</span>
                            <span className="texte-sm texte-gras">{pagination.current_page}</span>
                            <span className="texte-sm texte-gris">sur</span>
                            <span className="texte-sm texte-gras">{pagination.last_page}</span>
                        </div>
                        <button 
                            className="pagination__bouton"
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => setPagination({...pagination, current_page: pagination.current_page + 1})}
                        >
                            Suivant <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Détails */}
            {logSelectionne && (
                <div className="modal-overlay" onClick={() => setLogSelectionne(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-fermer" onClick={() => setLogSelectionne(null)}>
                            <X size={24} />
                        </button>
                        
                        <div className="flex" style={{gap: '1rem', marginBottom: '2rem', alignItems: 'center'}}>
                            <div className="page-audit__badge-section">Détails de l'action</div>
                            <span className={`action-badge ${getBadgeClass(logSelectionne.action)}`}>
                                {logSelectionne.action?.toUpperCase()}
                            </span>
                        </div>

                        <h2 className="texte-2xl texte-gras" style={{marginBottom: '1.5rem'}}>
                            Modification sur {logSelectionne.table_concernee}
                        </h2>

                        <div className="grille-audit" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
                            <div className="carte-petite" style={{padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
                                <div className="texte-xs texte-gris">Utilisateur</div>
                                <div className="texte-sm texte-gras">{logSelectionne.utilisateur?.nom || 'Système'}</div>
                            </div>
                            <div className="carte-petite" style={{padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
                                <div className="texte-xs texte-gris">Date de l'action</div>
                                <div className="texte-sm texte-gras">{formaterDate(logSelectionne.created_at)}</div>
                            </div>
                            <div className="carte-petite" style={{padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
                                <div className="texte-xs texte-gris">Adresse IP</div>
                                <div className="texte-sm texte-gras">{logSelectionne.adresse_ip || 'N/A'}</div>
                            </div>
                            <div className="carte-petite" style={{padding: '1rem', background: '#f8fafc', borderRadius: '12px'}}>
                                <div className="texte-xs texte-gris">ID Enregistrement</div>
                                <div className="texte-sm texte-gras">#{logSelectionne.id_enregistrement}</div>
                            </div>
                        </div>

                        <div className="texte-sm texte-gras" style={{marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <Hash size={16} /> Données de l'action (JSON)
                        </div>
                        <div className="json-viewer">
                            {logSelectionne.details ? (
                                <pre>{JSON.stringify(JSON.parse(logSelectionne.details), null, 2)}</pre>
                            ) : (
                                <span className="texte-gris italic">Aucun détail supplémentaire disponible pour cette action.</span>
                            )}
                        </div>
                        
                        <div className="flex" style={{marginTop: '2.5rem', justifyContent: 'flex-end'}}>
                            <button className="bouton bouton--primaire" onClick={() => setLogSelectionne(null)}>
                                Fermer les détails
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
