<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckPermission
{
    public function handle(Request $request, Closure $next, ...$permissions)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié',
            ], 401);
        }

        // Super admin a tous les droits
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Vérifier si l'utilisateur a au moins une des permissions requises
        if (!$user->hasAnyPermission($permissions)) {
            return response()->json([
                'success' => false,
                'message' => 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action',
            ], 403);
        }

        return $next($request);
    }
}
