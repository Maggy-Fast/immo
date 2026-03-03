<?php

namespace App\Application\Services;

use App\Domaine\Entities\Partenariat;
use App\Domaine\Entities\DepensePartenariat;
use App\Domaine\Entities\Parcelle;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des partenariats
 */
class ServicePartenariat
{
    /**
     * Lister tous les partenariats
     */
    public function lister()
    {
        return Partenariat::with(['tenant', 'lotissement'])->paginate(15);
    }

    /**
     * Créer un nouveau partenariat
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        
        return Partenariat::create($donnees);
    }

    /**
     * Obtenir un partenariat par ID
     */
    public function obtenirParId(int $id)
    {
        return Partenariat::with(['tenant', 'lotissement'])->findOrFail($id);
    }

    /**
     * Calculer la répartition des bénéfices
     */
    public function calculerRepartition(int $id)
    {
        $partenariat = Partenariat::with('lotissement.parcelles')->findOrFail($id);
        
        // Calculer le total des ventes (parcelles vendues)
        $totalVentes = Parcelle::where('id_lotissement', $partenariat->id_lotissement)
            ->where('statut', 'vendue')
            ->sum('prix');

        // Calculer le total des dépenses
        $totalDepenses = DepensePartenariat::where('id_partenariat', $id)->sum('montant');

        // Calculer le bénéfice net
        $beneficeNet = $totalVentes - $totalDepenses;

        // Calculer les parts
        $partPromoteur = $beneficeNet * ($partenariat->pourcentage_promoteur / 100);
        $partProprietaire = $beneficeNet * ($partenariat->pourcentage_proprietaire / 100);

        // Vérifier si le ticket d'entrée est remboursé
        $ticketRembourse = $beneficeNet >= $partenariat->ticket_entree;

        return [
            'total_ventes' => $totalVentes,
            'total_depenses' => $totalDepenses,
            'benefice_net' => $beneficeNet,
            'part_promoteur' => [
                'pourcentage' => $partenariat->pourcentage_promoteur,
                'montant' => $partPromoteur,
            ],
            'part_proprietaire' => [
                'pourcentage' => $partenariat->pourcentage_proprietaire,
                'montant' => $partProprietaire,
            ],
            'ticket_entree_rembourse' => $ticketRembourse,
        ];
    }

    /**
     * Mettre à jour un partenariat
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $partenariat = Partenariat::findOrFail($id);
        $partenariat->update($donnees);
        
        return $partenariat->fresh(['tenant', 'lotissement']);
    }

    /**
     * Supprimer un partenariat
     */
    public function supprimer(int $id)
    {
        $partenariat = Partenariat::findOrFail($id);
        $partenariat->delete();
        
        return true;
    }
}
