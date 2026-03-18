import clientHttp from './clientHttp';

/**
 * Service API — Gestion du profil utilisateur
 */
export const serviceUtilisateur = {
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    async obtenirProfil() {
        const reponse = await clientHttp.get('/utilisateur/profil');
        return reponse.data.data;
    },

    /**
     * Mettre à jour le profil
     */
    async mettreAJourProfil(donnees) {
        const reponse = await clientHttp.put('/utilisateur/profil', donnees);
        return reponse.data;
    },

    /**
     * Changer le mot de passe
     */
    async changerMotDePasse(donnees) {
        const reponse = await clientHttp.put('/utilisateur/mot-de-passe', {
            mot_de_passe_actuel: donnees.motDePasseActuel,
            nouveau_mot_de_passe: donnees.nouveauMotDePasse,
            nouveau_mot_de_passe_confirmation: donnees.confirmationMotDePasse,
        });
        return reponse.data;
    },

    /**
     * Obtenir les préférences
     */
    async obtenirPreferences() {
        const reponse = await clientHttp.get('/utilisateur/preferences');
        return reponse.data.data;
    },

    /**
     * Mettre à jour les préférences
     */
    async mettreAJourPreferences(donnees) {
        const reponse = await clientHttp.put('/utilisateur/preferences', donnees);
        return reponse.data;
    },
};

/**
 * Service API — Informations système
 */
export const serviceSysteme = {
    /**
     * Obtenir les informations système
     */
    async obtenirInformations() {
        const reponse = await clientHttp.get('/systeme/informations');
        return reponse.data.data;
    },

    /**
     * Vider le cache
     */
    async viderCache() {
        const reponse = await clientHttp.post('/systeme/vider-cache');
        return reponse.data;
    },

    /**
     * Exporter les données
     */
    async exporterDonnees() {
        const reponse = await clientHttp.get('/systeme/exporter-donnees', {
            responseType: 'blob',
        });
        
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(new Blob([reponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `export_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Export téléchargé avec succès' };
    },

    /**
     * Obtenir les logs système
     */
    async obtenirLogs() {
        const reponse = await clientHttp.get('/systeme/logs');
        return reponse.data.data;
    },

    /**
     * Sauvegarder la base de données
     */
    async sauvegarderBase() {
        const reponse = await clientHttp.get('/systeme/sauvegarder-base', {
            responseType: 'blob',
        });
        
        // Créer un lien de téléchargement
        const url = window.URL.createObjectURL(new Blob([reponse.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `backup_${new Date().toISOString().split('T')[0]}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Backup téléchargé avec succès' };
    },
};
