<?php

namespace App\Application\Services;

use App\Domaine\Entities\DocumentFoncier;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceDocumentFoncier
{
    public function lister(array $filtres = [])
    {
        $query = DocumentFoncier::with(['bien', 'tenant']);

        if (!empty($filtres['id_bien'])) {
            $query->where('id_bien', $filtres['id_bien']);
        }

        if (!empty($filtres['type'])) {
            $query->where('type', $filtres['type']);
        }

        if (!empty($filtres['recherche'])) {
            $recherche = $filtres['recherche'];
            $query->where(function ($q) use ($recherche) {
                $q->where('titre', 'like', "%{$recherche}%")
                    ->orWhere('type', 'like', "%{$recherche}%");
            });
        }

        return $query->orderByDesc('id')->paginate(15);
    }

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;

        if (isset($donnees['fichier']) && $donnees['fichier'] instanceof UploadedFile) {
            $donnees['chemin_fichier'] = $this->stockerFichier($donnees['fichier']);
            unset($donnees['fichier']);
        }

        return DocumentFoncier::create($donnees);
    }

    public function obtenirParId(int $id)
    {
        return DocumentFoncier::with(['bien', 'tenant'])->findOrFail($id);
    }

    public function supprimer(int $id)
    {
        $doc = DocumentFoncier::findOrFail($id);

        if (!empty($doc->chemin_fichier) && Storage::disk('public')->exists($doc->chemin_fichier)) {
            Storage::disk('public')->delete($doc->chemin_fichier);
        }

        $doc->delete();

        return true;
    }

    private function stockerFichier(UploadedFile $fichier): string
    {
        $nom = (string) Str::uuid().'.pdf';

        return $fichier->storeAs('uploads/documents-fonciers', $nom, 'public');
    }

    public function formaterPourApi(DocumentFoncier $document): array
    {
        return [
            'id' => $document->id,
            'id_bien' => $document->id_bien,
            'titre' => $document->titre,
            'type' => $document->type,
            'chemin_fichier' => $document->chemin_fichier,
            'url' => $document->chemin_fichier ? Storage::url($document->chemin_fichier) : null,
            'created_at' => $document->created_at,
            'updated_at' => $document->updated_at,
            'bien' => $document->bien,
        ];
    }
}
