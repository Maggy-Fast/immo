<?php

namespace App\Application\Services;

use App\Domaine\Entities\Loyer;
use App\Domaine\Entities\Quittance;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des loyers
 */
class ServiceLoyer
{
    /**
     * Lister tous les loyers avec filtres
     */
    public function lister(array $filtres = [])
    {
        $query = Loyer::with(['contrat.bien', 'contrat.locataire', 'tenant']);

        // Filtre par statut
        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        // Filtre par mois
        if (!empty($filtres['mois'])) {
            $query->where('mois', $filtres['mois']);
        }

        return $query->orderBy('mois', 'desc')->paginate(15);
    }

    /**
     * Créer un nouveau loyer
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        $donnees['statut'] = 'impaye';
        
        return Loyer::create($donnees);
    }

    /**
     * Obtenir un loyer par ID
     */
    public function obtenirParId(int $id)
    {
        return Loyer::with(['contrat.bien', 'contrat.locataire', 'quittance', 'tenant'])->findOrFail($id);
    }

    /**
     * Enregistrer un paiement
     */
    public function enregistrerPaiement(int $id, array $donnees)
    {
        $loyer = Loyer::findOrFail($id);
        
        $loyer->update([
            'statut' => 'paye',
            'mode_paiement' => $donnees['mode_paiement'],
            'date_paiement' => $donnees['date_paiement'] ?? now(),
        ]);

        // Générer la quittance
        $numeroQuittance = 'Q-' . date('Y') . '-' . str_pad($loyer->id, 6, '0', STR_PAD_LEFT);
        
        $quittance = Quittance::create([
            'id_tenant' => Auth::user()->id_tenant,
            'id_loyer' => $loyer->id,
            'numero_quittance' => $numeroQuittance,
            'chemin_pdf' => 'quittances/quittance_' . $loyer->id . '.pdf',
            'generee_le' => now(),
        ]);

        return $loyer->fresh(['contrat.bien', 'contrat.locataire', 'quittance']);
    }

    /**
     * Mettre à jour un loyer
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $loyer = Loyer::findOrFail($id);
        $loyer->update($donnees);
        
        return $loyer->fresh(['contrat.bien', 'contrat.locataire', 'tenant']);
    }

    /**
     * Supprimer un loyer
     */
    public function supprimer(int $id)
    {
        $loyer = Loyer::findOrFail($id);
        $loyer->delete();
        
        return true;
    }
}
