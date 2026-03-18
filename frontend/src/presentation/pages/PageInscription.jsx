import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { utiliserAuth } from '../../application/contexte/ContexteAuth';
import { Eye, EyeOff, Building2, ArrowRight, User, Mail, Phone, Lock } from 'lucide-react';
import './PageInscription.css';

/**
 * Page Inscription — Design Professionnel
 */
export default function PageInscription() {
    const { inscrire, chargement, erreur, definirErreur } = utiliserAuth();
    const naviguer = useNavigate();

    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        telephone: '',
        motDePasse: '',
        motDePasseConfirmation: '',
    });
    const [afficherMotDePasse, definirAfficherMotDePasse] = useState(false);
    const [afficherConfirmation, definirAfficherConfirmation] = useState(false);

    const gererChangement = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const gererSoumission = async (e) => {
        e.preventDefault();
        definirErreur(null);

        // Validation
        if (formData.motDePasse !== formData.motDePasseConfirmation) {
            definirErreur('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.motDePasse.length < 8) {
            definirErreur('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        try {
            await inscrire(formData);
            naviguer('/');
        } catch {
            // Erreur gérée par le contexte
        }
    };

    return (
        <div className="page-inscription">
            {/* Panneau gauche - Branding */}
            <div className="page-inscription__panneau-gauche">
                <div className="page-inscription__branding">
                    <div className="page-inscription__logo">
                        <img
                            src="/immo4.png"
                            alt="MaggyFast Immo"
                            className="page-inscription__logo-image"
                        />
                    </div>

                    <div className="page-inscription__description">
                        <h1>Commencez à gérer votre patrimoine dès aujourd'hui</h1>
                        <p>Rejoignez des centaines de professionnels qui font confiance à MaggyFast pour gérer leurs biens immobiliers.</p>
                    </div>

                    <div className="page-inscription__features">
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Configuration en 5 minutes</div>
                        </div>
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Essai gratuit de 30 jours</div>
                        </div>
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Support client dédié</div>
                        </div>
                        <div className="feature">
                            <div className="feature__icone">✓</div>
                            <div className="feature__texte">Aucune carte bancaire requise</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panneau droit - Formulaire */}
            <div className="page-inscription__panneau-droit">
                <div className="page-inscription__formulaire-conteneur">
                    <div className="page-inscription__entete">
                        <h2>Créer un compte</h2>
                        <p>Remplissez le formulaire pour commencer</p>
                    </div>

                    {/* Erreur */}
                    {erreur && (
                        <div className="alerte alerte--erreur">
                            {erreur}
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={gererSoumission} className="formulaire-inscription">
                        <div className="champ">
                            <label className="champ__label" htmlFor="nom">
                                Nom complet
                            </label>
                            <div className="champ-avec-icone">
                                <User size={18} className="champ-icone" />
                                <input
                                    id="nom"
                                    name="nom"
                                    type="text"
                                    className="champ__input champ__input--avec-icone"
                                    placeholder="Amadou Diallo"
                                    value={formData.nom}
                                    onChange={gererChangement}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="champ">
                            <label className="champ__label" htmlFor="email">
                                Adresse email
                            </label>
                            <div className="champ-avec-icone">
                                <Mail size={18} className="champ-icone" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="champ__input champ__input--avec-icone"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={gererChangement}
                                    required
                                />
                            </div>
                        </div>

                        <div className="champ">
                            <label className="champ__label" htmlFor="telephone">
                                Téléphone
                            </label>
                            <div className="champ-avec-icone">
                                <Phone size={18} className="champ-icone" />
                                <input
                                    id="telephone"
                                    name="telephone"
                                    type="tel"
                                    className="champ__input champ__input--avec-icone"
                                    placeholder="+221 77 123 45 67"
                                    value={formData.telephone}
                                    onChange={gererChangement}
                                    required
                                />
                            </div>
                        </div>

                        <div className="champ">
                            <label className="champ__label" htmlFor="motDePasse">
                                Mot de passe
                            </label>
                            <div className="champ-mot-de-passe">
                                <div className="champ-avec-icone">
                                    <Lock size={18} className="champ-icone" />
                                    <input
                                        id="motDePasse"
                                        name="motDePasse"
                                        type={afficherMotDePasse ? 'text' : 'password'}
                                        className="champ__input champ__input--avec-icone"
                                        placeholder="••••••••"
                                        value={formData.motDePasse}
                                        onChange={gererChangement}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="champ-mot-de-passe__toggle"
                                    onClick={() => definirAfficherMotDePasse(!afficherMotDePasse)}
                                    tabIndex={-1}
                                >
                                    {afficherMotDePasse ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <span className="champ__aide">Minimum 8 caractères</span>
                        </div>

                        <div className="champ">
                            <label className="champ__label" htmlFor="motDePasseConfirmation">
                                Confirmer le mot de passe
                            </label>
                            <div className="champ-mot-de-passe">
                                <div className="champ-avec-icone">
                                    <Lock size={18} className="champ-icone" />
                                    <input
                                        id="motDePasseConfirmation"
                                        name="motDePasseConfirmation"
                                        type={afficherConfirmation ? 'text' : 'password'}
                                        className="champ__input champ__input--avec-icone"
                                        placeholder="••••••••"
                                        value={formData.motDePasseConfirmation}
                                        onChange={gererChangement}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="champ-mot-de-passe__toggle"
                                    onClick={() => definirAfficherConfirmation(!afficherConfirmation)}
                                    tabIndex={-1}
                                >
                                    {afficherConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bouton bouton--primaire bouton--grand"
                            style={{ width: '100%' }}
                            disabled={chargement}
                        >
                            {chargement ? 'Création du compte en cours...' : 'Créer mon compte'}
                            {!chargement && <ArrowRight size={18} style={{ marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }} />}
                        </button>
                    </form>

                    <p className="page-inscription__conditions">
                        En créant un compte, vous acceptez nos{' '}
                        <a href="#">Conditions d'utilisation</a> et notre{' '}
                        <a href="#">Politique de confidentialité</a>.
                    </p>

                    <p className="page-inscription__pied">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
