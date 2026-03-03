import { Building2, Users, UserCheck, FileText, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import EnTete from '../composants/communs/EnTete';
import './PageTableauDeBord.css';

/**
 * Page Tableau de Bord — Vue d'ensemble professionnelle
 */
export default function PageTableauDeBord() {
    const statistiques = [
        {
            id: 'biens',
            titre: 'Total Biens',
            valeur: '48',
            evolution: '+3',
            pourcentage: '+6.7%',
            tendance: 'hausse',
            icone: Building2,
        },
        {
            id: 'proprietaires',
            titre: 'Propriétaires',
            valeur: '15',
            evolution: '+1',
            pourcentage: '+7.1%',
            tendance: 'hausse',
            icone: Users,
        },
        {
            id: 'locataires',
            titre: 'Locataires Actifs',
            valeur: '32',
            evolution: '+2',
            pourcentage: '+6.7%',
            tendance: 'hausse',
            icone: UserCheck,
        },
        {
            id: 'contrats',
            titre: 'Contrats en Cours',
            valeur: '28',
            evolution: '87.5%',
            pourcentage: 'Taux occupation',
            tendance: 'stable',
            icone: FileText,
        },
    ];

    const loyersDuMois = {
        attendu: 4800000,
        recu: 3600000,
        enAttente: 1200000,
        tauxRecouvrement: 75,
    };

    // Données pour le graphique des revenus mensuels
    const donneesRevenus = [
        { mois: 'Août', revenus: 3200000, depenses: 800000 },
        { mois: 'Sept', revenus: 3500000, depenses: 900000 },
        { mois: 'Oct', revenus: 3800000, depenses: 850000 },
        { mois: 'Nov', revenus: 4200000, depenses: 950000 },
        { mois: 'Déc', revenus: 4500000, depenses: 1100000 },
        { mois: 'Jan', revenus: 4300000, depenses: 1000000 },
        { mois: 'Fév', revenus: 3600000, depenses: 900000 },
    ];

    // Données pour le graphique des paiements
    const donneesPaiements = [
        { mois: 'Août', payes: 28, impayes: 4 },
        { mois: 'Sept', payes: 30, impayes: 2 },
        { mois: 'Oct', payes: 29, impayes: 3 },
        { mois: 'Nov', payes: 31, impayes: 1 },
        { mois: 'Déc', payes: 30, impayes: 2 },
        { mois: 'Jan', payes: 28, impayes: 4 },
        { mois: 'Fév', payes: 24, impayes: 8 },
    ];

    // Données pour le graphique circulaire des types de biens
    const donneesTypesBiens = [
        { nom: 'Appartements', valeur: 22, couleur: '#C41E3A' },
        { nom: 'Maisons', valeur: 12, couleur: '#1A1A1A' },
        { nom: 'Commerces', valeur: 8, couleur: '#059669' },
        { nom: 'Terrains', valeur: 6, couleur: '#D97706' },
    ];

    // Données pour le taux d'occupation par quartier
    const donneesQuartiers = [
        { quartier: 'Almadies', taux: 95 },
        { quartier: 'Mermoz', taux: 88 },
        { quartier: 'Plateau', taux: 92 },
        { quartier: 'Médina', taux: 78 },
        { quartier: 'HLM', taux: 85 },
    ];

    const activitesRecentes = [
        { type: 'paiement', locataire: 'Fatou Diop', montant: 150000, date: 'Il y a 2h', statut: 'succes' },
        { type: 'contrat', locataire: 'Moussa Ba', action: 'Nouveau contrat signé', date: 'Il y a 5h', statut: 'info' },
        { type: 'retard', locataire: 'Awa Ndiaye', montant: 200000, date: 'Il y a 1j', statut: 'avertissement' },
        { type: 'paiement', locataire: 'Ibrahima Sarr', montant: 250000, date: 'Il y a 1j', statut: 'succes' },
    ];

    const biensRecents = [
        { nom: 'Appartement Almadies', type: 'Appartement', statut: 'Loué', loyer: 350000 },
        { nom: 'Villa Mermoz', type: 'Maison', statut: 'Disponible', prix: 500000 },
        { nom: 'Commerce Plateau', type: 'Commerce', statut: 'Loué', loyer: 450000 },
        { nom: 'Studio Médina', type: 'Studio', statut: 'Loué', loyer: 120000 },
    ];

    const formaterMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
    };

    const formaterMontantCourt = (montant) => {
        if (montant >= 1000000) {
            return (montant / 1000000).toFixed(1) + 'M';
        }
        return (montant / 1000).toFixed(0) + 'K';
    };

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
                            <span className="badge badge--info">Février 2026</span>
                        </div>
                        <div className="carte__corps">
                            <div className="revenus">
                                <div className="revenus__montant-principal">
                                    <span className="revenus__label">Reçu</span>
                                    <span className="revenus__valeur">{formaterMontant(loyersDuMois.recu)}</span>
                                </div>
                                
                                <div className="revenus__barre">
                                    <div 
                                        className="revenus__barre-remplie" 
                                        style={{ width: `${loyersDuMois.tauxRecouvrement}%` }}
                                    />
                                </div>
                                
                                <div className="revenus__details">
                                    <div className="revenus__item">
                                        <span className="revenus__item-label">Attendu</span>
                                        <span className="revenus__item-valeur">{formaterMontant(loyersDuMois.attendu)}</span>
                                    </div>
                                    <div className="revenus__item">
                                        <span className="revenus__item-label">En attente</span>
                                        <span className="revenus__item-valeur revenus__item-valeur--attente">
                                            {formaterMontant(loyersDuMois.enAttente)}
                                        </span>
                                    </div>
                                    <div className="revenus__item">
                                        <span className="revenus__item-label">Taux</span>
                                        <span className="revenus__item-valeur revenus__item-valeur--taux">
                                            {loyersDuMois.tauxRecouvrement}%
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
                                {activitesRecentes.map((activite, index) => (
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
                                ))}
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
                                <LineChart data={donneesRevenus}>
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
                                <BarChart data={donneesPaiements}>
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
                                        data={donneesTypesBiens}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="valeur"
                                    >
                                        {donneesTypesBiens.map((entry, index) => (
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
                                {donneesTypesBiens.map((item, index) => (
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
                            <span className="badge badge--succes">87.5%</span>
                        </div>
                        <div className="carte__corps">
                            <div className="taux-occupation">
                                {donneesQuartiers.map((quartier, index) => (
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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Biens récents */}
                <div className="carte">
                    <div className="carte__entete">
                        <h3 className="carte__titre">Biens Récents</h3>
                        <button className="bouton bouton--petit bouton--contour">Ajouter un bien</button>
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
                                    {biensRecents.map((bien, index) => (
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
