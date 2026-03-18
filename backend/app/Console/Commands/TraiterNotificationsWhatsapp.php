<?php

namespace App\Console\Commands;

use App\Application\Services\ServiceNotificationWhatsapp;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Console\InputOption;

class TraiterNotificationsWhatsapp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'whatsapp:traiter-notifications {--tenant= : ID du tenant à traiter}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Traiter la file d\'attente des notifications WhatsApp';

    /**
     * Execute the console command.
     */
    public function handle(ServiceNotificationWhatsapp $serviceNotification)
    {
        $this->info('Traitement des notifications WhatsApp...');
        
        try {
            // Récupérer l'option tenant
            $idTenant = $this->option('tenant');
            
            $nbEnvoyes = $serviceNotification->traiterFileAttente($idTenant);
            
            if ($nbEnvoyes > 0) {
                $this->info("✅ {$nbEnvoyes} notification(s) WhatsApp envoyée(s) avec succès");
            } else {
                $this->info('ℹ️ Aucune notification à traiter');
            }
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error("❌ Erreur lors du traitement: " . $e->getMessage());
            Log::error("Erreur commande WhatsApp: " . $e->getMessage());
            
            return Command::FAILURE;
        }
    }
}
