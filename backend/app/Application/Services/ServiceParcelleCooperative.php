<?php

namespace App\Application\Services;

use App\Domaine\Entities\Adherent;
use App\Domaine\Entities\ParcelleCooperative;
use App\Domaine\Entities\HistoriqueAttribution;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceParcelleCooperative
{
    public function lister(array $filtres = [])
    {
        $query = ParcelleCooperative::with(['adherent', 'adherents']);

        if (!empty($filtres['id_groupe'])) {
            $query->where('id_groupe', $filtres['id_groupe']);
        }

        if (!empty($filtres['statut'])) {
            $query->where('statut', $filtres['statut']);
        }

        // Filtre par recherche (numéro, description)
        if (!empty($filtres['recherche'])) {
            $terme = strtolower($filtres['recherche']);
            $termeNormalise = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $terme);
            $query->where(function ($q) use ($terme, $termeNormalise) {
                $q->whereRaw('LOWER(numero) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(numero) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$termeNormalise}%"]);
            });
        }

        return $query->orderBy('numero')->paginate(15);
    }

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        if (empty($donnees['id_groupe'])) {
            $serviceGroupe = new ServiceGroupeCooperative();
            $donnees['id_groupe'] = $serviceGroupe->obtenirGroupeParDefautId();
        }

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            
            // Utiliser storeAs() au lieu de move()
            $chemin = $donnees['photo']->storeAs('uploads/parcelle-cooperative', $nomFichier, 'public');
            
            // Log avant upload
            \Log::info('Upload photo parcelle - AVANT', [
                'parcelle_id' => 'new',
                'nom_fichier' => $nomFichier,
                'chemin_stockage' => $chemin,
                'fichier_existe_destination' => is_dir(storage_path('app/public/uploads/parcelle-cooperative')),
                'destination_writable' => is_writable(storage_path('app/public/uploads/parcelle-cooperative')),
            ]);
            
            $donnees['photo'] = '/storage/' . $chemin;
            
            // Log après upload
            \Log::info('Upload photo parcelle - APRES', [
                'parcelle_id' => 'new',
                'nom_fichier' => $nomFichier,
                'url_finale' => $donnees['photo'],
                'fichier_existe' => storage_path('app/public/' . $chemin),
                'fichier_existe_bool' => file_exists(storage_path('app/public/' . $chemin)),
            ]);
        }
        
        return ParcelleCooperative::create($donnees);
    }

    public function obtenirParId(int $id)
    {
        return ParcelleCooperative::with(['adherent', 'adherents', 'historique.adherent'])->findOrFail($id);
    }

    public function mettreAJour(int $id, array $donnees)
    {
        $parcelle = ParcelleCooperative::findOrFail($id);

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            
            // Utiliser storeAs() au lieu de move()
            $chemin = $donnees['photo']->storeAs('uploads/parcelle-cooperative', $nomFichier, 'public');
            
            // Log avant upload
            \Log::info('Upload photo parcelle (UPDATE) - AVANT', [
                'parcelle_id' => $id,
                'ancienne_photo' => $parcelle->photo,
                'nom_fichier' => $nomFichier,
                'chemin_stockage' => $chemin,
                'fichier_existe_destination' => is_dir(storage_path('app/public/uploads/parcelle-cooperative')),
                'destination_writable' => is_writable(storage_path('app/public/uploads/parcelle-cooperative')),
            ]);
            
            $donnees['photo'] = '/storage/' . $chemin;
            
            // Log après upload
            \Log::info('Upload photo parcelle (UPDATE) - APRES', [
                'parcelle_id' => $id,
                'nom_fichier' => $nomFichier,
                'url_finale' => $donnees['photo'],
                'fichier_existe' => storage_path('app/public/' . $chemin),
                'fichier_existe_bool' => file_exists(storage_path('app/public/' . $chemin)),
            ]);
        }

        $parcelle->update($donnees);
        
        return $parcelle->fresh(['adherent', 'historique']);
    }

    public function supprimer(int $id)
    {
        $parcelle = ParcelleCooperative::findOrFail($id);
        
        if ($parcelle->statut !== 'disponible') {
            throw new \Exception("Impossible de supprimer une parcelle attribuée ou vendue");
        }
        
        $parcelle->delete();
        return true;
    }

    public function attribuer(int $idParcelle, array $donnees)
    {
        return DB::transaction(function() use ($idParcelle, $donnees) {
            $parcelle = ParcelleCooperative::findOrFail($idParcelle);
            $attributions = $donnees['attributions'] ?? [];
            $idGroupeExistant = $donnees['id_groupe'] ?? null;

            // Vérifier disponibilité
            if ($parcelle->statut !== 'disponible') {
                throw new \Exception("Cette parcelle n'est pas disponible");
            }

            $id_tenant = Auth::user()->id_tenant;
            $serviceAdherent = new \App\Application\Services\ServiceAdherent();

            // CAS 1 : Attribution par groupe existant
            if ($idGroupeExistant && empty($attributions)) {
                $parcelle->update([
                    'id_groupe' => $idGroupeExistant,
                    'statut' => 'attribuee',
                    'date_attribution' => now(),
                    'id_adherent' => null
                ]);
            } 
            // CAS 2 : Attribution individuelle (Création auto de groupe)
            else if (!empty($attributions)) {
                $totalPourcentage = 0;
                foreach ($attributions as $attr) {
                    $idAdherent = $attr['id_adherent'];
                    $pourcentage = $attr['pourcentage'] ?? (100 / count($attributions));
                    $totalPourcentage += $pourcentage;

                    // Vérifier éligibilité
                    $eligibilite = $serviceAdherent->verifierEligibiliteParcelle($idAdherent);
                    if (!$eligibilite['eligible']) {
                        $adherent = Adherent::find($idAdherent);
                        $nom = $adherent ? "{$adherent->prenom} {$adherent->nom}" : "Adhérent #$idAdherent";
                        throw new \Exception("Adhérent $nom non éligible: " . implode(', ', $eligibilite['raisons']));
                    }
                }

                if (abs($totalPourcentage - 100) > 0.01) {
                    throw new \Exception("Le total des pourcentages doit être égal à 100% (actuel: $totalPourcentage%)");
                }

                // Créer le nouveau groupe
                $nomGroupe = "Groupe - {$parcelle->numero} - {$parcelle->surface}m²";
                $nouveauGroupe = \App\Domaine\Entities\GroupeCooperative::create([
                    'id_tenant' => $id_tenant,
                    'nom' => $nomGroupe,
                    'description' => "Groupe créé automatiquement lors de l'acquisition de la parcelle {$parcelle->numero}"
                ]);

                // Mettre à jour la parcelle
                $parcelle->update([
                    'id_groupe' => $nouveauGroupe->id,
                    'statut' => 'attribuee',
                    'id_adherent' => $attributions[0]['id_adherent'], // Compatibilité
                    'date_attribution' => now(),
                ]);

                // Attacher les adhérents
                foreach ($attributions as $attr) {
                    $idAdherent = $attr['id_adherent'];
                    $pourcentage = $attr['pourcentage'] ?? (100 / count($attributions));

                    // Déplacer l'adhérent dans ce nouveau groupe
                    Adherent::where('id', $idAdherent)->update(['id_groupe' => $nouveauGroupe->id]);

                    $parcelle->adherents()->attach($idAdherent, [
                        'id_tenant' => $id_tenant,
                        'pourcentage_possession' => $pourcentage,
                        'date_attribution' => now(),
                    ]);

                    HistoriqueAttribution::create([
                        'id_tenant' => $id_tenant,
                        'id_parcelle' => $idParcelle,
                        'id_adherent' => $idAdherent,
                        'date_attribution' => now(),
                        'motif' => "Attribution d'acquisition groupée ($pourcentage%)"
                    ]);
                }
            }

            return $parcelle->fresh(['adherent', 'adherents', 'groupe']);
        });
    }

    public function retirer(int $idParcelle, string $motif = null)
    {
        return DB::transaction(function() use ($idParcelle, $motif) {
            $parcelle = ParcelleCooperative::findOrFail($idParcelle);

            if ($parcelle->statut !== 'attribuee') {
                throw new \Exception("Cette parcelle n'est pas attribuée");
            }

            // Mettre à jour l'historique
            HistoriqueAttribution::where('id_parcelle', $idParcelle)
                ->whereNull('date_retrait')
                ->update([
                    'date_retrait' => now(),
                    'motif' => $motif,
                ]);

            // Libérer la parcelle
            $parcelle->adherents()->detach();
            $parcelle->update([
                'statut' => 'disponible',
                'id_adherent' => null,
                'date_attribution' => null,
            ]);

            return $parcelle->fresh(['adherents']);
        });
    }

    public function obtenirStatistiques()
    {
        $idTenant = Auth::user()->id_tenant;
        
        return [
            'total_parcelles' => ParcelleCooperative::where('id_tenant', $idTenant)->count(),
            'disponibles' => ParcelleCooperative::where('id_tenant', $idTenant)->where('statut', 'disponible')->count(),
            'attribuees' => ParcelleCooperative::where('id_tenant', $idTenant)->where('statut', 'attribuee')->count(),
            'vendues' => ParcelleCooperative::where('id_tenant', $idTenant)->where('statut', 'vendue')->count(),
        ];
    }

    public function obtenirStatistiquesParGroupe(int $idGroupe)
    {
        $idTenant = Auth::user()->id_tenant;

        $base = ParcelleCooperative::where('id_tenant', $idTenant)->where('id_groupe', $idGroupe);

        return [
            'total_parcelles' => (clone $base)->count(),
            'disponibles' => (clone $base)->where('statut', 'disponible')->count(),
            'attribuees' => (clone $base)->where('statut', 'attribuee')->count(),
            'vendues' => (clone $base)->where('statut', 'vendue')->count(),
        ];
    }
}
