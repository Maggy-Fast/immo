import { useState, useEffect } from 'react';

/**
 * Hook pour gérer le thème (clair/sombre)
 */
export function utiliserTheme() {
    const [theme, setTheme] = useState(() => {
        // Récupérer le thème sauvegardé ou utiliser la préférence système
        const themeSauvegarde = localStorage.getItem('theme');
        if (themeSauvegarde) {
            return themeSauvegarde;
        }
        
        // Vérifier la préférence système
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    });

    useEffect(() => {
        // Appliquer le thème au document
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const basculerTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const definirTheme = (nouveauTheme) => {
        if (nouveauTheme === 'light' || nouveauTheme === 'dark') {
            setTheme(nouveauTheme);
        }
    };

    return {
        theme,
        estSombre: theme === 'dark',
        basculerTheme,
        definirTheme,
    };
}
