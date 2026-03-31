<?php

namespace App\Http\Controllers;

use App\Application\Services\ServiceNotificationWhatsapp;
use App\Domaine\Entities\Adherent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class NotificationWhatsappController extends Controller
{
    public function __construct(private ServiceNotificationWhatsapp $service)
    {
    }

    /**
     * Envoyer une notification de test
     */
    public function envoyerTest(Request $request): JsonResponse
    {
        $request->validate([
            'telephone' => 'required|string',
            'message' => 'required|string|max:1000'
        ]);

        try {
            $resultat = $this->service->envoyerDirectement(
                $request->telephone,
                $request->message
            );

            return response()->json([
                'success' => $resultat,
                'message' => $resultat 
                    ? 'Message WhatsApp envoyé avec succès' 
                    : 'Le service WhatsApp est configuré mais l\'envoi a échoué. Vérifiez le numéro ou les crédits Twilio.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Envoyer un rappel à un adhérent
     */
    public function envoyerRappel(Request $request): JsonResponse
    {
        $request->validate([
            'id_adherent' => 'required|exists:adherents,id',
            'date_echeance' => 'required|date',
            'montant' => 'required|numeric|min:0'
        ]);

        try {
            $adherent = Adherent::findOrFail($request->id_adherent);
            
            $notification = $this->service->envoyerRappel(
                $adherent,
                $request->date_echeance,
                $request->montant
            );

            return response()->json([
                'success' => true,
                'message' => 'Rappel créé et mis en file d\'attente',
                'notification' => $notification
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Traiter manuellement la file d'attente
     */
    public function traiterFileAttente(): JsonResponse
    {
        try {
            $nbEnvoyes = $this->service->traiterFileAttente();

            return response()->json([
                'success' => true,
                'message' => "Traitement terminé",
                'nb_envoyes' => $nbEnvoyes
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir l'historique des notifications d'un adhérent
     */
    public function historique(Request $request, int $idAdherent): JsonResponse
    {
        try {
            $historique = $this->service->obtenirHistorique($idAdherent);

            return response()->json([
                'success' => true,
                'data' => $historique
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les statistiques des notifications
     */
    public function statistiques(): JsonResponse
    {
        try {
            $idTenant = Auth::user()->id_tenant;
            $query = \App\Domaine\Entities\NotificationWhatsapp::query();
            
            if ($idTenant) {
                $query->where('id_tenant', $idTenant);
            }

            $stats = [
                'en_attente' => (clone $query)->where('statut', 'en_attente')->count(),
                'envoyees' => (clone $query)->where('statut', 'envoye')->count(),
                'echecs' => (clone $query)->where('statut', 'echec')->count(),
                'total_24h' => (clone $query)->where('created_at', '>=', now()->subDay())->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
