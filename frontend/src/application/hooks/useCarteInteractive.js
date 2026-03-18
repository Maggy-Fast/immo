import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export const useCarteInteractive = () => {
  const [travaux, setTravaux] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [biens, setBiens] = useState([]);
  const [lotissements, setLotissements] = useState([]);
  const [partenariats, setPartenariats] = useState([]);
  const [parcellesCooperative, setParcellesCooperative] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('tous');
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 100000 });
  const [stats, setStats] = useState({
    total: 0,
    budgetTotal: 0,
    enCours: 0,
    travauxCount: 0,
    depensesCount: 0,
    lotissementsCount: 0,
    partenariatsCount: 0,
    parcellesCooperativeCount: 0,
    sansCoordonnees: 0
  });

  // Transformer les données pour la carte
  const transformerDonneesCarte = useCallback((donneesTravaux, donneesDepenses, donneesBiens, donneesLotissements, donneesPartenariats, donneesParcellesCoop) => {
    const pointsCarte = [];
    const donneesSansCoordonnees = [];

    // Ajouter les travaux avec coordonnées
    donneesTravaux.forEach(travail => {
      if (travail.bien && travail.bien.latitude && travail.bien.longitude) {
        pointsCarte.push({
          id: `travail-${travail.id}`,
          titre: travail.intitule,
          type: 'travaux',
          statut: travail.statut,
          budget: travail.montant_estime || 0,
          coordonnees: [travail.bien.latitude, travail.bien.longitude],
          adresse: travail.bien.adresse || 'Adresse non spécifiée',
          description: travail.description || '',
          dateDebut: travail.date_debut,
          dateFin: travail.date_fin,
          bienId: travail.bien.id,
          bienType: travail.bien.type,
          idOriginal: travail.id
        });
      } else {
        donneesSansCoordonnees.push({
          id: `travail-${travail.id}`,
          titre: travail.intitule,
          type: 'travaux',
          statut: travail.statut,
          budget: travail.montant_estime || 0,
          adresse: travail.bien?.adresse || 'Adresse non spécifiée',
          description: travail.description || '',
          dateDebut: travail.date_debut,
          dateFin: travail.date_fin,
          bienType: travail.bien?.type,
          idOriginal: travail.id,
          raison: 'Coordonnées GPS manquantes'
        });
      }
    });

    // Ajouter les parcelles coopérative (si coordonnées présentes)
    (donneesParcellesCoop || []).forEach((parcelle) => {
      if (parcelle.latitude && parcelle.longitude) {
        pointsCarte.push({
          id: `parcelle-coop-${parcelle.id}`,
          titre: `Parcelle ${parcelle.numero}`,
          type: 'parcelles_cooperative',
          statut: parcelle.statut,
          budget: parcelle.prix || 0,
          coordonnees: [parcelle.latitude, parcelle.longitude],
          adresse: parcelle.description || 'Parcelle coopérative',
          description: parcelle.description || '',
          numero: parcelle.numero,
          surface: parcelle.surface,
          groupeNom: parcelle.groupe?.nom,
          adherentNom: parcelle.adherent ? `${parcelle.adherent.prenom} ${parcelle.adherent.nom}` : null,
          idOriginal: parcelle.id,
        });
      } else {
        donneesSansCoordonnees.push({
          id: `parcelle-coop-${parcelle.id}`,
          titre: `Parcelle ${parcelle.numero}`,
          type: 'parcelles_cooperative',
          statut: parcelle.statut,
          budget: parcelle.prix || 0,
          adresse: parcelle.description || 'Parcelle coopérative',
          description: parcelle.description || '',
          numero: parcelle.numero,
          surface: parcelle.surface,
          groupeNom: parcelle.groupe?.nom,
          adherentNom: parcelle.adherent ? `${parcelle.adherent.prenom} ${parcelle.adherent.nom}` : null,
          idOriginal: parcelle.id,
          raison: 'Coordonnées GPS manquantes'
        });
      }
    });

    // Ajouter les dépenses avec coordonnées
    donneesDepenses.forEach(depense => {
      if (depense.bien && depense.bien.latitude && depense.bien.longitude) {
        pointsCarte.push({
          id: `depense-${depense.id}`,
          titre: depense.intitule,
          type: 'depenses',
          statut: depense.statut_paiement === 'paye' ? 'termine' :
            depense.statut_paiement === 'en_attente' ? 'en_cours' : 'planifie',
          budget: depense.montant || 0,
          coordonnees: [depense.bien.latitude, depense.bien.longitude],
          adresse: depense.bien.adresse || 'Adresse non spécifiée',
          description: depense.description || '',
          dateDebut: depense.date_depense,
          dateFin: depense.date_depense,
          bienId: depense.bien.id,
          bienType: depense.bien.type,
          typeDepense: depense.type_depense,
          idOriginal: depense.id
        });
      } else {
        donneesSansCoordonnees.push({
          id: `depense-${depense.id}`,
          titre: depense.intitule,
          type: 'depenses',
          statut: depense.statut_paiement === 'paye' ? 'termine' :
            depense.statut_paiement === 'en_attente' ? 'en_cours' : 'planifie',
          budget: depense.montant || 0,
          adresse: depense.bien?.adresse || 'Adresse non spécifiée',
          description: depense.description || '',
          dateDebut: depense.date_depense,
          dateFin: depense.date_depense,
          bienType: depense.bien?.type,
          typeDepense: depense.type_depense,
          idOriginal: depense.id,
          raison: 'Coordonnées GPS manquantes'
        });
      }
    });

    // Ajouter les biens avec coordonnées
    donneesBiens.forEach(bien => {
      if (bien.latitude && bien.longitude) {
        pointsCarte.push({
          id: `bien-${bien.id}`,
          titre: bien.nom || bien.adresse,
          type: 'bien',
          statut: bien.statut,
          budget: bien.prix || bien.loyer || 0,
          coordonnees: [bien.latitude, bien.longitude],
          adresse: bien.adresse || 'Adresse non spécifiée',
          description: bien.description || '',
          bienId: bien.id,
          bienType: bien.type,
          idOriginal: bien.id
        });
      } else {
        donneesSansCoordonnees.push({
          id: `bien-${bien.id}`,
          titre: bien.nom || bien.adresse,
          type: 'bien',
          statut: bien.statut,
          budget: bien.prix || bien.loyer || 0,
          adresse: bien.adresse || 'Adresse non spécifiée',
          description: bien.description || '',
          bienType: bien.type,
          idOriginal: bien.id,
          raison: 'Coordonnées GPS manquantes'
        });
      }
    });

    // Ajouter les lotissements avec coordonnées et calcul des bénéfices parcellaires
    donneesLotissements.forEach(lotissement => {
      if (lotissement.latitude && lotissement.longitude) {
        // Chercher les partenariats associés à ce lotissement
        const partenariatsLotissement = donneesPartenariats.filter(p => p.id_lotissement === lotissement.id);
        
        // Calculer les bénéfices parcellaires
        let totalParcellesPromoteur = 0;
        let totalParcellesProprietaire = 0;

        partenariatsLotissement.forEach(partenariat => {
          const nbParcellesPromoteur = Math.floor((lotissement.nombre_parcelles || 0) * (partenariat.pourcentage_promoteur / 100));
          const nbParcellesProprietaire = Math.floor((lotissement.nombre_parcelles || 0) * (partenariat.pourcentage_proprietaire / 100));
          
          totalParcellesPromoteur += nbParcellesPromoteur;
          totalParcellesProprietaire += nbParcellesProprietaire;
        });

        pointsCarte.push({
          id: `lotissement-${lotissement.id}`,
          titre: lotissement.nom,
          type: 'lotissements',
          statut: lotissement.statut || 'actif',
          budget: 0, // Les lotissements n'ont pas de budget monétaire
          coordonnees: [lotissement.latitude, lotissement.longitude],
          adresse: lotissement.localisation || 'Localisation non spécifiée',
          description: `Lotissement de ${lotissement.superficie_totale || 0}m² avec ${lotissement.nombre_parcelles || 0} parcelles`,
          superficie: lotissement.superficie_totale || 0,
          nombreParcelles: lotissement.nombre_parcelles || 0,
          beneficePromoteur: totalParcellesPromoteur,
          beneficeProprietaire: totalParcellesProprietaire,
          partenariats: partenariatsLotissement,
          idOriginal: lotissement.id
        });
      } else {
        const partenariatsLotissement = donneesPartenariats.filter(p => p.id_lotissement === lotissement.id);
        
        donneesSansCoordonnees.push({
          id: `lotissement-${lotissement.id}`,
          titre: lotissement.nom,
          type: 'lotissements',
          statut: lotissement.statut || 'actif',
          budget: 0,
          adresse: lotissement.localisation || 'Localisation non spécifiée',
          description: `Lotissement de ${lotissement.superficie_totale || 0}m² avec ${lotissement.nombre_parcelles || 0} parcelles`,
          superficie: lotissement.superficie_totale || 0,
          nombreParcelles: lotissement.nombre_parcelles || 0,
          partenariats: partenariatsLotissement,
          idOriginal: lotissement.id,
          raison: 'Coordonnées GPS manquantes'
        });
      }
    });

    return { pointsCarte, donneesSansCoordonnees };
  }, []);

  // Charger les données depuis l'API
  const chargerDonnees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const donnees = await apiService.getStatistiquesCarte();

      // Validation des données - Supporte 'data' ou 'donnees' selon l'API
      const travauxData = Array.isArray(donnees?.travaux) ? donnees.travaux : (donnees?.travaux?.data || donnees?.travaux?.donnees || []);
      const depensesData = Array.isArray(donnees?.depenses) ? donnees.depenses : (donnees?.depenses?.data || donnees?.depenses?.donnees || []);
      const biensData = Array.isArray(donnees?.biens) ? donnees.biens : (donnees?.biens?.data || donnees?.biens?.donnees || []);
      const lotissementsData = Array.isArray(donnees?.lotissements) ? donnees.lotissements : (donnees?.lotissements?.data || donnees?.lotissements?.donnees || []);
      const partenariatsData = Array.isArray(donnees?.partenariats) ? donnees.partenariats : (donnees?.partenariats?.data || donnees?.partenariats?.donnees || []);
      const parcellesCoopData = Array.isArray(donnees?.parcellesCooperative) ? donnees.parcellesCooperative : (donnees?.parcellesCooperative?.data || donnees?.parcellesCooperative?.donnees || []);

      setTravaux(travauxData);
      setDepenses(depensesData);
      setBiens(biensData);
      setLotissements(lotissementsData);
      setPartenariats(partenariatsData);
      setParcellesCooperative(parcellesCoopData);

      // Transformer les données pour la carte
      const { pointsCarte, donneesSansCoordonnees } = transformerDonneesCarte(
        travauxData,
        depensesData,
        biensData,
        lotissementsData,
        partenariatsData,
        parcellesCoopData
      );

      // Calculer les statistiques
      const statsCalculees = {
        total: pointsCarte.length,
        budgetTotal: pointsCarte.reduce((sum, item) => sum + (item.budget || 0), 0),
        enCours: pointsCarte.filter(item => item.statut === 'en_cours' || item.statut === 'occupé').length,
        travauxCount: travauxData.length,
        depensesCount: depensesData.length,
        biensCount: biensData.length,
        lotissementsCount: lotissementsData.length,
        partenariatsCount: partenariatsData.length,
        parcellesCooperativeCount: parcellesCoopData.length,
        sansCoordonnees: donneesSansCoordonnees.length
      };

      setStats(statsCalculees);

      // Ajuster le range de budget si nécessaire (Une seule fois au chargement initial)
      if (pointsCarte.length > 0) {
        const budgets = pointsCarte.map(item => item.budget || 0);
        const maxBudget = Math.ceil(Math.max(...budgets) * 1.1);
        setBudgetRange(prev => ({ ...prev, max: Math.max(prev.max, maxBudget) }));
      }

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données. Veuillez réessayer.');
      // En cas d'erreur, initialiser avec des données vides pour éviter les crashes
      setTravaux([]);
      setDepenses([]);
      setBiens([]);
      setLotissements([]);
      setPartenariats([]);
      setParcellesCooperative([]);
      setStats({
        total: 0,
        budgetTotal: 0,
        enCours: 0,
        travauxCount: 0,
        depensesCount: 0,
        lotissementsCount: 0,
        partenariatsCount: 0,
        parcellesCooperativeCount: 0,
        sansCoordonnees: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrer les données
  const { pointsCarte: pointsCarteBruts, donneesSansCoordonnees } = transformerDonneesCarte(
    travaux || [],
    depenses || [],
    biens || [],
    lotissements || [],
    partenariats || [],
    parcellesCooperative || []
  );

  const donneesFiltrees = pointsCarteBruts.filter(item => {
    if (!item) return false;
    const typeMatch = selectedType === 'tous' || item.type === selectedType;
    const budgetMatch = item.budget >= budgetRange.min && item.budget <= budgetRange.max;
    return typeMatch && budgetMatch;
  });

  // Effacer les filtres
  const effacerFiltres = useCallback(() => {
    setSelectedType('tous');
    setBudgetRange({ min: 0, max: 100000 });
  }, []);

  // Rafraîchir les données
  const rafraichirDonnees = useCallback(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  // Charger les données au montage du composant
  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  return {
    // Données
    travaux,
    depenses,
    biens,
    lotissements,
    partenariats,
    parcellesCooperative,
    donneesCarte: donneesFiltrees,
    donneesSansCoordonnees,
    pointsCarteBruts,
    loading,
    error,
    stats,

    // Filtres
    selectedType,
    budgetRange,

    // Actions
    setSelectedType,
    setBudgetRange,
    effacerFiltres,
    rafraichirDonnees,
    chargerDonnees
  };
};
