<?php

namespace App\Application\Services;

use App\Domaine\Entities\Bien;
use App\Domaine\Entities\Contrat;
use App\Domaine\Entities\Locataire;
use App\Domaine\Entities\Proprietaire;
use App\Domaine\Entities\Loyer;
use App\Domaine\Entities\Depense;
use App\Domaine\Entities\Travaux;
use App\Domaine\Entities\Lotissement;
use App\Domaine\Entities\Partenariat;
use App\Domaine\Entities\ParcelleCooperative;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ServiceTableauBord
{
    /**
     * Obtenir toutes les données nécessaires à la carte interactive en un seul appel
     */
    public function obtenirDonneesCarte()
    {
        return [
            'biens' => Bien::select(['id', 'adresse', 'type', 'statut', 'prix', 'latitude', 'longitude', 'description'])->get(),
            'travaux' => Travaux::with(['bien:id,adresse,latitude,longitude,type'])
                ->select(['id', 'id_bien', 'intitule', 'description', 'montant_estime', 'date_debut', 'date_fin', 'statut'])
                ->get(),
            'depenses' => Depense::with(['bien:id,adresse,latitude,longitude,type'])
                ->select(['id', 'id_bien', 'intitule', 'description', 'montant', 'date_depense', 'type_depense', 'statut_paiement'])
                ->get(),
            'lotissements' => Lotissement::select(['id', 'nom', 'localisation', 'superficie_totale', 'nombre_parcelles', 'latitude', 'longitude', 'statut'])->get(),
            'partenariats' => Partenariat::select(['id', 'id_lotissement', 'pourcentage_promoteur', 'pourcentage_proprietaire'])->get(),
            'parcelles_cooperative' => ParcelleCooperative::with(['adherent:id,nom,prenom,numero', 'groupe:id,nom'])
                ->select(['id', 'id_groupe', 'numero', 'surface', 'prix', 'statut', 'id_adherent', 'date_attribution', 'description', 'latitude', 'longitude'])
                ->get(),
        ];
    }

    /**
     * Obtenir toutes les statistiques pour le tableau de bord
     */
    public function obtenirStatsGlobales()
    {
        return [
            'principales' => $this->obtenirStatsPrincipales(),
            'financier' => $this->obtenirStatsFinancieres(),
            'graphiques' => [
                'revenusMois' => $this->obtenirDonneesRevenusMensuels(),
                'statutPaiements' => $this->obtenirStatsPaiements(),
                'repartitionBiens' => $this->obtenirRepartitionBiens(),
                'tauxOccupation' => $this->obtenirTauxOccupationQuartier(),
            ],
            'activitesRecentes' => $this->obtenirActivitesRecentes(),
            'biensRecents' => $this->obtenirBiensRecents(),
        ];
    }

    private function obtenirStatsPrincipales()
    {
        return [
            'total_biens' => Bien::count(),
            'total_proprietaires' => Proprietaire::count(),
            'total_locataires_actifs' => Locataire::count(), // Pas de colonne statut dans le schéma actuel
            'contrats_actifs' => Contrat::where('statut', 'actif')->count(),
        ];
    }

    private function obtenirStatsFinancieres()
    {
        $maintenant = Carbon::now();
        $moisCourant = $maintenant->format('Y-m');

        $loyersDuMois = Loyer::where('mois', 'like', $moisCourant . '%')->get();
        
        $attendu = $loyersDuMois->sum('montant');
        $recu = $loyersDuMois->where('statut', 'paye')->sum('montant');
        $enAttente = $attendu - $recu;
        $tauxRecouvrement = $attendu > 0 ? round(($recu / $attendu) * 100, 1) : 0;

        return [
            'mois' => $maintenant->translatedFormat('F Y'),
            'attendu' => $attendu,
            'recu' => $recu,
            'enAttente' => $enAttente,
            'tauxRecouvrement' => $tauxRecouvrement,
        ];
    }

    private function obtenirDonneesRevenusMensuels()
    {
        $donnees = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $moisPrefix = $date->format('Y-m');
            $nomMois = $date->translatedFormat('M');

            $revenus = Loyer::where('mois', 'like', $moisPrefix . '%')->where('statut', 'paye')->sum('montant');
            $depenses = Depense::whereYear('date_depense', $date->year)
                ->whereMonth('date_depense', $date->month)
                ->sum('montant');

            $donnees[] = [
                'mois' => $nomMois,
                'revenus' => (float)$revenus,
                'depenses' => (float)$depenses,
            ];
        }
        return $donnees;
    }

    private function obtenirStatsPaiements()
    {
        $donnees = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $moisPrefix = $date->format('Y-m');
            $nomMois = $date->translatedFormat('M');

            $payes = Loyer::where('mois', 'like', $moisPrefix . '%')->where('statut', 'paye')->count();
            $impayes = Loyer::where('mois', 'like', $moisPrefix . '%')->where('statut', '!=', 'paye')->count();

            $donnees[] = [
                'mois' => $nomMois,
                'payes' => $payes,
                'impayes' => $impayes,
            ];
        }
        return $donnees;
    }

    private function obtenirRepartitionBiens()
    {
        $repartition = Bien::select('type', DB::raw('count(*) as valeur'))
            ->groupBy('type')
            ->get();

        $couleurs = [
            'appartement' => '#C41E3A',
            'maison' => '#1A1A1A',
            'commerce' => '#059669',
            'terrain' => '#D97706',
            'studio' => '#6366F1',
            'bureau' => '#8B5CF6'
        ];

        return $repartition->map(function ($item) use ($couleurs) {
            $type = strtolower($item->type);
            return [
                'nom' => ucfirst($item->type),
                'valeur' => $item->valeur,
                'couleur' => $couleurs[$type] ?? '#' . substr(md5($type), 0, 6)
            ];
        });
    }

    private function obtenirTauxOccupationQuartier()
    {
        // On simule par zone extraite de l'adresse ou on groupe par adresse si possible
        // Pour faire simple, on va juste compter par début d'adresse ou champ quartier s'il existait
        // Ici on va faire un mock basé sur les adresses existantes
        $biens = Bien::all();
        $quartiers = [];

        foreach ($biens as $bien) {
            // Extraction simpliste du "quartier" (premier mot de l'adresse)
            $quartier = explode(' ', trim($bien->adresse))[0];
            if (!isset($quartiers[$quartier])) {
                $quartiers[$quartier] = ['total' => 0, 'loue' => 0];
            }
            $quartiers[$quartier]['total']++;
            if ($bien->statut === 'loue') {
                $quartiers[$quartier]['loue']++;
            }
        }

        $resultat = [];
        foreach ($quartiers as $nom => $stats) {
            $resultat[] = [
                'quartier' => $nom,
                'taux' => round(($stats['loue'] / $stats['total']) * 100),
            ];
        }

        // Limiter aux 5 plus gros
        usort($resultat, fn($a, $b) => $b['taux'] <=> $a['taux']);
        return array_slice($resultat, 0, 5);
    }

    private function obtenirActivitesRecentes()
    {
        // Mélanger les derniers paiements et nouveaux contrats
        $paiements = Loyer::with('contrat.locataire')
            ->where('statut', 'paye')
            ->orderBy('date_paiement', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($loyer) {
                return [
                    'type' => 'paiement',
                    'locataire' => $loyer->contrat->locataire->nom ?? 'Inconnu',
                    'montant' => $loyer->montant,
                    'date' => $loyer->date_paiement ? $loyer->date_paiement->diffForHumans() : 'Récemment',
                    'statut' => 'succes'
                ];
            });

        $contrats = Contrat::with('locataire')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($contrat) {
                return [
                    'type' => 'contrat',
                    'locataire' => $contrat->locataire->nom ?? 'Inconnu',
                    'action' => 'Nouveau contrat signé',
                    'date' => $contrat->created_at->diffForHumans(),
                    'statut' => 'info'
                ];
            });

        return $paiements->concat($contrats)
            ->sortByDesc(function ($item) {
                // Tri approximatif par date relative
                return $item['date'];
            })
            ->values()
            ->take(5);
    }

    private function obtenirBiensRecents()
    {
        return Bien::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($bien) {
                return [
                    'nom' => $bien->adresse,
                    'type' => ucfirst($bien->type),
                    'statut' => $bien->statut === 'loue' ? 'Loué' : 'Disponible',
                    'loyer' => $bien->prix,
                    'prix' => $bien->prix,
                ];
            });
    }
}
