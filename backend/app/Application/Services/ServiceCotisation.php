<?php

namespace App\Application\Services;

use App\Domaine\Entities\Adherent;
use App\Domaine\Entities\Echeance;
use App\Domaine\Entities\ParametreCotisation;
use App\Application\Services\ServiceNotificationWhatsapp;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ServiceCotisation
{
    private $serviceNotification;
    
    public function __construct(ServiceNotificationWhatsapp $serviceNotification)
    {
        $this->serviceNotification = $serviceNotification;
    }
    public function creerParametre(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;

        if (empty($donnees['id_groupe'])) {
            $serviceGroupe = new ServiceGroupeCooperative();
            $donnees['id_groupe'] = $serviceGroupe->obtenirGroupeParDefautId();
        }
        
        // Désactiver les anciens paramètres
        ParametreCotisation::where('id_tenant', $donnees['id_tenant'])
            ->where('id_groupe', $donnees['id_groupe'])
            ->update(['actif' => false]);
        
        return ParametreCotisation::create($donnees);
    }

    public function obtenirParametreActif(?int $idGroupe = null)
    {
        $idTenant = Auth::user()->id_tenant;

        if (!$idGroupe) {
            $serviceGroupe = new ServiceGroupeCooperative();
            $idGroupe = $serviceGroupe->obtenirGroupeParDefautId();
        }

        return ParametreCotisation::where('id_tenant', $idTenant)
            ->where('id_groupe', $idGroupe)
            ->where('actif', true)
            ->first();
    }

    public function genererEcheances(int $idAdherent, ?int $nombreMois = 12)
    {
        $adherent = Adherent::findOrFail($idAdherent);

        $idGroupe = $adherent->id_groupe;
        if (!$idGroupe) {
            $serviceGroupe = new ServiceGroupeCooperative();
            $idGroupe = $serviceGroupe->obtenirGroupeParDefautId();
        }

        $parametre = $this->obtenirParametreActif($idGroupe);
        
        if (!$parametre) {
            throw new \Exception("Aucun paramètre de cotisation actif");
        }

        $echeances = [];
        $dateDebut = Carbon::parse($parametre->date_debut);
        
        for ($i = 0; $i < $nombreMois; $i++) {
            $dateEcheance = $dateDebut->copy()->addMonths($i)->day($parametre->jour_echeance);
            
            // Ne pas créer si déjà existe
            $existe = Echeance::where('id_adherent', $idAdherent)
                ->where('date_echeance', $dateEcheance)
                ->exists();
            
            if (!$existe) {
                $echeances[] = Echeance::create([
                    'id_tenant' => Auth::user()->id_tenant,
                    'id_groupe' => $idGroupe,
                    'id_adherent' => $idAdherent,
                    'id_parametre' => $parametre->id,
                    'date_echeance' => $dateEcheance,
                    'montant' => $parametre->montant,
                    'statut' => 'a_payer',
                ]);
            }
        }
        
        return $echeances;
    }

    public function listerEcheances(array $filtres = [])
    {
        $query = Echeance::with(['adherent', 'parametre']);

        if (!empty($filtres['id_groupe'])) {
            $query->where('id_groupe', $filtres['id_groupe']);
        }

        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        if (!empty($filtres['id_adherent'])) {
            $query->where('id_adherent', $filtres['id_adherent']);
        }

        if (!empty($filtres['mois'])) {
            $mois = $filtres['mois'];

            // Le frontend envoie souvent YYYY-MM depuis <input type="month">
            if (is_string($mois) && str_contains($mois, '-')) {
                [$annee, $m] = explode('-', $mois, 2);
                if (!empty($annee) && !empty($m)) {
                    $query->whereYear('date_echeance', (int) $annee)
                        ->whereMonth('date_echeance', (int) $m);
                }
            } else {
                $query->whereMonth('date_echeance', (int) $mois);
            }
        }

        return $query->orderBy('date_echeance', 'desc')->paginate(20);
    }

    public function payerEcheance(int $idEcheance, array $donnees)
    {
        return DB::transaction(function() use ($idEcheance, $donnees) {
            $echeance = Echeance::with('adherent')->findOrFail($idEcheance);
            
            if ($echeance->statut === 'paye') {
                throw new \Exception("Cette échéance est déjà payée");
            }

            $echeance->update([
                'statut' => 'paye',
                'date_paiement' => now(),
                'montant_paye' => $donnees['montant_paye'] ?? $echeance->montant,
                'mode_paiement' => $donnees['mode_paiement'] ?? 'especes',
                'reference_paiement' => $donnees['reference_paiement'] ?? null,
            ]);

            // Mettre à jour le compteur de retards de l'adhérent
            $this->mettreAJourStatutAdherent($echeance->adherent);

            // Envoyer notification WhatsApp de confirmation
            try {
                $this->serviceNotification->envoyerConfirmationPaiement(
                    $echeance->adherent,
                    $donnees['montant_paye'] ?? $echeance->montant,
                    $donnees['reference_paiement'] ?? 'PMT-' . time()
                );
            } catch (\Exception $e) {
                // Ne pas bloquer le paiement si WhatsApp échoue
                \Log::warning("Impossible d'envoyer la notification WhatsApp: " . $e->getMessage());
            }

            return $echeance->fresh(['adherent', 'parametre']);
        });
    }

    public function verifierRetards()
    {
        $serviceGroupe = new ServiceGroupeCooperative();
        $idGroupe = $serviceGroupe->obtenirGroupeParDefautId();

        $parametre = $this->obtenirParametreActif($idGroupe);
        if (!$parametre) return;

        $dateGrace = now()->subDays($parametre->periode_grace_jours);
        
        // Marquer les échéances en retard et calculer les pénalités
        $echeancesRetard = Echeance::where('id_tenant', Auth::user()->id_tenant)
            ->where('id_groupe', $idGroupe)
            ->where('statut', 'a_payer')
            ->where('date_echeance', '<', $dateGrace)
            ->get();

        foreach ($echeancesRetard as $echeance) {
            $penalite = 0;
            if ($parametre->mode_penalite === 'fixe') {
                $penalite = $parametre->montant_penalite_fixe;
            } elseif ($parametre->mode_penalite === 'pourcentage') {
                $penalite = ($echeance->montant * $parametre->pourcentage_penalite) / 100;
            }

            $echeance->update([
                'statut' => 'en_retard',
                'penalite' => $penalite
            ]);
        }

        // Mettre à jour les adhérents
        $adherents = Adherent::where('id_tenant', Auth::user()->id_tenant)
            ->where('id_groupe', $idGroupe)
            ->where('statut', 'actif')
            ->get();

        foreach ($adherents as $adherent) {
            $this->mettreAJourStatutAdherent($adherent);
        }
    }

    private function mettreAJourStatutAdherent(Adherent $adherent)
    {
        $parametre = $this->obtenirParametreActif($adherent->id_groupe);
        if (!$parametre) return;

        $nbRetards = Echeance::where('id_adherent', $adherent->id)
            ->where('statut', 'en_retard')
            ->count();

        $adherent->echeances_en_retard = $nbRetards;

        if ($nbRetards >= $parametre->max_echeances_retard && $adherent->statut === 'actif') {
            $adherent->statut = 'suspendu';
            
            // Envoyer notification WhatsApp de suspension
            try {
                $this->serviceNotification->envoyerNotificationSuspension($adherent);
            } catch (\Exception $e) {
                \Log::warning("Impossible d'envoyer la notification de suspension: " . $e->getMessage());
            }
        } elseif ($nbRetards > 0 && $nbRetards < $parametre->max_echeances_retard) {
            // Envoyer notification de retard
            try {
                $this->serviceNotification->envoyerNotificationRetard($adherent, $nbRetards);
            } catch (\Exception $e) {
                \Log::warning("Impossible d'envoyer la notification de retard: " . $e->getMessage());
            }
        }

        $adherent->save();
    }

    public function obtenirStatistiques()
    {
        $idTenant = Auth::user()->id_tenant;
        
        return [
            'total_encaisse' => Echeance::where('id_tenant', $idTenant)
                ->where('statut', 'paye')
                ->sum('montant_paye'),
            'total_en_attente' => Echeance::where('id_tenant', $idTenant)
                ->where('statut', 'a_payer')
                ->sum('montant'),
            'total_en_retard' => Echeance::where('id_tenant', $idTenant)
                ->where('statut', 'en_retard')
                ->sum('montant'),
            'nb_echeances_payees' => Echeance::where('id_tenant', $idTenant)
                ->where('statut', 'paye')
                ->count(),
            'nb_echeances_retard' => Echeance::where('id_tenant', $idTenant)
                ->where('statut', 'en_retard')
                ->count(),
        ];
    }

    public function obtenirStatistiquesParGroupe(int $idGroupe)
    {
        $idTenant = Auth::user()->id_tenant;

        return [
            'total_encaisse' => Echeance::where('id_tenant', $idTenant)
                ->where('id_groupe', $idGroupe)
                ->where('statut', 'paye')
                ->sum('montant_paye'),
            'total_en_attente' => Echeance::where('id_tenant', $idTenant)
                ->where('id_groupe', $idGroupe)
                ->where('statut', 'a_payer')
                ->sum('montant'),
            'total_en_retard' => Echeance::where('id_tenant', $idTenant)
                ->where('id_groupe', $idGroupe)
                ->where('statut', 'en_retard')
                ->sum('montant'),
            'nb_echeances_payees' => Echeance::where('id_tenant', $idTenant)
                ->where('id_groupe', $idGroupe)
                ->where('statut', 'paye')
                ->count(),
            'nb_echeances_retard' => Echeance::where('id_tenant', $idTenant)
                ->where('id_groupe', $idGroupe)
                ->where('statut', 'en_retard')
                ->count(),
        ];
    }
}
