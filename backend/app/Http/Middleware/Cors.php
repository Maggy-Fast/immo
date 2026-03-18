<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Origines autorisées
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];

        // Ajouter les URLs ngrok si présentes
        if (preg_match('/\.ngrok-free\.app$/', $request->header('Origin'))) {
            $allowedOrigins[] = $request->header('Origin');
        }

        $origin = $request->header('Origin');

        // Gérer les requêtes OPTIONS (preflight)
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0])
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }

        // Traiter la requête normale
        $response = $next($request);

        // Pour les BinaryFileResponse (téléchargements), utiliser withHeaders() au lieu de header()
        if ($response instanceof \Symfony\Component\HttpFoundation\BinaryFileResponse) {
            $response->headers->set('Access-Control-Allow-Origin', in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0]);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            return $response;
        }

        // Ajouter les headers CORS à la réponse normale
        return $response
            ->header('Access-Control-Allow-Origin', in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0])
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
