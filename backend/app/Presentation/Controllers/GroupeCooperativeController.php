<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceGroupeCooperative;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupeCooperativeController extends Controller
{
    protected $serviceGroupe;

    public function __construct(ServiceGroupeCooperative $serviceGroupe)
    {
        $this->serviceGroupe = $serviceGroupe;
    }

    public function index()
    {
        return response()->json([
            'donnees' => $this->serviceGroupe->lister(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $groupe = $this->serviceGroupe->creer($request->all());

        return response()->json($groupe, 201);
    }

    public function show($id)
    {
        return response()->json($this->serviceGroupe->obtenirParId((int) $id));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Les données fournies sont invalides.',
                'erreurs' => $validator->errors(),
            ], 422);
        }

        $groupe = $this->serviceGroupe->mettreAJour((int) $id, $request->all());

        return response()->json($groupe);
    }

    public function destroy($id)
    {
        try {
            $this->serviceGroupe->supprimer((int) $id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}
