<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    /**
     * Servir les fichiers du storage
     */
    public function serve($path)
    {
        // Log de la demande
        \Log::info('FileController - Demande de fichier', [
            'path_demande' => $path,
            'timestamp' => now(),
            'user_agent' => request()->userAgent(),
            'ip' => request()->ip()
        ]);
        
        // Sécuriser le chemin pour éviter les attaques path traversal
        $path = str_replace('..', '', $path);
        
        // Si le chemin ne commence pas par storage, l'ajouter
        if (!str_starts_with($path, 'storage/')) {
            $fullPath = storage_path('app/public/' . $path);
        } else {
            $fullPath = storage_path('app/public/' . str_replace('storage/', '', $path));
        }
        
        // Log du chemin résolu
        \Log::info('FileController - Chemin résolu', [
            'path_original' => $path,
            'full_path' => $fullPath,
            'file_exists' => file_exists($fullPath),
            'is_file' => is_file($fullPath)
        ]);
        
        // Vérifier que le fichier existe
        if (!file_exists($fullPath)) {
            \Log::warning('FileController - Fichier non trouvé', [
                'path' => $path,
                'full_path' => $fullPath
            ]);
            
            // Retourner une image par défaut si c'est une image de propriétaire
            if (strpos($path, 'proprietaire') !== false && (strpos($path, '.jpg') !== false || strpos($path, '.jpeg') !== false || strpos($path, '.png') !== false)) {
                $defaultPath = public_path('images/default-avatar.svg');
                \Log::info('FileController - Utilisation avatar par défaut', [
                    'default_path' => $defaultPath,
                    'default_exists' => file_exists($defaultPath)
                ]);
                
                if (file_exists($defaultPath)) {
                    $headers = [
                        'Content-Type' => 'image/svg+xml',
                        'Access-Control-Allow-Origin' => '*',
                        'Access-Control-Allow-Methods' => 'GET',
                        'Access-Control-Allow-Headers' => 'Content-Type',
                    ];
                    return response()->file($defaultPath, $headers);
                }
            }
            abort(404);
        }
        
        // Vérifier que c'est bien un fichier
        if (!is_file($fullPath)) {
            \Log::warning('FileController - Pas un fichier', [
                'path' => $path,
                'full_path' => $fullPath
            ]);
            abort(403);
        }
        
        // Déterminer le MIME type
        $mimeType = mime_content_type($fullPath);
        
        \Log::info('FileController - Fichier servi avec succès', [
            'path' => $path,
            'mime_type' => $mimeType,
            'file_size' => filesize($fullPath)
        ]);
        
        // Headers pour autoriser l'accès depuis le frontend
        $headers = [
            'Content-Type' => $mimeType,
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET',
            'Access-Control-Allow-Headers' => 'Content-Type',
        ];
        
        return response()->file($fullPath, $headers);
    }
}
