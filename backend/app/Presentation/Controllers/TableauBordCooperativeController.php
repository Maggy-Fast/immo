<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceAdherent;
use App\Application\Services\ServiceCotisation;
use App\Application\Services\ServiceParcelleCooperative;
use App\Http\Controllers\Controller;

class TableauBordCooperativeController extends Controller
{
    protected $serviceAdherent;
    protected $serviceCotisation;
    protected $serviceParcelle;

    public function __construct(
        ServiceAdherent $serviceAdherent,
        ServiceCotisation $serviceCotisation,
        ServiceParcelleCooperative $serviceParcelle
    ) {
        $this->serviceAdherent = $serviceAdherent;
        $this->serviceCotisation = $serviceCotisation;
        $this->serviceParcelle = $serviceParcelle;
    }

    /**
     * Tableau de bord complet
     */
    public function index()
    {
        $idGroupe = request()->query('id_groupe');

        if ($idGroupe) {
            $idGroupe = (int) $idGroupe;
            $statsAdherents = $this->serviceAdherent->obtenirStatistiquesParGroupe($idGroupe);
            $statsCotisations = $this->serviceCotisation->obtenirStatistiquesParGroupe($idGroupe);
            $statsParcelles = $this->serviceParcelle->obtenirStatistiquesParGroupe($idGroupe);
        } else {
            $statsAdherents = $this->serviceAdherent->obtenirStatistiques();
            $statsCotisations = $this->serviceCotisation->obtenirStatistiques();
            $statsParcelles = $this->serviceParcelle->obtenirStatistiques();
        }

        return response()->json([
            'adherents' => $statsAdherents,
            'cotisations' => $statsCotisations,
            'parcelles' => $statsParcelles,
            'resume' => [
                'taux_paiement' => $this->calculerTauxPaiement($statsCotisations),
                'taux_attribution' => $this->calculerTauxAttribution($statsAdherents, $statsParcelles),
            ],
        ]);
    }

    private function calculerTauxPaiement($stats)
    {
        $total = $stats['nb_echeances_payees'] + $stats['nb_echeances_retard'];
        
        if ($total === 0) {
            return 0;
        }

        return round(($stats['nb_echeances_payees'] / $total) * 100, 2);
    }

    private function calculerTauxAttribution($statsAdherents, $statsParcelles)
    {
        if ($statsParcelles['total_parcelles'] === 0) {
            return 0;
        }

        return round(($statsParcelles['attribuees'] / $statsParcelles['total_parcelles']) * 100, 2);
    }
}
