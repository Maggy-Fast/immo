import clientHttp from './clientHttp';

/**
 * Service Auth — Appels API authentification
 */
export const serviceAuth = {
    async connexion(email, motDePasse) {
        const reponse = await clientHttp.post('/auth/connexion', {
            email,
            password: motDePasse,
        });
        return reponse.data;
    },

    async inscription(donnees) {
        const reponse = await clientHttp.post('/auth/inscription', {
            nom: donnees.nom,
            email: donnees.email,
            mot_de_passe: donnees.motDePasse,
            mot_de_passe_confirmation: donnees.motDePasseConfirmation,
            telephone: donnees.telephone,
        });
        return reponse.data;
    },

    async deconnexion() {
        await clientHttp.post('/auth/deconnexion');
    },

    async obtenirProfil() {
        const reponse = await clientHttp.get('/auth/profil');
        return reponse.data;
    },
};
