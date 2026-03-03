import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { serviceAuth } from '../../infrastructure/api/serviceAuth';
import { Utilisateur } from '../../domaine/entites/Utilisateur';

const ContexteAuth = createContext(null);

/**
 * Fournisseur Auth — Gère l'état d'authentification global
 */
export function FournisseurAuth({ children }) {
    const [utilisateur, definirUtilisateur] = useState(null);
    const [chargement, definirChargement] = useState(true);
    const [erreur, definirErreur] = useState(null);

    useEffect(() => {
        const tokenSauvegarde = localStorage.getItem('token');
        const utilisateurSauvegarde = localStorage.getItem('utilisateur');

        if (tokenSauvegarde && utilisateurSauvegarde) {
            try {
                const donnees = JSON.parse(utilisateurSauvegarde);
                definirUtilisateur(new Utilisateur(donnees));
            } catch {
                localStorage.removeItem('token');
                localStorage.removeItem('utilisateur');
            }
        }
        definirChargement(false);
    }, []);

    const connecter = useCallback(async (email, motDePasse) => {
        definirErreur(null);
        definirChargement(true);
        try {
            const reponse = await serviceAuth.connexion(email, motDePasse);
            const nouvelUtilisateur = new Utilisateur(reponse.utilisateur);

            localStorage.setItem('token', reponse.token);
            localStorage.setItem('utilisateur', JSON.stringify(reponse.utilisateur));
            definirUtilisateur(nouvelUtilisateur);

            return nouvelUtilisateur;
        } catch (err) {
            const message = err.response?.data?.message || 'Erreur de connexion';
            definirErreur(message);
            throw err;
        } finally {
            definirChargement(false);
        }
    }, []);

    const inscrire = useCallback(async (donnees) => {
        definirErreur(null);
        definirChargement(true);
        try {
            const reponse = await serviceAuth.inscription(donnees);
            const nouvelUtilisateur = new Utilisateur(reponse.utilisateur);

            localStorage.setItem('token', reponse.token);
            localStorage.setItem('utilisateur', JSON.stringify(reponse.utilisateur));
            definirUtilisateur(nouvelUtilisateur);

            return nouvelUtilisateur;
        } catch (err) {
            const message = err.response?.data?.message || "Erreur d'inscription";
            definirErreur(message);
            throw err;
        } finally {
            definirChargement(false);
        }
    }, []);

    const deconnecter = useCallback(async () => {
        try {
            await serviceAuth.deconnexion();
        } catch {
            // Ignorer les erreurs de déconnexion
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('utilisateur');
            definirUtilisateur(null);
        }
    }, []);

    const estConnecte = utilisateur !== null;

    const valeur = {
        utilisateur,
        chargement,
        erreur,
        estConnecte,
        connecter,
        inscrire,
        deconnecter,
        definirErreur,
    };

    return (
        <ContexteAuth.Provider value={valeur}>
            {children}
        </ContexteAuth.Provider>
    );
}

/**
 * Hook — Accéder au contexte d'authentification
 */
export function utiliserAuth() {
    const contexte = useContext(ContexteAuth);
    if (!contexte) {
        throw new Error('utiliserAuth doit être utilisé dans un FournisseurAuth');
    }
    return contexte;
}
