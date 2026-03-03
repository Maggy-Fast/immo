import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { utiliserAuth } from '../../application/contexte/ContexteAuth';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import './PageConnexion.css';

/**
 * Page Connexion — Design Professionnel
 */
export default function PageConnexion() {
    const { connecter, chargement, erreur, definirErreur } = utiliserAuth();
    const naviguer = useNavigate();

    const [email, definirEmail] = useState('');
    const [motDePasse, definirMotDePasse] = useState('');
    const [afficherMotDePasse, definirAfficherMotDePasse] = useState(false);

    const gererSoumission = async (e) => {
        e.preventDefault();
        definirErreur(null);

        try {
            await connecter(email, motDePasse);
            naviguer('/');
        } catch {
            // Erreur gérée par le contexte
        }
    };

    return (
        <div className="page-connexion">
            {/* Panneau gauche - Branding */}
            <div className="page-connexion__panneau-gauche">
                <div className="page-connexion__branding">
                    <div className="page-connexion__logo">
                        <img 
                            src="/immo1.png" 
                            alt="MaggyFast Immo" 
                            className="page-connexion__logo-image"
                        />
                    </div>
                    
                    <div className="page-connexion__description">
                        <h1>Gérez votre patrimoine immobilier en toute simplicité</h1>
                        <p>Solution professionnelle pour la gestion de biens, locataires, contrats et paiements.</p>
                    </div>
                    
                    <div className="page-connexion__features">
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Gestion multi-propriétés</div>
                        </div>
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Suivi des paiements en temps réel</div>
                        </div>
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Génération automatique de documents</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panneau droit - Formulaire */}
            <div className="page-connexion__panneau-droit">
                <div className="page-connexion__formulaire-conteneur">
                    <div className="page-connexion__entete">
                        <h2>Connexion</h2>
                        <p>Accédez à votre espace de gestion</p>
                    </div>

                    {/* Erreur */}
                    {erreur && (
                        <div className="alerte alerte--erreur">
                            {erreur}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={gererSoumission} className="formulaire-connexion">
                        <div className="champ">
                            <label className="champ__label" htmlFor="email">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="champ__input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => definirEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="champ">
                            <label className="champ__label" htmlFor="motDePasse">
                                Mot de passe
                            </label>
                            <div className="champ-mot-de-passe">
                                <input
                                    id="motDePasse"
                                    type={afficherMotDePasse ? 'text' : 'password'}
                                    className="champ__input"
                                    placeholder="••••••••"
                                    value={motDePasse}
                                    onChange={(e) => definirMotDePasse(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="champ-mot-de-passe__toggle"
                                    onClick={() => definirAfficherMotDePasse(!afficherMotDePasse)}
                                    tabIndex={-1}
                                >
                                    {afficherMotDePasse ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bouton bouton--primaire bouton--grand"
                            style={{ width: '100%' }}
                            disabled={chargement}
                        >
                            {chargement ? 'Connexion...' : (
                                <>
                                    Se connecter
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bouton démo */}
                    <div className="page-connexion__demo">
                        <div className="separateur">
                            <span>ou</span>
                        </div>
                        <button
                            type="button"
                            className="bouton bouton--contour"
                            style={{ width: '100%' }}
                            onClick={() => {
                                localStorage.setItem('token', 'demo-token');
                                localStorage.setItem('utilisateur', JSON.stringify({
                                    id: 1,
                                    nom: 'Amadou Diallo',
                                    email: 'admin@maggyfast.com',
                                    role: 'admin',
                                    telephone: '+221771234567',
                                    idTenant: 1,
                                }));
                                window.location.href = '/';
                            }}
                        >
                            Accès Démo
                        </button>
                    </div>

                    <p className="page-connexion__pied">
                        Pas encore de compte ?{' '}
                        <Link to="/inscription">Créer un compte</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
