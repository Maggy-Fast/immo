import { apiClient } from './apiClient';

export const travauxDepensesService = {
  // Récupérer tous les travaux et dépenses
  getTravauxDepenses: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.budgetMin) params.append('budget_min', filters.budgetMin);
      if (filters.budgetMax) params.append('budget_max', filters.budgetMax);
      if (filters.dateDebut) params.append('date_debut', filters.dateDebut);
      if (filters.dateFin) params.append('date_fin', filters.dateFin);
      
      const response = await apiClient.get(`/travaux-depenses?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux et dépenses:', error);
      throw error;
    }
  },

  // Récupérer un travail/dépense par son ID
  getTravailDepenseById: async (id) => {
    try {
      const response = await apiClient.get(`/travaux-depenses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du travail/dépense ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau travail/dépense
  createTravailDepense: async (data) => {
    try {
      const response = await apiClient.post('/travaux-depenses', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du travail/dépense:', error);
      throw error;
    }
  },

  // Mettre à jour un travail/dépense
  updateTravailDepense: async (id, data) => {
    try {
      const response = await apiClient.put(`/travaux-depenses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du travail/dépense ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un travail/dépense
  deleteTravailDepense: async (id) => {
    try {
      await apiClient.delete(`/travaux-depenses/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du travail/dépense ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les statistiques
  getStatistiques: async () => {
    try {
      const response = await apiClient.get('/travaux-depenses/statistiques');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // Récupérer les travaux/dépenses par bien immobilier
  getTravauxDepensesByBien: async (bienId) => {
    try {
      const response = await apiClient.get(`/biens/${bienId}/travaux-depenses`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des travaux/dépenses pour le bien ${bienId}:`, error);
      throw error;
    }
  },

  // Récupérer les travaux/dépenses par zone géographique
  getTravauxDepensesByZone: async (latitude, longitude, rayon = 10) => {
    try {
      const response = await apiClient.get(
        `/travaux-depenses/zone?lat=${latitude}&lng=${longitude}&rayon=${rayon}`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux/dépenses par zone:', error);
      throw error;
    }
  },

  // Exporter les données
  exportData: async (format = 'csv', filters = {}) => {
    try {
      const params = new URLSearchParams({ format });
      
      if (filters.type) params.append('type', filters.type);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.dateDebut) params.append('date_debut', filters.dateDebut);
      if (filters.dateFin) params.append('date_fin', filters.dateFin);
      
      const response = await apiClient.get(`/travaux-depenses/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `travaux-depenses.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error);
      throw error;
    }
  },

  // Importer des données
  importData: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/travaux-depenses/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      throw error;
    }
  }
};
