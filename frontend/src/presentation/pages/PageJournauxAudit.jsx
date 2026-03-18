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
    Activity
} from 'lucide-react';
import { serviceAdmin } from '../../infrastructure/api/serviceAdmin';
import { useToast } from '../composants/communs/ToastContext';
import './PageAdherents.css'; // Reusing table and list layout

export default function PageJournauxAudit() {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [chargement, setChargement] = useState(true);
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
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="tableau-de-bord fade-in">
            <div className="flex-entre" style={{ marginBottom: 'var(--espace-8)' }}>
                <div>
                    <h1 className="page-titre">Journaux d'Audit</h1>
                    <p className="texte-gris">Historique complet des actions effectuées sur la plateforme</p>
                </div>
            </div>

            <div className="carte" style={{ marginBottom: 'var(--espace-6)' }}>
                <div className="carte__corps">
                    <form onSubmit={handleFiltrer} className="flex" style={{ gap: 'var(--espace-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="champ" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                            <label className="champ__label">Action</label>
                            <div className="recherche">
                                <Activity className="recherche__icone" size={18} />
                                <input 
                                    type="text" 
                                    className="recherche__input"
                                    placeholder="create, update, delete..."
                                    value={filtres.action}
                                    onChange={(e) => setFiltres({...filtres, action: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="champ" style={{ width: '200px', marginBottom: 0 }}>
                            <label className="champ__label">Date de début</label>
                            <div className="recherche">
                                <Calendar className="recherche__icone" size={18} />
                                <input 
                                    type="date" 
                                    className="recherche__input"
                                    value={filtres.debut}
                                    onChange={(e) => setFiltres({...filtres, debut: e.target.value})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="bouton bouton--primaire">
                            <Filter size={18} /> Filtrer
                        </button>
                    </form>
                </div>
            </div>

            {chargement ? (
                <div className="chargement">
                    <div className="chargement__spinner"></div>
                </div>
            ) : (
                <div className="carte fade-in">
                    <div className="tableau-conteneur" style={{maxHeight: 'calc(100vh - 350px)'}}>
                        <table className="tableau">
                            <thead style={{position: 'sticky', top: 0, zIndex: 1, backgroundColor: 'var(--couleur-blanc)'}}>
                                <tr>
                                    <th>Date & Heure</th>
                                    <th>Tenant</th>
                                    <th>Utilisateur</th>
                                    <th>Action</th>
                                    <th>Table</th>
                                    <th>ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="texte-sm">
                                            <div className="flex" style={{gap: '8px', alignItems: 'center'}}>
                                                <Calendar size={14} className="texte-gris" />
                                                {formaterDate(log.created_at)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex" style={{gap: '8px', alignItems: 'center'}}>
                                                <Building2 size={14} className="texte-primaire" />
                                                <span className="texte-sm">{log.tenant?.nom || 'Système'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex" style={{gap: '8px', alignItems: 'center'}}>
                                                <User size={14} className="texte-gris" />
                                                <div>
                                                    <div className="texte-sm texte-gras">{log.utilisateur?.nom || 'Système'}</div>
                                                    <div className="texte-xs texte-gris">{log.utilisateur?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${
                                                log.action?.includes('delete') ? 'badge--erreur' : 
                                                log.action?.includes('create') ? 'badge--succes' : 
                                                'badge--attention'
                                            }`} style={{fontSize: '11px'}}>
                                                {log.action?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <code style={{fontSize: '12px', background: 'var(--couleur-gris-clair)', padding: '2px 4px', borderRadius: '4px'}}>
                                                {log.table_concernee}
                                            </code>
                                        </td>
                                        <td className="texte-sm">{log.id_enregistrement}</td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{textAlign: 'center', padding: 'var(--espace-10)', color: 'var(--couleur-gris)'}}>
                                            Aucun log d'audit trouvé pour ces critères.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination" style={{ padding: 'var(--espace-4)', borderTop: 'var(--bordure-fine)' }}>
                        <button 
                            className="pagination__bouton"
                            disabled={pagination.current_page === 1}
                            onClick={() => setPagination({...pagination, current_page: pagination.current_page - 1})}
                        >
                            <ChevronLeft size={16} /> Précédent
                        </button>
                        <span className="texte-gris texte-sm">
                            Page {pagination.current_page} / {pagination.last_page}
                        </span>
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
        </div>
    );
}
