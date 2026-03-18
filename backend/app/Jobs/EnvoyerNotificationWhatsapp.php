<?php

namespace App\Jobs;

use App\Application\Services\ServiceNotificationWhatsapp;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EnvoyerNotificationWhatsapp implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Le nombre de tentatives en cas d'échec
     */
    public $tries = 3;

    /**
     * Le délai avant de réessayer (en secondes)
     */
    public $backoff = [60, 300, 900]; // 1min, 5min, 15min

    /**
     * Le timeout maximum pour le job
     */
    public $timeout = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $telephone,
        private string $message,
        private ?int $idNotification = null
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ServiceNotificationWhatsapp $service): void
    {
        try {
            $resultat = $service->envoyerDirectement($this->telephone, $this->message);
            
            if ($resultat) {
                Log::info("Notification WhatsApp envoyée à {$this->telephone}");
            } else {
                Log::warning("Échec envoi WhatsApp à {$this->telephone}");
            }
            
        } catch (\Exception $e) {
            Log::error("Erreur job WhatsApp: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Gérer l'échec du job
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("Job WhatsApp échoué pour {$this->telephone}: " . $exception->getMessage());
    }
}
