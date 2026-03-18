<?php

namespace App\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UtilisateurController extends Controller
{
    /**
     * Obtenir le profil de l'utilisateur connecté
     */
    public function profil(Request $request)
    {
        $utilisateur = $request->user()->load(['roleEntity.permissions']);
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $utilisateur->id,
                'nom' => $utilisateur->nom,
                'email' => $utilisateur->email,
                'telephone' => $utilisateur->telephone,
                'role' => $utilisateur->role,
                'id_role' => $utilisateur->id_role,
                'role_info' => $utilisateur->roleEntity ? [
                    'id' => $utilisateur->roleEntity->id,
                    'nom' => $utilisateur->roleEntity->nom,
                    'libelle' => $utilisateur->roleEntity->libelle,
                    'permissions' => $utilisateur->roleEntity->permissions->pluck('nom')->toArray(),
                ] : null,
            ],
        ]);
    }

    /**
     * Mettre à jour le profil
     */
    public function mettreAJourProfil(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:utilisateurs,email,' . $request->user()->id,
            'telephone' => 'sometimes|string|max:20',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $utilisateur = $request->user();
            $donnees = $request->only(['nom', 'email', 'telephone']);

            if ($request->hasFile('photo')) {
                $nomFichier = \Illuminate\Support\Str::uuid() . '.' . $request->file('photo')->getClientOriginalExtension();
                $request->file('photo')->storeAs('public/uploads/utilisateur', $nomFichier);
                $donnees['photo'] = '/storage/uploads/utilisateur/' . $nomFichier;
            }

            $utilisateur->update($donnees);

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => $utilisateur,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
            ], 500);
        }
    }

    /**
     * Changer le mot de passe
     */
    public function changerMotDePasse(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mot_de_passe_actuel' => 'required|string',
            'nouveau_mot_de_passe' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        $utilisateur = $request->user();

        // Vérifier le mot de passe actuel
        if (!Hash::check($request->mot_de_passe_actuel, $utilisateur->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect',
            ], 422);
        }

        try {
            $utilisateur->password = Hash::make($request->nouveau_mot_de_passe);
            $utilisateur->save();

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe changé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du changement de mot de passe',
            ], 500);
        }
    }

    /**
     * Obtenir les préférences utilisateur
     */
    public function obtenirPreferences(Request $request)
    {
        $utilisateur = $request->user();
        $preferences = $utilisateur->preferences ?: \App\Domaine\Entities\PreferencesUtilisateur::create([
            'id_utilisateur' => $utilisateur->id
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $preferences,
        ]);
    }

    /**
     * Mettre à jour les préférences
     */
    public function mettreAJourPreferences(Request $request)
    {
        $utilisateur = $request->user();
        $preferences = $utilisateur->preferences ?: new \App\Domaine\Entities\PreferencesUtilisateur(['id_utilisateur' => $utilisateur->id]);
        
        $preferences->fill($request->only([
            'theme', 'langue', 'notifications_email', 'notifications_whatsapp', 'format_date', 'devise'
        ]));
        $preferences->save();

        return response()->json([
            'success' => true,
            'message' => 'Préférences mises à jour avec succès',
            'data' => $preferences,
        ]);
    }

    /**
     * Obtenir les informations système (Super Admin uniquement)
     */
    public function informationsSysteme(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            // Informations de la base de données
            $dbConnection = DB::connection()->getPdo();
            $dbVersion = $dbConnection->getAttribute(\PDO::ATTR_SERVER_VERSION);
            $dbDriver = DB::connection()->getDriverName();

            // Taille de la base de données (PostgreSQL)
            $dbSize = 0;
            if ($dbDriver === 'pgsql') {
                $dbName = DB::connection()->getDatabaseName();
                $result = DB::select("SELECT pg_database_size(?) as size", [$dbName]);
                $dbSize = $result[0]->size ?? 0;
            }

            // Statistiques
            $stats = [
                'utilisateurs' => DB::table('utilisateurs')->count(),
                'roles' => DB::table('roles')->count(),
                'tenants' => DB::table('tenants')->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'version' => '1.0.0',
                    'environnement' => config('app.env'),
                    'base_donnees' => [
                        'driver' => $dbDriver,
                        'version' => $dbVersion,
                        'taille' => $dbSize,
                        'taille_formatee' => $this->formatBytes($dbSize),
                    ],
                    'stockage' => [
                        'utilise' => $dbSize,
                        'total' => 10 * 1024 * 1024 * 1024, // 10 GB
                        'pourcentage' => round(($dbSize / (10 * 1024 * 1024 * 1024)) * 100, 2),
                    ],
                    'statistiques' => $stats,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des informations système',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Vider le cache
     */
    public function viderCache(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            \Illuminate\Support\Facades\Artisan::call('cache:clear');
            \Illuminate\Support\Facades\Artisan::call('config:clear');
            \Illuminate\Support\Facades\Artisan::call('route:clear');
            \Illuminate\Support\Facades\Artisan::call('view:clear');

            return response()->json([
                'success' => true,
                'message' => 'Cache vidé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du vidage du cache',
            ], 500);
        }
    }

    /**
     * Exporter les données
     */
    public function exporterDonnees(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            $idTenant = $request->user()->id_tenant;
            
            // Exporter les données du tenant
            $donnees = [
                'export_date' => now()->toIso8601String(),
                'tenant' => DB::table('tenants')->where('id', $idTenant)->first(),
                'utilisateurs' => DB::table('utilisateurs')->where('id_tenant', $idTenant)->get(),
                'adherents' => DB::table('adherents')->where('id_tenant', $idTenant)->get(),
                'parcelles_cooperative' => DB::table('parcelles_cooperative')->where('id_tenant', $idTenant)->get(),
                'biens' => DB::table('biens')->where('id_tenant', $idTenant)->get(),
                'contrats' => DB::table('contrats')->where('id_tenant', $idTenant)->get(),
            ];

            $nomFichier = 'export_' . $idTenant . '_' . now()->format('Y-m-d_His') . '.json';
            $cheminFichier = storage_path('app/exports/' . $nomFichier);

            // Créer le dossier si nécessaire
            if (!file_exists(storage_path('app/exports'))) {
                mkdir(storage_path('app/exports'), 0755, true);
            }

            // Sauvegarder le fichier
            file_put_contents($cheminFichier, json_encode($donnees, JSON_PRETTY_PRINT));

            return response()->download($cheminFichier, $nomFichier)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'export des données',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtenir les logs système
     */
    public function obtenirLogs(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            $fichierLog = storage_path('logs/laravel.log');
            
            if (!file_exists($fichierLog)) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'logs' => [],
                        'message' => 'Aucun log disponible',
                    ],
                ]);
            }

            // Lire les 100 dernières lignes
            $lignes = [];
            $fichier = new \SplFileObject($fichierLog, 'r');
            $fichier->seek(PHP_INT_MAX);
            $derniereLigne = $fichier->key();
            $debut = max(0, $derniereLigne - 100);
            
            $fichier->seek($debut);
            while (!$fichier->eof()) {
                $ligne = $fichier->current();
                if (!empty(trim($ligne))) {
                    $lignes[] = $ligne;
                }
                $fichier->next();
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'logs' => array_reverse($lignes),
                    'total_lignes' => $derniereLigne,
                    'fichier' => $fichierLog,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la lecture des logs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sauvegarder la base de données
     */
    public function sauvegarderBase(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            $dbDriver = DB::connection()->getDriverName();
            $dbName = DB::connection()->getDatabaseName();
            $nomFichier = 'backup_' . $dbName . '_' . now()->format('Y-m-d_His');
            
            if ($dbDriver === 'pgsql') {
                // Vérifier si pg_dump est disponible
                exec('pg_dump --version 2>&1', $versionOutput, $versionReturn);
                if ($versionReturn !== 0) {
                    return response()->json([
                        'success' => false,
                        'message' => 'pg_dump n\'est pas installé ou n\'est pas accessible. Veuillez installer PostgreSQL client tools.',
                    ], 500);
                }

                // Backup PostgreSQL
                $host = config('database.connections.pgsql.host');
                $port = config('database.connections.pgsql.port');
                $username = config('database.connections.pgsql.username');
                $password = config('database.connections.pgsql.password');
                
                $cheminFichier = storage_path('app/backups/' . $nomFichier . '.sql');
                
                // Créer le dossier si nécessaire
                if (!file_exists(storage_path('app/backups'))) {
                    mkdir(storage_path('app/backups'), 0755, true);
                }

                // Commande pg_dump (Windows compatible)
                $isWindows = strtoupper(substr(PHP_OS, 0, 3)) === 'WIN';
                
                if ($isWindows) {
                    // Sur Windows, utiliser SET pour la variable d'environnement
                    $commande = sprintf(
                        'SET PGPASSWORD=%s && pg_dump -h %s -p %s -U %s -F p -f %s %s 2>&1',
                        $password,
                        $host,
                        $port,
                        $username,
                        $cheminFichier,
                        $dbName
                    );
                } else {
                    // Sur Linux/Mac
                    $commande = sprintf(
                        'PGPASSWORD=%s pg_dump -h %s -p %s -U %s -F p -f %s %s 2>&1',
                        escapeshellarg($password),
                        escapeshellarg($host),
                        escapeshellarg($port),
                        escapeshellarg($username),
                        escapeshellarg($cheminFichier),
                        escapeshellarg($dbName)
                    );
                }

                exec($commande, $output, $returnVar);

                if ($returnVar !== 0 || !file_exists($cheminFichier)) {
                    $errorMsg = implode("\n", $output);
                    throw new \Exception('Erreur pg_dump: ' . $errorMsg);
                }

                // Compresser le fichier si ZipArchive est disponible
                if (class_exists('ZipArchive')) {
                    $cheminZip = storage_path('app/backups/' . $nomFichier . '.zip');
                    $zip = new \ZipArchive();
                    if ($zip->open($cheminZip, \ZipArchive::CREATE) === true) {
                        $zip->addFile($cheminFichier, $nomFichier . '.sql');
                        $zip->close();
                        unlink($cheminFichier); // Supprimer le fichier SQL non compressé
                        $cheminFichier = $cheminZip;
                    }
                }

                return response()->download($cheminFichier, basename($cheminFichier))->deleteFileAfterSend(true);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Backup non supporté pour ce type de base de données',
                ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde de la base',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Liste globale des utilisateurs (Super Admin uniquement)
     */
    public function listeUtilisateursGlobale(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $query = \App\Domaine\Entities\Utilisateur::with(['tenant', 'roleEntity']);

        if ($request->has('recherche')) {
            $recherche = $request->recherche;
            $query->where(function(\Illuminate\Database\Eloquent\Builder $q) use ($recherche) {
                $q->where('nom', 'like', "%$recherche%")
                  ->orWhere('email', 'like', "%$recherche%");
            });
        }

        if ($request->has('id_tenant')) {
            $query->where('id_tenant', $request->id_tenant);
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(20),
        ]);
    }

    /**
     * Réinitialiser le mot de passe d'un utilisateur (Super Admin uniquement)
     */
    public function reinitialiserMotDePasseUtilisateur(Request $request, $id)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        $request->validate([
            'nouveau_mot_de_passe' => 'required|string|min:8',
        ]);

        try {
            $utilisateur = \App\Domaine\Entities\Utilisateur::findOrFail($id);
            $utilisateur->password = Hash::make($request->nouveau_mot_de_passe);
            $utilisateur->save();

            return response()->json([
                'success' => true,
                'message' => 'Mot de passe réinitialisé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la réinitialisation',
            ], 500);
        }
    }

    /**
     * Formater les bytes en format lisible
     */
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
