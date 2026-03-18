import { Building2, Users, UserCheck, FileText, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import EnTete from '../composants/communs/EnTete';
import { utiliserTableauDeBord } from '../../application/hooks/utiliserTableauDeBord';
import { formaterMontant, formaterMontantCourt } from '../../application/utils/formatters';
import './PageTableauDeBord.css';

/**
 * Page Tableau de Bord — Vue d'ensemble professionnelle dynamique
 */
export default function PageTableauDeBord() {
    const { stats, chargement, erreur } = utiliserTableauDeBord();

    if (chargement) {
        return (
            <>
                <EnTete titre="Tableau de bord" />
                <div className="tableau-de-bord">
                    <div className="chargement-global">Chargement des statistiques...</div>
                </div>
            </>
        );
    }

    if (erreur || !stats) {
        return (
            <>
                <EnTete titre="Tableau de bord" />
                <div className="tableau-de-bord">
                    <div className="erreur-globale">
                        <AlertCircle size={48} />
                        <p>Une erreur est survenue lors du chargement des statistiques.</p>
                    </div>
                </div>
            </>
        );
    }

    const { principales, financier, graphiques, activitesRecentes, biensRecents } = stats;

    const statistiques = [
        {
            id: 'biens',
            titre: 'Total Biens',
            valeur: principales.total_biens,
            evolution: '+0', // À dynamiser plus tard avec historique
            pourcentage: '',
            tendance: 'stable',
            icone: Building2,
        },
        {
            id: 'proprietaires',
            titre: 'Propriétaires',
            valeur: principales.total_proprietaires,
            evolution: '+0',
            pourcentage: '',
            tendance: 'stable',
            icone: Users,
        },
        {
            id: 'locataires',
            titre: 'Locataires Actifs',
            valeur: principales.total_locataires_actifs,
            evolution: '+0',
            pourcentage: '',
            tendance: 'stable',
            icone: UserCheck,
        },
        {
            id: 'contrats',
            titre: 'Contrats en Cours',
            valeur: principales.contrats_actifs,
            evolution: 'Activés',
            pourcentage: 'Actif',
            tendance: 'stable',
            icone: FileText,
        },
    ];

    const obtenirIconeStatut = (statut) => {
        switch (statut) {
            case 'succes': return <CheckCircle2 size={16} />;
            case 'avertissement': return <AlertCircle size={16} />;
            case 'info': return <Clock size={16} />;
            default: return null;
        }
    };

    return (
        <>
            <EnTete titre="Tableau de bord" />

            <div className="tableau-de-bord">
                {/* Statistiques principales */}
                <div className="stats-grille">
                    {statistiques.map((stat) => (
                        <div key={stat.id} className="stat-carte">
                            <div className="stat-carte__contenu">
                                <div className="stat-carte__entete">
                                    <span className="stat-carte__titre">{stat.titre}</span>
                                    <div className="stat-carte__icone">
                                        <stat.icone size={20} />
                                    </div>
                                </div>
                                <div className="stat-carte__valeur">{stat.valeur}</div>
                                <div className="stat-carte__pied">
                                    <span className={`stat-carte__evolution stat-carte__evolution--${stat.tendance}`}>
                                        {stat.tendance === 'hausse' && <TrendingUp size={14} />}
                                        {stat.tendance === 'baisse' && <TrendingDown size={14} />}
                                        {stat.evolution}
                                    </span>
                                    <span className="stat-carte__pourcentage">{stat.pourcentage}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Revenus et activités */}
                <div className="contenu-grille">
                    {/* Revenus du mois */}
                    <div className="carte">
                        <div className="carte__entete">
                            <h3 className="carte__titre">Revenus du Mois</h3>
                            <span className="badge badge--info">{financier.mois}</span>
                        </div>
                        <div className="carte__corps">
                            <div className="revenus">
                                <div className="revenus__montant-principal">
                                    <span className="revenus__label">Reçu</span>
                                    <span className="revenus__valeur">{formaterMontant(financier.recu)}</span>
                                </div>

                                <div className="revenus__barre">
                                    <div
                                        className="revenus__barre-remplie"
                                        style={{ width: `${financier.tauxRecouvrement}%` }}
                                    />
                                </div>

                                <div className="revenus__details">
                                    <div className="revenus__item">
                                        <span className="revenus__item-label">Attendu</span>
                                        <span className="revenus__item-valeur">{formaterMontant(financier.attendu)}</span>
                                    </div>
                                    <div className="revenus__item">
                                        <span className="revenus__item-label">En attente</span>
                                        <span className="revenus__item-valeur revenus__item-valeur--attente">
                                            {formaterMontant(financier.enAttente)}
                                        </span>
                                    </div>
                                    <div className="revenus__item">
                                        <span className="revenus__item-label">Taux</span>
                                        <span className="revenus__item-valeur revenus__item-valeur--taux">
                                            {financier.tauxRecouvrement}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activités récentes */}
                    <div className="carte">
                        <div className="carte__entete">
                            <h3 className="carte__titre">Activités Récentes</h3>
                            <button className="bouton bouton--petit bouton--fantome">Voir tout</button>
                        </div>
                        <div className="carte__corps" style={{ padding: 0 }}>
                            <div className="activites">
                                {activitesRecentes.length > 0 ? activitesRecentes.map((activite, index) => (
                                    <div key={index} className="activite">
                                        <div className={`activite__icone activite__icone--${activite.statut}`}>
                                            {obtenirIconeStatut(activite.statut)}
                                        </div>
                                        <div className="activite__contenu">
                                            <div className="activite__titre">{activite.locataire}</div>
                                            <div className="activite__description">
                                                {activite.montant ? formaterMontant(activite.montant) : activite.action}
                                            </div>
                                        </div>
                                        <div className="activite__date">{activite.date}</div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                        Aucune activité récente.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graphiques */}
                <div className="graphiques-grille">
                    {/* Évolution des revenus */}
                    <div className="carte carte--graphique">
                        <div className="carte__entete">
                            <h3 className="carte__titre">Évolution des Revenus</h3>
                            <div className="legende-graphique">
                                <span className="legende-item">
                                    <span className="legende-point" style={{ backgroundColor: '#C41E3A' }}></span>
                                    Revenus
                                </span>
                                <span className="legende-item">
                                    <span className="legende-point" style={{ backgroundColor: '#1A1A1A' }}></span>
                                    Dépenses
                                </span>
                            </div>
                        </div>
                        <div className="carte__corps">
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={graphiques.revenusMois}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
                                    <XAxis
                                        dataKey="mois"
                                        stroke="#6B6B6B"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#6B6B6B"
                                        style={{ fontSize: '12px' }}
                                        tickFormatter={formaterMontantCourt}
                                    />
                                    <Tooltip
                                        formatter={(value) => formaterMontant(value)}
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #EFEFEF',
                                            borderRadius: '8px',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenus"
                                        stroke="#C41E3A"
                                        strokeWidth={3}
                                        dot={{ fill: '#C41E3A', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="depenses"
                                        stroke="#1A1A1A"
                                        strokeWidth={3}
                                        dot={{ fill: '#1A1A1A', r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Statut des paiements */}
                    <div className="carte carte--graphique">
                        <div className="carte__entete">
                            <h3 className="carte__titre">Statut des Paiements</h3>
                        </div>
                        <div className="carte__corps">
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={graphiques.statutPaiements}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
                                    <XAxis
                                        dataKey="mois"
                                        stroke="#6B6B6B"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        stroke="#6B6B6B"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #EFEFEF',
                                            borderRadius: '8px',
                                            fontSize: '13px'
                                        }}
                                    />
                                    <Bar dataKey="payes" fill="#059669" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="impayes" fill="#DC2626" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Répartition des biens */}
                    <div className="carte carte--graphique-petit">
                        <div className="carte__entete">
                            <h3 className="carte__titre">Répartition des Biens</h3>
                        </div>
                        <div className="carte__corps">
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={graphiques.repartitionBiens}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="valeur"
                                    >
                                        {graphiques.repartitionBiens.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.couleur} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `${value} biens`}
                                        contentStyle={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #EFEFEF',
                                            borderRadius: '8px',
                                            fontSize: '13px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="legende-pie">
                                {graphiques.repartitionBiens.map((item, index) => (
                                    <div key={index} className="legende-pie-item">
                                        <span className="legende-pie-point" style={{ backgroundColor: item.couleur }}></span>
                                        <span className="legende-pie-nom">{item.nom}</span>
                                        <span className="legende-pie-valeur">{item.valeur}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Taux d'occupation par quartier */}
                    <div className="carte carte--graphique-petit">
                        <div className="carte__entete">
                            <h3 className="carte__titre">Taux d'Occupation</h3>
                        </div>
                        <div className="carte__corps">
                            <div className="taux-occupation">
                                {graphiques.tauxOccupation.length > 0 ? graphiques.tauxOccupation.map((quartier, index) => (
                                    <div key={index} className="taux-occupation-item">
                                        <div className="taux-occupation-info">
                                            <span className="taux-occupation-nom">{quartier.quartier}</span>
                                            <span className="taux-occupation-valeur">{quartier.taux}%</span>
                                        </div>
                                        <div className="taux-occupation-barre">
                                            <div
                                                className="taux-occupation-barre-remplie"
                                                style={{
                                                    width: `${quartier.taux}%`,
                                                    backgroundColor: quartier.taux >= 90 ? '#059669' :
                                                        quartier.taux >= 80 ? '#D97706' : '#DC2626'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                                        Aucune donnée géographique.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Biens récents */}
                <div className="carte">
                    <div className="carte__entete">
                        <h3 className="carte__titre">Biens Récents</h3>
                    </div>
                    <div className="carte__corps" style={{ padding: 0 }}>
                        <div className="tableau-conteneur">
                            <table className="tableau">
                                <thead>
                                    <tr>
                                        <th>Bien</th>
                                        <th>Type</th>
                                        <th>Statut</th>
                                        <th className="texte-droite">Loyer/Prix</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {biensRecents.length > 0 ? biensRecents.map((bien, index) => (
                                        <tr key={index}>
                                            <td className="texte-gras">{bien.nom}</td>
                                            <td>{bien.type}</td>
                                            <td>
                                                <span className={`badge ${bien.statut === 'Loué' ? 'badge--succes' : 'badge--neutre'}`}>
                                                    {bien.statut}
                                                </span>
                                            </td>
                                            <td className="texte-droite texte-gras">
                                                {formaterMontant(bien.loyer || bien.prix)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                                Aucun bien enregistré.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
