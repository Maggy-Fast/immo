import { useState, useEffect } from 'react';
import { Send, BarChart3, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '../composants/communs/ToastContext';
import apiService from '../../application/services/apiService';
import './PageNotificationsWhatsapp.css';

export default function PageNotificationsWhatsapp() {
    const { notifier } = useToast();
    const [ongletActif, setOngletActif] = useState('envoi');
    const [statistiques, setStatistiques] = useState(null);
    const [chargementStats, setChargementStats] = useState(false);
    
    // Formulaire d'envoi
    const [formulaire, setFormulaire] = useState({
        telephone: '',
        message: '',
        id_adherent: ''
    });
    const [chargementEnvoi, setChargementEnvoi] = useState(false);
    
    // Traitement file
    const [chargementTraitement, setChargementTraitement] = useState(false);
    const [resultatTraitement, setResultatTraitement] = useState(null);

    useEffect(() => {
        if (ongletActif === 'statistiques') {
            chargerStatistiques();
        }
    }, [ongletActif]);

    const chargerStatistiques = async () => {
        try {
            setChargementStats(true);
            const reponse = await apiService.get('/whatsapp/statistiques');
            setStatistiques(reponse.data);
        } catch (erreur) {
            notifier('Erreur lors du chargement des statistiques', 'error');
        } finally {
            setChargementStats(false);
        }
    };

    const envoyerMessageTest = async (e) => {
        e.preventDefault();
        if (!formulaire.telephone || !formulaire.message) {
            notifier('Veuillez remplir tous les champs', 'error');
            return;
        }

        try {
            setChargementEnvoi(true);
            const reponse = await apiService.post('/whatsapp/test', {
                telephone: formulaire.telephone,
                message: formulaire.message
            });
            
            if (reponse.data.success) {
                notifier('Message WhatsApp envoyé avec succès', 'success');
                setFormulaire({ telephone: '', message: '', id_adherent: '' });
            } else {
                notifier(reponse.data.message, 'error');
            }
        } catch (erreur) {
            notifier('Erreur lors de l\'envoi du message', 'error');
        } finally {
            setChargementEnvoi(false);
        }
    };

    const envoyerRappel = async () => {
        if (!formulaire.id_adherent) {
            notifier('Veuillez sélectionner un adhérent', 'error');
            return;
        }

        try {
            setChargementEnvoi(true);
            const reponse = await apiService.post('/whatsapp/rappel', {
                id_adherent: formulaire.id_adherent,
                date_echeance: new Date().toISOString().split('T')[0],
                montant: 50000
            });
            
            if (reponse.data.success) {
                notifier('Rappel créé et mis en file d\'attente', 'success');
                setFormulaire({ ...formulaire, id_adherent: '' });
            } else {
                notifier(reponse.data.message, 'error');
            }
        } catch (erreur) {
            notifier('Erreur lors de la création du rappel', 'error');
        } finally {
            setChargementEnvoi(false);
        }
    };

    const traiterFileAttente = async () => {
        try {
            setChargementTraitement(true);
            const reponse = await apiService.post('/whatsapp/traiter-file');
            setResultatTraitement(reponse.data);
            
            if (reponse.data.success) {
                notifier(`${reponse.data.nb_envoyes} message(s) traité(s) avec succès`, 'success');
            } else {
                notifier(reponse.data.message, 'error');
            }
        } catch (erreur) {
            notifier('Erreur lors du traitement de la file d\'attente', 'error');
        } finally {
            setChargementTraitement(false);
        }
    };

    const onglets = [
        { id: 'envoi', libelle: 'Envoi', icone: Send },
        { id: 'statistiques', libelle: 'Statistiques', icone: BarChart3 },
        { id: 'traitement', libelle: 'File d\'attente', icone: Clock }
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <div className="carte" style={{ marginBottom: '2rem' }}>
                <div className="carte__entete">
                    <h1 className="carte__titre">Notifications WhatsApp</h1>
                </div>
                
                {/* Onglets */}
                <div className="notifications__onglets">
                    {onglets.map(onglet => (
                        <button
                            key={onglet.id}
                            className={`notifications__onglet ${ongletActif === onglet.id ? 'active' : ''}`}
                            onClick={() => setOngletActif(onglet.id)}
                        >
                            <onglet.icone size={18} />
                            {onglet.libelle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenu des onglets */}
            {ongletActif === 'envoi' && (
                <div className="carte">
                    <div className="carte__entete">
                        <h2 className="carte__titre">Envoyer un message</h2>
                    </div>
                    <div className="carte__corps">
                        <form onSubmit={envoyerMessageTest} style={{ display: 'grid', gap: '1rem' }}>
                            <div className="champ-formulaire">
                                <label className="champ-formulaire__label">Numéro WhatsApp</label>
                                <input
                                    type="tel"
                                    className="champ-formulaire__input"
                                    value={formulaire.telephone}
                                    onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })}
                                    placeholder="771234567"
                                />
                            </div>
                            
                            <div className="champ-formulaire">
                                <label className="champ-formulaire__label">Message</label>
                                <textarea
                                    className="champ-formulaire__textarea"
                                    value={formulaire.message}
                                    onChange={(e) => setFormulaire({ ...formulaire, message: e.target.value })}
                                    placeholder="Votre message WhatsApp..."
                                    rows={4}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                    type="submit" 
                                    className="bouton bouton--primaire"
                                    disabled={chargementEnvoi}
                                >
                                    {chargementEnvoi ? (
                                        <><Loader2 size={16} className="chargement__spinner" /> Envoi...</>
                                    ) : (
                                        <><Send size={16} /> Envoyer</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {ongletActif === 'statistiques' && (
                <div className="carte">
                    <div className="carte__entete">
                        <h2 className="carte__titre">Statistiques des notifications</h2>
                    </div>
                    <div className="carte__corps">
                        {chargementStats ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                                <Loader2 size={32} className="chargement__spinner" />
                            </div>
                        ) : statistiques ? (
                            <div className="statistiques__grid">
                                <div className="statistique__carte">
                                    <div className="statistique__icone en-attente">
                                        <Clock size={24} />
                                    </div>
                                    <div className="statistique__info">
                                        <h3>{statistiques.en_attente}</h3>
                                        <p>En attente</p>
                                    </div>
                                </div>
                                
                                <div className="statistique__carte">
                                    <div className="statistique__icone envoyees">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div className="statistique__info">
                                        <h3>{statistiques.envoyees}</h3>
                                        <p>Envoyées</p>
                                    </div>
                                </div>
                                
                                <div className="statistique__carte">
                                    <div className="statistique__icone echecs">
                                        <XCircle size={24} />
                                    </div>
                                    <div className="statistique__info">
                                        <h3>{statistiques.echecs}</h3>
                                        <p>Échecs</p>
                                    </div>
                                </div>
                                
                                <div className="statistique__carte">
                                    <div className="statistique__icone recentes">
                                        <AlertCircle size={24} />
                                    </div>
                                    <div className="statistique__info">
                                        <h3>{statistiques.total_24h}</h3>
                                        <p>24 dernières heures</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <p>Impossible de charger les statistiques</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {ongletActif === 'traitement' && (
                <div className="carte">
                    <div className="carte__entete">
                        <h2 className="carte__titre">File d'attente</h2>
                    </div>
                    <div className="carte__corps">
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ marginBottom: '1.5rem' }}>
                                Traitez manuellement la file d'attente des notifications WhatsApp.
                            </p>
                            
                            <button 
                                className="bouton bouton--primaire"
                                onClick={traiterFileAttente}
                                disabled={chargementTraitement}
                            >
                                {chargementTraitement ? (
                                    <><Loader2 size={16} className="chargement__spinner" /> Traitement...</>
                                ) : (
                                    <><Clock size={16} /> Traiter la file d'attente</>
                                )}
                            </button>
                            
                            {resultatTraitement && (
                                <div style={{
                                    marginTop: '1.5rem',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    backgroundColor: resultatTraitement.success ? '#d1fae5' : '#fee2e2',
                                    color: resultatTraitement.success ? '#065f46' : '#991b1b'
                                }}>
                                    <strong>{resultatTraitement.message}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
