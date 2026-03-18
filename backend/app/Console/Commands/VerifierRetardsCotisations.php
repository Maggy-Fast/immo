<?php

namespace App\Console\Commands;

use App\Application\Services\ServiceCotisation;
use Illuminate\Console\Command;

class VerifierRetardsCotisations extends Command
{
    protected $signature = 'cooperative:verifier-retards';
    protected $description = 'Vérifier et marquer les échéances en retard, suspendre les adhérents si nécessaire';

    public function handle(ServiceCotisation $serviceCotisation)
    {
        $this->info('Vérification des retards en cours...');

        try {
            $serviceCotisation->verifierRetards();
            $this->info('✓ Vérification terminée avec succès');
        } catch (\Exception $e) {
            $this->error('Erreur: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
