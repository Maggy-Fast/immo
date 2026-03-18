import axios from 'axios';

const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/connexion';
        }
        return Promise.reject(error);
      }
    );
  }

  // Biens
  async getBiens(filtres = {}) {
    try {
      const response = await this.client.get('/biens', { params: filtres });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des biens:', error);
      throw error;
    }
  }

  async getBien(id) {
    try {
      const response = await this.client.get(`/biens/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du bien:', error);
      throw error;
    }
  }

  // Travaux
  async getTravaux(filtres = {}) {
    try {
      const response = await this.client.get('/travaux', { params: filtres });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
      throw error;
    }
  }

  async getTravail(id) {
    try {
      const response = await this.client.get(`/travaux/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du travail:', error);
      throw error;
    }
  }

  // Dépenses
  async getDepenses(filtres = {}) {
    try {
      const response = await this.client.get('/depenses', { params: filtres });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      throw error;
    }
  }

  async getDepense(id) {
    try {
      const response = await this.client.get(`/depenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la dépense:', error);
      throw error;
    }
  }

  // Lotissements
  async getLotissements(filtres = {}) {
    try {
      const response = await this.client.get('/lotissements', { params: filtres });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lotissements:', error);
      throw error;
    }
  }

  async getLotissement(id) {
    try {
      const response = await this.client.get(`/lotissements/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du lotissement:', error);
      throw error;
    }
  }

  // Partenariats
  async getPartenariats(filtres = {}) {
    try {
      const response = await this.client.get('/partenariats', { params: filtres });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des partenariats:', error);
      throw error;
    }
  }

  async getPartenariat(id) {
    try {
      const response = await this.client.get(`/partenariats/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du partenariat:', error);
      throw error;
    }
  }

  async getPartenariatRepartition(id) {
    try {
      const response = await this.client.get(`/partenariats/${id}/calculer-repartition`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du calcul de la répartition:', error);
      throw error;
    }
  }

  // Statistiques pour la carte (Optimisé : un seul appel)
  async getStatistiquesCarte() {
    try {
      const response = await this.client.get('/tableau-bord/carte');
      const donnees = response.data;

      return {
        biens: donnees.biens || [],
        travaux: donnees.travaux || [],
        depenses: donnees.depenses || [],
        lotissements: donnees.lotissements || [],
        partenariats: donnees.partenariats || [],
        parcellesCooperative: donnees.parcelles_cooperative || [],
        meta: {
          totalBiens: (donnees.biens || []).length,
          totalTravaux: (donnees.travaux || []).length,
          totalDepenses: (donnees.depenses || []).length,
          totalLotissements: (donnees.lotissements || []).length,
          totalPartenariats: (donnees.partenariats || []).length,
          totalParcellesCooperative: (donnees.parcelles_cooperative || []).length,
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de la carte:', error);
      throw error;
    }
  }
}

export default new ApiService();
