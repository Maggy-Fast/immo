<?php

namespace App\Application\Services;

use App\Domaine\Entities\Promoteur;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ServicePromoteur
{
    /**
     * Lister tous les promoteurs
     */
    public function lister(): LengthAwarePaginator
    {
        return Promoteur::with(['tenant', 'utilisateur'])
            ->orderBy('nom')
            ->paginate(20);
    }

    /**
     * Obtenir un promoteur par son ID
     */
    public function obtenirParId(int $id): ?Promoteur
    {
        return Promoteur::with(['tenant', 'utilisateur'])
            ->findOrFail($id);
    }

    /**
     * Créer un nouveau promoteur
     */
    public function creer(array $donnees): Promoteur
    {
        // Gérer l'upload de la photo
        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = uniqid() . '.' . $donnees['photo']->getClientOriginalExtension();
            $chemin = $donnees['photo']->storeAs('uploads/promoteurs', $nomFichier, 'public');
            $donnees['photo'] = '/storage/' . $chemin;
        }

        // Gérer l'upload de la licence
        if (isset($donnees['licence']) && $donnees['licence'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = uniqid() . '.' . $donnees['licence']->getClientOriginalExtension();
            $chemin = $donnees['licence']->storeAs('documents/promoteurs', $nomFichier, 'public');
            $donnees['licence'] = '/storage/' . $chemin;
        }

        // Gérer l'upload du registre de commerce
        if (isset($donnees['registre_commerce']) && $donnees['registre_commerce'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = uniqid() . '.' . $donnees['registre_commerce']->getClientOriginalExtension();
            $chemin = $donnees['registre_commerce']->storeAs('documents/promoteurs', $nomFichier, 'public');
            $donnees['registre_commerce'] = '/storage/' . $chemin;
        }

        Log::info('Création promoteur', ['donnees' => $donnees]);

        return Promoteur::create($donnees);
    }

    /**
     * Mettre à jour un promoteur
     */
    public function mettreAJour(int $id, array $donnees): Promoteur
    {
        $promoteur = $this->obtenirParId($id);

        // Gérer l'upload de la photo
        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            // Supprimer l'ancienne photo
            if ($promoteur->photo && str_starts_with($promoteur->photo, '/storage/')) {
                $ancienChemin = str_replace('/storage/', '', $promoteur->photo);
                Storage::disk('public')->delete($ancienChemin);
            }

            $nomFichier = uniqid() . '.' . $donnees['photo']->getClientOriginalExtension();
            $chemin = $donnees['photo']->storeAs('uploads/promoteurs', $nomFichier, 'public');
            $donnees['photo'] = '/storage/' . $chemin;
        }

        // Gérer l'upload de la licence
        if (isset($donnees['licence']) && $donnees['licence'] instanceof \Illuminate\Http\UploadedFile) {
            // Supprimer l'ancienne licence
            if ($promoteur->licence && str_starts_with($promoteur->licence, '/storage/')) {
                $ancienChemin = str_replace('/storage/', '', $promoteur->licence);
                Storage::disk('public')->delete($ancienChemin);
            }

            $nomFichier = uniqid() . '.' . $donnees['licence']->getClientOriginalExtension();
            $chemin = $donnees['licence']->storeAs('documents/promoteurs', $nomFichier, 'public');
            $donnees['licence'] = '/storage/' . $chemin;
        }

        // Gérer l'upload du registre de commerce
        if (isset($donnees['registre_commerce']) && $donnees['registre_commerce'] instanceof \Illuminate\Http\UploadedFile) {
            // Supprimer l'ancien registre
            if ($promoteur->registre_commerce && str_starts_with($promoteur->registre_commerce, '/storage/')) {
                $ancienChemin = str_replace('/storage/', '', $promoteur->registre_commerce);
                Storage::disk('public')->delete($ancienChemin);
            }

            $nomFichier = uniqid() . '.' . $donnees['registre_commerce']->getClientOriginalExtension();
            $chemin = $donnees['registre_commerce']->storeAs('documents/promoteurs', $nomFichier, 'public');
            $donnees['registre_commerce'] = '/storage/' . $chemin;
        }

        Log::info('Mise à jour promoteur', ['id' => $id, 'donnees' => $donnees]);

        $promoteur->update($donnees);
        return $promoteur;
    }

    /**
     * Supprimer un promoteur
     */
    public function supprimer(int $id): bool
    {
        $promoteur = $this->obtenirParId($id);

        // Supprimer les fichiers associés
        if ($promoteur->photo && str_starts_with($promoteur->photo, '/storage/')) {
            $chemin = str_replace('/storage/', '', $promoteur->photo);
            Storage::disk('public')->delete($chemin);
        }

        if ($promoteur->licence && str_starts_with($promoteur->licence, '/storage/')) {
            $chemin = str_replace('/storage/', '', $promoteur->licence);
            Storage::disk('public')->delete($chemin);
        }

        if ($promoteur->registre_commerce && str_starts_with($promoteur->registre_commerce, '/storage/')) {
            $chemin = str_replace('/storage/', '', $promoteur->registre_commerce);
            Storage::disk('public')->delete($chemin);
        }

        Log::info('Suppression promoteur', ['id' => $id]);

        return $promoteur->delete();
    }

    /**
     * Rechercher des promoteurs
     */
    public function rechercher(string $terme): LengthAwarePaginator
    {
        return Promoteur::where('nom', 'like', "%{$terme}%")
            ->orWhere('email', 'like', "%{$terme}%")
            ->orWhere('telephone', 'like', "%{$terme}%")
            ->with(['tenant', 'utilisateur'])
            ->orderBy('nom')
            ->paginate(20);
    }
}
