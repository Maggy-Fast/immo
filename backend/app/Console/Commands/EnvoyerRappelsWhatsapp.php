<?php

namespace App\Console\Commands;

use App\Application\Services\ServiceCotisation;
use App\Application\Services\ServiceNotificationWhatsapp;
use App\Domaine\Entities\Echeance;
use App\Domaine\Entities\ParametreCotisation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class EnvoyerRappelsWhatsapp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'whatsapp:envoyer-rappels {--days=3 : Jours avant échéance pour envoyer le rappel}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoyer automatiquement des rappels WhatsApp avant échéances';

    /**
     * Execute the console command.
     */
    public function handle(ServiceNotificationWhatsapp $serviceNotification)
    {
        $joursAvant = (int) $this->option('days');
        $this->info("Envoi des rappels WhatsApp ({$joursAvant} jours avant échéance)...");
        
        try {
            $dateRappel = now()->addDays($joursAvant)->format('Y-m-d');
            $rappelsEnvoyes = 0;
            
            // Récupérer tous les paramètres actifs
            $parametres = ParametreCotisation::where('actif', true)->get();
            
            foreach ($parametres as $parametre) {
                // Chercher les échéances qui arrivent à échéance
                $echeances = Echeance::where('id_tenant', $parametre->id_tenant)
                    ->where('id_groupe', $parametre->id_groupe)
                    ->where('statut', 'a_payer')
                    ->whereDate('date_echeance', $dateRappel)
                    ->with('adherent')
                    ->get();
                
                foreach ($echeances as $echeance) {
                    try {
                        $serviceNotification->envoyerRappel(
                            $echeance->adherent,
                            $echeance->date_echeance,
                            $echeance->montant
                        );
                        $rappelsEnvoyes++;
                        
                        $this->line("Rappel envoyé à {$echeance->adherent->prenom} {$echeance->adherent->nom} ({$echeance->date_echeance})");
                        
                    } catch (\Exception $e) {
                        Log::error("Erreur envoi rappel à adhérent {$echeance->id_adherent}: " . $e->getMessage());
                    }
                }
            }
            
            if ($rappelsEnvoyes > 0) {
                $this->info("✅ {$rappelsEnvoyes} rappel(s) WhatsApp envoyé(s) avec succès");
            } else {
                $this->info('ℹ️ Aucun rappel à envoyer');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error("❌ Erreur lors de l'envoi des rappels: " . $e->getMessage());
            Log::error("Erreur commande rappels WhatsApp: " . $e->getMessage());
            
            return Command::FAILURE;
        }
    }
}
