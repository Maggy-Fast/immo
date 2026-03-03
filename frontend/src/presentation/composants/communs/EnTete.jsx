import { Bell, Search, HelpCircle } from 'lucide-react';
import { utiliserAuth } from '../../../application/contexte/ContexteAuth';
import BoutonTheme from './BoutonTheme';
import './EnTete.css';

/**
 * En-tête — Design professionnel minimaliste
 */
export default function EnTete({ titre }) {
    const { utilisateur } = utiliserAuth();

    return (
        <header className="entete">
            <h1 className="entete__titre">{titre}</h1>
            
            <div className="entete__actions">
                <div className="entete__recherche">
                    <Search size={16} className="entete__recherche-icone" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="entete__recherche-input"
                    />
                </div>
                
                <BoutonTheme />
                
                <button className="entete__bouton-icone" title="Aide">
                    <HelpCircle size={20} />
                </button>
                
                <button className="entete__bouton-icone" title="Notifications">
                    <Bell size={20} />
                    <span className="entete__badge-notification" />
                </button>
            </div>
        </header>
    );
}
