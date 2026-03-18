<?php

namespace App\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Domaine\Entities\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function connexion(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $utilisateur = Utilisateur::with(['roleEntity.permissions'])->where('email', $request->email)->first();

        if (! $utilisateur || ! Hash::check($request->password, $utilisateur->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        $utilisateurData = $utilisateur->toArray();
        $utilisateurData['role_info'] = $utilisateur->roleEntity ? [
            'id' => $utilisateur->roleEntity->id,
            'nom' => $utilisateur->roleEntity->nom,
            'libelle' => $utilisateur->roleEntity->libelle,
            'permissions' => $utilisateur->roleEntity->permissions->pluck('nom')->toArray(),
        ] : null;

        return [
            'token' => $utilisateur->createToken('auth_token')->plainTextToken,
            'utilisateur' => $utilisateurData,
        ];
    }

    public function deconnexion(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    }

    public function profil(Request $request)
    {
        $utilisateur = $request->user()->load(['roleEntity.permissions']);
        
        $utilisateurData = $utilisateur->toArray();
        $utilisateurData['role_info'] = $utilisateur->roleEntity ? [
            'id' => $utilisateur->roleEntity->id,
            'nom' => $utilisateur->roleEntity->nom,
            'libelle' => $utilisateur->roleEntity->libelle,
            'permissions' => $utilisateur->roleEntity->permissions->pluck('nom')->toArray(),
        ] : null;

        return $utilisateurData;
    }
}
