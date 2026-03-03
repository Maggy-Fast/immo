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

        $utilisateur = Utilisateur::where('email', $request->email)->first();

        if (! $utilisateur || ! Hash::check($request->password, $utilisateur->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        return [
            'token' => $utilisateur->createToken('auth_token')->plainTextToken,
            'utilisateur' => $utilisateur,
        ];
    }

    public function deconnexion(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    }

    public function profil(Request $request)
    {
        return $request->user();
    }
}
