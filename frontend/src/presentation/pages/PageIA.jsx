import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { serviceIA } from '../../infrastructure/api/serviceIA';
import ModaleConfirmation from '../composants/communs/ModaleConfirmation';
import './PageIA.css';

/**
 * Page de l'Assistant IA
 */
export default function PageIA() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant MaggyFast/Imo. Comment puis-je vous aider dans la gestion de vos biens immobiliers ou de votre coopérative aujourd\'hui ?'
        }
    ]);
    const [input, setInput] = useState('');
    const [chargement, setChargement] = useState(false);
    const [copieId, setCopieId] = useState(null);
    const [modalViderOuverte, setModalViderOuverte] = useState(false);
    const messagesFinRef = useRef(null);

    // Auto-scroll vers le bas
    const scrollToBottom = () => {
        messagesFinRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, chargement]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || chargement) return;

        const nouveauMessage = { role: 'user', content: input };
        const historique = [...messages, nouveauMessage];

        setMessages(historique);
        setInput('');
        setChargement(true);

        try {
            // On ne garde que role et content pour l'API
            const messagesAPI = historique.map(({ role, content }) => ({ role, content }));
            const reponse = await serviceIA.chat(messagesAPI);

            setMessages(prev => [...prev, { role: 'assistant', content: reponse.message }]);
        } catch (erreur) {
            console.error('Erreur chat:', erreur);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Désolé, j\'ai rencontré une erreur technique. Veuillez vérifier votre connexion ou votre clé API Anthropic.',
                erreur: true
            }]);
        } finally {
            setChargement(false);
        }
    };

    const viderConversation = () => {
        setMessages([{
            role: 'assistant',
            content: 'Bonjour ! Je suis votre assistant MaggyFast/Imo. Comment puis-je vous aider aujourd\'hui ?'
        }]);
        setModalViderOuverte(false);
    };

    const copierTexte = (texte, index) => {
        navigator.clipboard.writeText(texte);
        setCopieId(index);
        setTimeout(() => setCopieId(null), 2000);
    };

    return (
        <div className="page-ia">
            {/* En-tête */}
            <div className="page-ia__entete">
                <div className="page-ia__entete-info">
                    <div className="page-ia__icone">
                        <Sparkles size={28} />
                    </div>
                    <div>
                        <h1 className="page-ia__titre">Assistant IA Imo</h1>
                        <p className="page-ia__description">
                            Intelligence Artificielle spécialisée dans l'immobilier au Sénégal
                        </p>
                    </div>
                </div>
                <button className="bouton bouton--fantome" onClick={() => setModalViderOuverte(true)} title="Vider le chat">
                    <Trash2 size={20} />
                </button>
            </div>

            {/* Zone de chat */}
            <div className="page-ia__chat">
                <div className="page-ia__messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message message--${msg.role} ${msg.erreur ? 'message--erreur' : ''}`}>
                            <div className="message__avatar">
                                {msg.role === 'assistant' ? <Bot size={22} /> : <User size={22} />}
                            </div>
                            <div className="message__contenu">
                                <div className="message__texte">{msg.content}</div>
                                {msg.role === 'assistant' && !msg.erreur && (
                                    <button
                                        className="message__copie"
                                        onClick={() => copierTexte(msg.content, index)}
                                        title="Copier"
                                    >
                                        {copieId === index ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {chargement && (
                        <div className="message message--assistant">
                            <div className="message__avatar">
                                <Bot size={22} />
                            </div>
                            <div className="page-ia__bulle-chargement">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesFinRef} />
                </div>

                {/* Champ de saisie flottant */}
                <form className="page-ia__formulaire" onSubmit={handleSend}>
                    <div className="page-ia__input-container">
                        <input
                            type="text"
                            className="page-ia__input"
                            placeholder="Posez votre question à l'intelligence MaggyFast..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={chargement}
                        />
                    </div>
                    <button
                        type="submit"
                        className="page-ia__envoyer"
                        disabled={!input.trim() || chargement}
                        title="Envoyer le message"
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>

            {/* Suggestions en mode Cartes Premium */}
            <div className="page-ia__suggestions">
                <button 
                  className="suggestion-card" 
                  onClick={() => setInput("Quelles sont les conditions d'attribution d'une parcelle ?")}
                >
                    <div className="suggestion-card__icone">🏠</div>
                    <span className="suggestion-card__texte">Conditions d'attribution</span>
                </button>
                <button 
                  className="suggestion-card" 
                  onClick={() => setInput("Aide-moi à rédiger une quittance de loyer")}
                >
                    <div className="suggestion-card__icone">📄</div>
                    <span className="suggestion-card__texte">Modèle de quittance</span>
                </button>
                <button 
                  className="suggestion-card" 
                  onClick={() => setInput("Quels sont les frais de notaire au Sénégal ?")}
                >
                    <div className="suggestion-card__icone">⚖️</div>
                    <span className="suggestion-card__texte">Frais de notaire</span>
                </button>
            </div>

            {/* Modale Confirmation */}
            <ModaleConfirmation
                ouverte={modalViderOuverte}
                titre="Vider la conversation"
                message="Voulez-vous vraiment effacer tout l'historique de cette discussion ?"
                surConfirmer={viderConversation}
                surAnnuler={() => setModalViderOuverte(false)}
            />
        </div>
    );
}
