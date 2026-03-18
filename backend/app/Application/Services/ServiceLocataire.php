<?php

namespace App\Application\Services;

use App\Domaine\Entities\Locataire;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des locataires
 */
class ServiceLocataire
{
    /**
     * Lister tous les locataires
     */
    public function lister($filtres = [])
    {
        $query = Locataire::with('tenant');

        // Filtre par recherche (nom, email, téléphone, profession)
        if (!empty($filtres['recherche'])) {
            $terme = strtolower($filtres['recherche']);
            $termeNormalise = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $terme);
            $query->where(function ($q) use ($terme, $termeNormalise) {
                $q->whereRaw('LOWER(nom) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(nom) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhereRaw('LOWER(telephone) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(telephone) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhereRaw('LOWER(profession) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(profession) LIKE ?', ["%{$termeNormalise}%"]);
            });
        }

        return $query->paginate(15);
    }

    /**
     * Créer un nouveau locataire
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            
            // Utiliser move() au lieu de storeAs()
            $destinationPath = storage_path('app/public/uploads/locataire');
            $donnees['photo']->move($destinationPath, $nomFichier);
            $donnees['photo'] = '/storage/uploads/locataire/' . $nomFichier;
        }
        
        return Locataire::create($donnees);
    }

    /**
     * Obtenir un locataire par ID
     */
    public function obtenirParId(int $id)
    {
        return Locataire::with('tenant')->findOrFail($id);
    }

    /**
     * Mettre à jour un locataire
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $locataire = Locataire::findOrFail($id);

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            
            // Utiliser move() au lieu de storeAs()
            $destinationPath = storage_path('app/public/uploads/locataire');
            $donnees['photo']->move($destinationPath, $nomFichier);
            $donnees['photo'] = '/storage/uploads/locataire/' . $nomFichier;
        }

        $locataire->update($donnees);
        
        return $locataire->fresh('tenant');
    }

    /**
     * Supprimer un locataire
     */
    public function supprimer(int $id)
    {
        $locataire = Locataire::findOrFail($id);
        $locataire->delete();
        
        return true;
    }
}
