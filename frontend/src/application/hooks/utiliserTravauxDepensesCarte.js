import { useState, useEffect, useCallback } from 'react';
import { travauxDepensesService } from '../../infrastructure/api/serviceTravauxDepenses';

export const utiliserTravauxDepensesCarte = () => {
  const [travauxDepenses, setTravauxDepenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    budget: 0,
    enCours: 0,
    termines: 0,
    planifies: 0
  });
  const [filters, setFilters] = useState({
    type: 'tous',
    statut: 'tous',
    budgetMin: 0,
    budgetMax: 100000,
    dateDebut: null,
    dateFin: null
  });

  // Charger les données
  const chargerDonnees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filters.type !== 'tous') params.type = filters.type;
      if (filters.statut !== 'tous') params.statut = filters.statut;
      if (filters.budgetMin > 0) params.budgetMin = filters.budgetMin;
      if (filters.budgetMax < 100000) params.budgetMax = filters.budgetMax;
      if (filters.dateDebut) params.dateDebut = filters.dateDebut;
      if (filters.dateFin) params.dateFin = filters.dateFin;

      const data = await travauxDepensesService.getTravauxDepenses(params);
      setTravauxDepenses(data);
      
      // Calculer les statistiques
      const statsCalculees = {
        total: data.length,
        budget: data.reduce((sum, item) => sum + (item.budget || 0), 0),
        enCours: data.filter(item => item.statut === 'en_cours').length,
        termines: data.filter(item => item.statut === 'termine').length,
        planifies: data.filter(item => item.statut === 'planifie').length
      };
      
      setStats(statsCalculees);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Mettre à jour les filtres
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Réinitialiser les filtres
  const resetFilters = useCallback(() => {
    setFilters({
      type: 'tous',
      statut: 'tous',
      budgetMin: 0,
      budgetMax: 100000,
      dateDebut: null,
      dateFin: null
    });
  }, []);

  // Ajouter un nouveau travail/dépense
  const ajouterTravailDepense = useCallback(async (data) => {
    try {
      const newItem = await travauxDepensesService.createTravailDepense(data);
      setTravauxDepenses(prev => [...prev, newItem]);
      await chargerDonnees(); // Recharger pour mettre à jour les stats
      return newItem;
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      throw err;
    }
  }, [chargerDonnees]);

  // Mettre à jour un travail/dépense
  const modifierTravailDepense = useCallback(async (id, data) => {
    try {
      const updatedItem = await travauxDepensesService.updateTravailDepense(id, data);
      setTravauxDepenses(prev => 
        prev.map(item => item.id === id ? updatedItem : item)
      );
      await chargerDonnees(); // Recharger pour mettre à jour les stats
      return updatedItem;
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      throw err;
    }
  }, [chargerDonnees]);

  // Supprimer un travail/dépense
  const supprimerTravailDepense = useCallback(async (id) => {
    try {
      await travauxDepensesService.deleteTravailDepense(id);
      setTravauxDepenses(prev => prev.filter(item => item.id !== id));
      await chargerDonnees(); // Recharger pour mettre à jour les stats
      return true;
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      throw err;
    }
  }, [chargerDonnees]);

  // Exporter les données
  const exporterDonnees = useCallback(async (format = 'csv') => {
    try {
      const params = {};
      if (filters.type !== 'tous') params.type = filters.type;
      if (filters.statut !== 'tous') params.statut = filters.statut;
      if (filters.dateDebut) params.dateDebut = filters.dateDebut;
      if (filters.dateFin) params.dateFin = filters.dateFin;

      await travauxDepensesService.exportData(format, params);
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      throw err;
    }
  }, [filters]);

  // Importer des données
  const importerDonnees = useCallback(async (file) => {
    try {
      const result = await travauxDepensesService.importData(file);
      await chargerDonnees(); // Recharger pour afficher les nouvelles données
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'import:', err);
      throw err;
    }
  }, [chargerDonnees]);

  // Récupérer les travaux/dépenses par zone géographique
  const getParZone = useCallback(async (latitude, longitude, rayon = 10) => {
    try {
      const data = await travauxDepensesService.getTravauxDepensesByZone(latitude, longitude, rayon);
      return data;
    } catch (err) {
      console.error('Erreur lors de la récupération par zone:', err);
      throw err;
    }
  }, []);

  // Filtrer les données localement (optimisation pour éviter trop d'appels API)
  const donneesFiltrees = travauxDepenses.filter(item => {
    const typeMatch = filters.type === 'tous' || item.type === filters.type;
    const statutMatch = filters.statut === 'tous' || item.statut === filters.statut;
    const budgetMinMatch = !filters.budgetMin || item.budget >= filters.budgetMin;
    const budgetMaxMatch = !filters.budgetMax || item.budget <= filters.budgetMax;
    
    let dateDebutMatch = true;
    let dateFinMatch = true;
    
    if (filters.dateDebut) {
      dateDebutMatch = new Date(item.dateDebut) >= new Date(filters.dateDebut);
    }
    
    if (filters.dateFin) {
      dateFinMatch = new Date(item.dateFin) <= new Date(filters.dateFin);
    }
    
    return typeMatch && statutMatch && budgetMinMatch && budgetMaxMatch && dateDebutMatch && dateFinMatch;
  });

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  return {
    // Données
    travauxDepenses: donneesFiltrees,
    toutesDonnees: travauxDepenses,
    stats,
    loading,
    error,
    filters,
    
    // Actions
    chargerDonnees,
    updateFilters,
    resetFilters,
    ajouterTravailDepense,
    modifierTravailDepense,
    supprimerTravailDepense,
    exporterDonnees,
    importerDonnees,
    getParZone,
    clearError
  };
};
