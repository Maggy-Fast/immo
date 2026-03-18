<?php

namespace App\Application\Services;

use App\Domaine\Entities\Proprietaire;
use Illuminate\Support\Facades\Auth;

/**
 * Service Application pour la gestion des propriétaires
 */
class ServiceProprietaire
{
    /**
     * Lister tous les propriétaires
     */
    public function lister(array $filtres = [])
    {
        $query = Proprietaire::with('tenant');
        
        // Appliquer la recherche si présente
        if (!empty($filtres['recherche'])) {
            $terme = strtolower($filtres['recherche']);
            $termeNormalise = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $terme);
            $query->where(function ($q) use ($terme, $termeNormalise) {
                $q->whereRaw('LOWER(nom) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(nom) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(email) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhere('telephone', 'LIKE', "%{$terme}%")
                  ->orWhere('cin', 'LIKE', "%{$terme}%");
            });
        }
        
        return $query->paginate(15);
    }

    /**
     * Créer un nouveau propriétaire
     */
    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            
            // Log avant upload
            \Log::info('Upload photo proprietaire - AVANT', [
                'nom_fichier' => $nomFichier,
                'taille_fichier' => $donnees['photo']->getSize(),
                'extension' => $donnees['photo']->getClientOriginalExtension(),
                'mime_type' => $donnees['photo']->getMimeType(),
                'destination' => 'public/uploads/proprietaire/' . $nomFichier
            ]);
            
            // Utiliser move() au lieu de storeAs()
            $destinationPath = storage_path('app/public/uploads/proprietaire');
            $donnees['photo']->move($destinationPath, $nomFichier);
            $resultat = 'public/uploads/proprietaire/' . $nomFichier;
            
            // Log détaillé après upload
            \Log::info('Upload photo proprietaire - APRES', [
                'proprietaire_id' => $id ?? 'new',
                'resultat_store' => $resultat,
                'nom_fichier' => $nomFichier,
                'url_finale' => '/storage/uploads/proprietaire/' . $nomFichier,
                'fichier_existe' => storage_path('app/public/uploads/proprietaire/' . $nomFichier),
                'fichier_existe_bool' => file_exists(storage_path('app/public/uploads/proprietaire/' . $nomFichier)),
                'dossier_uploads' => storage_path('app/public/uploads/proprietaire'),
                'dossier_existe' => file_exists(storage_path('app/public/uploads/proprietaire')),
                'dossier_writable' => is_writable(storage_path('app/public/uploads/proprietaire')),
                'contenu_dossier' => file_exists(storage_path('app/public/uploads/proprietaire')) ? scandir(storage_path('app/public/uploads/proprietaire')) : 'dossier_inexistant'
            ]);
            
            $donnees['photo'] = '/storage/uploads/proprietaire/' . $nomFichier;
        }
        
        return Proprietaire::create($donnees);
    }

    /**
     * Obtenir un propriétaire par ID
     */
    public function obtenirParId(int $id)
    {
        return Proprietaire::with('tenant')->findOrFail($id);
    }

    /**
     * Mettre à jour un propriétaire
     */
    public function mettreAJour(int $id, array $donnees)
    {
        $proprietaire = Proprietaire::findOrFail($id);

        if (isset($donnees['photo']) && $donnees['photo'] instanceof \Illuminate\Http\UploadedFile) {
            // Optionnel: supprimer l'ancienne photo si elle existe
            $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $donnees['photo']->getClientOriginalExtension();
            
            // Log avant upload (mise à jour)
            \Log::info('Upload photo proprietaire (UPDATE) - AVANT', [
                'proprietaire_id' => $id,
                'ancienne_photo' => $proprietaire->photo,
                'nom_fichier' => $nomFichier,
                'taille_fichier' => $donnees['photo']->getSize(),
                'extension' => $donnees['photo']->getClientOriginalExtension(),
                'mime_type' => $donnees['photo']->getMimeType(),
                'destination' => 'public/uploads/proprietaire/' . $nomFichier
            ]);
            
            // Utiliser move() au lieu de storeAs()
            $destinationPath = storage_path('app/public/uploads/proprietaire');
            $donnees['photo']->move($destinationPath, $nomFichier);
            $resultat = 'public/uploads/proprietaire/' . $nomFichier;
            
            // Log détaillé après upload (mise à jour)
            \Log::info('Upload photo proprietaire (UPDATE) - APRES', [
                'proprietaire_id' => $id,
                'resultat_store' => $resultat,
                'nom_fichier' => $nomFichier,
                'url_finale' => '/storage/uploads/proprietaire/' . $nomFichier,
                'fichier_existe' => storage_path('app/public/uploads/proprietaire/' . $nomFichier),
                'fichier_existe_bool' => file_exists(storage_path('app/public/uploads/proprietaire/' . $nomFichier)),
                'dossier_uploads' => storage_path('app/public/uploads/proprietaire'),
                'dossier_existe' => file_exists(storage_path('app/public/uploads/proprietaire')),
                'dossier_writable' => is_writable(storage_path('app/public/uploads/proprietaire')),
                'contenu_dossier' => file_exists(storage_path('app/public/uploads/proprietaire')) ? scandir(storage_path('app/public/uploads/proprietaire')) : 'dossier_inexistant'
            ]);
            
            $donnees['photo'] = '/storage/uploads/proprietaire/' . $nomFichier;
        }

        $proprietaire->update($donnees);
        
        return $proprietaire->fresh('tenant');
    }

    /**
     * Supprimer un propriétaire
     */
    public function supprimer(int $id)
    {
        $proprietaire = Proprietaire::findOrFail($id);
        $proprietaire->delete();
        
        return true;
    }
}
