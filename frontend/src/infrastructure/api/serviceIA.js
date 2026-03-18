import clientHttp from './clientHttp';

/**
 * Service pour interagir avec l'Assistant IA
 */
export const serviceIA = {
    /**
     * Envoyer un message à l'assistant
     * @param {Array} messages - Historique des messages [{role: 'user', content: '...'}, ...]
     */
    chat: async (messages) => {
        try {
            const reponse = await clientHttp.post('/ia/chat', { messages });
            return reponse.data;
        } catch (erreur) {
            console.error('Erreur ServiceIA:', erreur);
            throw erreur;
        }
    }
};
