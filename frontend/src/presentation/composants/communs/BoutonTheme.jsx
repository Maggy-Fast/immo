import { Moon, Sun } from 'lucide-react';
import { utiliserTheme } from '../../../application/hooks/utiliserTheme';
import './BoutonTheme.css';

/**
 * Bouton pour basculer entre mode clair et sombre
 */
export default function BoutonTheme() {
    const { theme, basculerTheme } = utiliserTheme();

    return (
        <button
            className="bouton-theme"
            onClick={basculerTheme}
            title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
            aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
        >
            {theme === 'light' ? (
                <Moon size={18} />
            ) : (
                <Sun size={18} />
            )}
        </button>
    );
}
