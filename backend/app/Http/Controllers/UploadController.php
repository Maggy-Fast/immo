<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Upload une image
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
            'type' => 'required|in:bien,profil,lotissement,parcelle',
        ]);

        try {
            $type = $request->input('type');
            $image = $request->file('image');
            
            // Générer un nom unique
            $nomFichier = Str::uuid() . '.' . $image->getClientOriginalExtension();
            
            // Stocker dans public/storage/uploads/{type}
            $chemin = $image->storeAs("uploads/{$type}", $nomFichier, 'public');
            
            return response()->json([
                'success' => true,
                'url' => Storage::url($chemin),
                'path' => $chemin,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload multiple images
     */
    public function uploadMultiple(Request $request)
    {
        $request->validate([
            'images' => 'required|array|max:10',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'type' => 'required|in:bien,profil,lotissement,parcelle',
        ]);

        try {
            $type = $request->input('type');
            $images = $request->file('images');
            $urls = [];

            foreach ($images as $image) {
                $nomFichier = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $chemin = $image->storeAs("uploads/{$type}", $nomFichier, 'public');
                
                $urls[] = [
                    'url' => Storage::url($chemin),
                    'path' => $chemin,
                ];
            }

            return response()->json([
                'success' => true,
                'images' => $urls,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Supprimer une image
     */
    public function deleteImage(Request $request)
    {
        $request->validate([
            'path' => 'required|string',
        ]);

        try {
            $path = $request->input('path');
            
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'success' => true,
                'message' => 'Image supprimée',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
