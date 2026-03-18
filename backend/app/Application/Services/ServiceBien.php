<?php



namespace App\Application\Services;



use App\Domaine\Entities\Bien;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;



/**

 * Service Application pour la gestion des biens

 * Orchestre les cas d'utilisation métier

 */

class ServiceBien

{

    /**

     * Lister tous les biens avec filtres

     */

    public function lister(array $filtres = [])
    {
        $query = Bien::with(['proprietaire', 'tenant', 'contratActif.locataire']);



        // Filtre par type

        if (!empty($filtres['type'])) {

            $query->where('type', $filtres['type']);

        }



        // Filtre par statut

        if (!empty($filtres['statut'])) {

            $query->where('statut', $filtres['statut']);

        }



        // Filtre par propriétaire

        if (!empty($filtres['id_proprietaire'])) {

            $query->where('id_proprietaire', $filtres['id_proprietaire']);

        }

        // Filtre par recherche (adresse, description)
        if (!empty($filtres['recherche'])) {
            $terme = strtolower($filtres['recherche']);
            $termeNormalise = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $terme);
            $query->where(function ($q) use ($terme, $termeNormalise) {
                $q->whereRaw('LOWER(adresse) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(adresse) LIKE ?', ["%{$termeNormalise}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$terme}%"])
                  ->orWhereRaw('LOWER(description) LIKE ?', ["%{$termeNormalise}%"]);
            });
        }

        return $query->paginate(15);
    }



    /**

     * Créer un nouveau bien

     */

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;
        
        if (isset($donnees['images']) && is_array($donnees['images'])) {
            $photos = [];
            foreach ($donnees['images'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $nomFichier = Str::uuid() . '.' . $image->getClientOriginalExtension();
                    $chemin = $image->storeAs("uploads/bien", $nomFichier, 'public');
                    $photos[] = '/storage/uploads/bien/' . $nomFichier; // URL compatible avec le FileController
                }
            }
            $donnees['photos'] = $photos;
        }
        
        return Bien::create($donnees);
    }



    /**

     * Obtenir un bien par ID

     */

    public function obtenirParId(int $id)
    {
        return Bien::with(['proprietaire', 'tenant', 'contratActif.locataire'])->findOrFail($id);
    }



    /**

     * Mettre à jour un bien

     */

    public function mettreAJour(int $id, array $donnees)
    {
        $bien = Bien::findOrFail($id);
        
        // Gérer les images
        // 'photos' peut contenir les URLs des images existantes à conserver
        $photosConservees = $donnees['photos'] ?? $bien->photos ?? [];
        if (is_string($photosConservees)) {
            $photosConservees = json_decode($photosConservees, true) ?? [];
        }
        
        $photosFinales = is_array($photosConservees) ? $photosConservees : [];

        // Supprimer les images physiques qui ne sont plus présentes
        if (is_array($bien->photos)) {
            foreach ($bien->photos as $anciennePhoto) {
                if (!in_array($anciennePhoto, $photosFinales)) {
                    $this->supprimerFichierPhysique($anciennePhoto);
                }
            }
        }

        // Ajouter les nouvelles images (fichiers)
        if (isset($donnees['images']) && is_array($donnees['images'])) {
            foreach ($donnees['images'] as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $nomFichier = Str::uuid() . '.' . $image->getClientOriginalExtension();
                    $chemin = $image->storeAs("uploads/bien", $nomFichier, 'public');
                    $photosFinales[] = '/storage/uploads/bien/' . $nomFichier; // URL compatible avec le FileController
                }
            }
        }
        
        $donnees['photos'] = $photosFinales;
        
        $bien->update($donnees);
        
        return $bien->fresh(['proprietaire', 'tenant']);
    }



    /**

     * Supprimer un bien

     */

    public function supprimer(int $id)
    {
        $bien = Bien::findOrFail($id);
        
        // Supprimer les images physiques
        if (is_array($bien->photos)) {
            foreach ($bien->photos as $photo) {
                $this->supprimerFichierPhysique($photo);
            }
        }
        
        $bien->delete();
        
        return true;
    }

    /**
     * Supprimer un fichier physique à partir de son URL
     */
    private function supprimerFichierPhysique($url)
    {
        if (!$url) return;
        
        // Extraire le chemin relatif de l'URL
        // storage/uploads/bien/uuid.jpg
        $baseUrl = Storage::url('');
        $path = str_replace($baseUrl, '', $url);
        $path = ltrim($path, '/');
        
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}

