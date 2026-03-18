<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceDocumentFoncier;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class DocumentFoncierController extends Controller
{
    protected $service;

    public function __construct(ServiceDocumentFoncier $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filtres = $request->only(['id_bien', 'type', 'recherche']);
        $documents = $this->service->lister($filtres);

        $donnees = array_map(function ($doc) {
            return $this->service->formaterPourApi($doc);
        }, $documents->items());

        return response()->json([
            'donnees' => $donnees,
            'meta' => [
                'page_courante' => $documents->currentPage(),
                'total_pages' => $documents->lastPage(),
                'total' => $documents->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_bien' => 'required|exists:biens,id',
            'titre' => 'required|string|max:255',
            'type' => 'required|string|max:100',
            'fichier' => 'required|file|mimetypes:application/pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $donnees = $request->all();
        $donnees['fichier'] = $request->file('fichier');

        $fichier = $donnees['fichier'];
        if (!$this->estUnPdfValide($fichier->getRealPath())) {
            return response()->json([
                'message' => 'Le fichier doit être un PDF valide.',
            ], 422);
        }

        $document = $this->service->creer($donnees);

        return response()->json($this->service->formaterPourApi($document), 201);
    }

    public function telecharger($id)
    {
        $document = $this->service->obtenirParId((int) $id);

        if (empty($document->chemin_fichier) || !Storage::disk('public')->exists($document->chemin_fichier)) {
            return response()->json(['message' => 'Fichier introuvable.'], 404);
        }

        $nomBase = Str::slug((string) $document->titre);
        $nomBase = $nomBase !== '' ? $nomBase : 'document-foncier';
        $nomFichier = $nomBase.'.pdf';

        $cheminAbsolu = Storage::disk('public')->path($document->chemin_fichier);

        if (!$this->estUnPdfValide($cheminAbsolu)) {
            return response()->json([
                'message' => 'Le fichier associé à ce document n\'est pas un PDF valide. Veuillez le remplacer.',
            ], 422);
        }

        return response()->download($cheminAbsolu, $nomFichier, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    private function estUnPdfValide(?string $cheminFichier): bool
    {
        if (empty($cheminFichier) || !is_file($cheminFichier) || !is_readable($cheminFichier)) {
            return false;
        }

        $handle = @fopen($cheminFichier, 'rb');
        if ($handle === false) {
            return false;
        }

        $entete = (string) fread($handle, 5);
        fclose($handle);

        return $entete === '%PDF-';
    }

    public function show($id)
    {
        $document = $this->service->obtenirParId((int) $id);
        return response()->json($this->service->formaterPourApi($document));
    }

    public function destroy($id)
    {
        $this->service->supprimer((int) $id);
        return response()->json(null, 204);
    }
}
