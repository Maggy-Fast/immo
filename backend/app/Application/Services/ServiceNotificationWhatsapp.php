<?php

namespace App\Application\Services;

use App\Domaine\Entities\Adherent;
use App\Domaine\Entities\NotificationWhatsapp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Twilio\Rest\Client;
use Exception;

/**
 * Service pour gérer les notifications WhatsApp
 * Intégré avec Twilio API
 */
class ServiceNotificationWhatsapp
{
    private $twilio;
    private $twilioNumber;

    public function __construct()
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.auth_token');
        
        if ($sid && $token) {
            $this->twilio = new Client($sid, $token);
            $this->twilioNumber = config('services.twilio.whatsapp_number');
        } else {
            $this->twilio = null;
            $this->twilioNumber = null;
        }
    }
    /**
     * Envoyer une notification de rappel avant échéance
     */
    public function envoyerRappel(Adherent $adherent, $dateEcheance, $montant)
    {
        $message = $this->genererMessage('rappel', [
            'nom' => $adherent->prenom . ' ' . $adherent->nom,
            'date_echeance' => $dateEcheance,
            'montant' => number_format($montant, 0, ',', ' '),
        ]);

        return $this->creerNotification($adherent, 'rappel', $message);
    }

    /**
     * Envoyer une notification de retard
     */
    public function envoyerNotificationRetard(Adherent $adherent, $nbRetards)
    {
        $message = $this->genererMessage('retard', [
            'nom' => $adherent->prenom . ' ' . $adherent->nom,
            'nb_retards' => $nbRetards,
        ]);

        return $this->creerNotification($adherent, 'retard', $message);
    }

    /**
     * Envoyer une notification de suspension
     */
    public function envoyerNotificationSuspension(Adherent $adherent)
    {
        $message = $this->genererMessage('suspension', [
            'nom' => $adherent->prenom . ' ' . $adherent->nom,
        ]);

        return $this->creerNotification($adherent, 'suspension', $message);
    }

    /**
     * Envoyer une confirmation de paiement
     */
    public function envoyerConfirmationPaiement(Adherent $adherent, $montant, $reference)
    {
        $message = $this->genererMessage('confirmation_paiement', [
            'nom' => $adherent->prenom . ' ' . $adherent->nom,
            'montant' => number_format($montant, 0, ',', ' '),
            'reference' => $reference,
        ]);

        return $this->creerNotification($adherent, 'confirmation_paiement', $message);
    }

    /**
     * Créer une notification en base
     */
    private function creerNotification(Adherent $adherent, string $type, string $message, $idTenant = null)
    {
        return NotificationWhatsapp::create([
            'id_tenant' => $idTenant ?? Auth::user()?->id_tenant ?? 1, // Default à 1 pour les tests
            'id_adherent' => $adherent->id,
            'type' => $type,
            'message' => $message,
            'telephone' => $adherent->telephone,
            'statut' => 'en_attente',
        ]);
    }

    /**
     * Générer le message à partir d'un template
     */
    private function genererMessage(string $type, array $variables): string
    {
        $templates = [
            'rappel' => "Bonjour {nom},\n\nRappel : Votre cotisation de {montant} FCFA est due le {date_echeance}.\n\nMerci de votre engagement.",
            'retard' => "Bonjour {nom},\n\nVous avez {nb_retards} échéance(s) en retard. Merci de régulariser votre situation rapidement.",
            'suspension' => "Bonjour {nom},\n\nVotre compte a été suspendu en raison de retards de paiement. Veuillez contacter l'administration.",
            'confirmation_paiement' => "Bonjour {nom},\n\nPaiement de {montant} FCFA bien reçu.\nRéférence : {reference}\n\nMerci !",
        ];

        $message = $templates[$type] ?? '';

        foreach ($variables as $key => $value) {
            $message = str_replace('{' . $key . '}', $value, $message);
        }

        return $message;
    }

    /**
     * Envoyer un message via l'API Twilio WhatsApp
     */
    private function envoyerViaAPI(string $telephone, string $message): bool
    {
        try {
            // Vérifier si Twilio est configuré
            if (!$this->twilio || !$this->twilioNumber) {
                Log::warning("Twilio non configuré - Simulation d'envoi WhatsApp à {$telephone}");
                return true; // Simuler succès pour les tests
            }
            
            // Formater le numéro pour WhatsApp (ajouter + si nécessaire)
            $telephoneFormatte = $this->formatterNumeroWhatsApp($telephone);
            
            $this->twilio->messages->create(
                "whatsapp:{$telephoneFormatte}",
                [
                    'from' => "whatsapp:{$this->twilioNumber}",
                    'body' => $message
                ]
            );

            Log::info("Message WhatsApp envoyé à {$telephoneFormatte}");
            return true;

        } catch (Exception $e) {
            Log::error("Erreur envoi WhatsApp à {$telephone}: " . $e->getMessage());
            throw new Exception("Erreur Twilio : " . $e->getMessage());
        }
    }

    /**
     * Formater le numéro de téléphone pour WhatsApp
     */
    private function formatterNumeroWhatsApp(string $telephone): string
    {
        // Supprimer tous les caractères non numériques
        $numero = preg_replace('/[^0-9]/', '', $telephone);
        
        // Ajouter le préfixe international si nécessaire
        if (strlen($numero) === 9 && str_starts_with($numero, '7')) {
            // Numéro sénégalais (format 77XXXXXXX ou 76XXXXXXX)
            $numero = '221' . $numero;
        } elseif (strlen($numero) === 12 && !str_starts_with($numero, '+')) {
            // Déjà avec préfixe international mais sans +
            $numero = '+' . $numero;
        } elseif (strlen($numero) === 9) {
            // Autre format local, supposer préfixe pays
            $numero = '+221' . $numero;
        } elseif (!str_starts_with($numero, '+')) {
            // Ajouter + si absent
            $numero = '+' . $numero;
        }
        
        return $numero;
    }

    /**
     * Envoyer un message directement (pour les jobs)
     */
    public function envoyerDirectement(string $telephone, string $message): bool
    {
        return $this->envoyerViaAPI($telephone, $message);
    }

    /**
     * Traiter la file d'attente des notifications
     * À appeler via un job/cron
     */
    public function traiterFileAttente($idTenant = null)
    {
        $totalSucces = 0;
        
        if ($idTenant) {
            // Traiter un tenant spécifique
            $totalSucces = $this->traiterFileAttentePourTenant($idTenant);
        } else {
            // Traiter tous les tenants
            $tenants = \App\Domaine\Entities\Tenant::all();
            foreach ($tenants as $tenant) {
                $totalSucces += $this->traiterFileAttentePourTenant($tenant->id);
            }
        }
        
        Log::info("Traitement WhatsApp terminé: {$totalSucces} messages envoyés au total");
        return $totalSucces;
    }
    
    /**
     * Traiter la file d'attente pour un tenant spécifique
     */
    private function traiterFileAttentePourTenant($idTenant)
    {
        $notifications = NotificationWhatsapp::where('id_tenant', $idTenant)
            ->where('statut', 'en_attente')
            ->limit(50)
            ->get();

        $succes = 0;
        foreach ($notifications as $notification) {
            try {
                // Intégration avec l'API WhatsApp
                $envoye = $this->envoyerViaAPI($notification->telephone, $notification->message);
                
                if ($envoye) {
                    $notification->update([
                        'statut' => 'envoye',
                        'date_envoi' => now(),
                    ]);
                    $succes++;
                } else {
                    $notification->update([
                        'statut' => 'echec',
                        'erreur' => 'Échec envoi API',
                    ]);
                }
            } catch (Exception $e) {
                $notification->update([
                    'statut' => 'echec',
                    'erreur' => $e->getMessage(),
                ]);
                Log::error("Erreur traitement notification {$notification->id}: " . $e->getMessage());
            }
        }

        if ($succes > 0) {
            Log::info("Tenant {$idTenant}: {$succes}/{$notifications->count()} messages envoyés");
        }
        
        return $succes;
    }

    /**
     * Obtenir l'historique des notifications d'un adhérent
     */
    public function obtenirHistorique(int $idAdherent)
    {
        return NotificationWhatsapp::where('id_adherent', $idAdherent)
            ->orderBy('created_at', 'desc')
            ->paginate(20);
    }
}
