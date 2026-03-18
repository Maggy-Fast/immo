<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceRole;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class RoleController extends Controller
{
    protected ServiceRole $serviceRole;

    public function __construct(ServiceRole $serviceRole)
    {
        $this->serviceRole = $serviceRole;
    }

    public function index()
    {
        try {
            $roles = $this->serviceRole->listerRoles();
            
            return response()->json([
                'success' => true,
                'data' => $roles,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $role = $this->serviceRole->obtenirRole($id);
            
            return response()->json([
                'success' => true,
                'data' => $role,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|unique:roles,nom|max:255',
            'libelle' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $role = $this->serviceRole->creerRole($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Rôle créé avec succès',
                'data' => $role,
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|unique:roles,nom,' . $id . '|max:255',
            'libelle' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $role = $this->serviceRole->modifierRole($id, $request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Rôle modifié avec succès',
                'data' => $role,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->serviceRole->supprimerRole($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Rôle supprimé avec succès',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function assignerPermissions(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $role = $this->serviceRole->assignerPermissions($id, $request->permissions);
            
            return response()->json([
                'success' => true,
                'message' => 'Permissions assignées avec succès',
                'data' => $role,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function listerPermissions()
    {
        try {
            $permissions = $this->serviceRole->listerPermissions();
            
            return response()->json([
                'success' => true,
                'data' => $permissions,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function obtenirPermissionsRole($id)
    {
        try {
            $permissions = $this->serviceRole->obtenirPermissionsRole($id);
            
            return response()->json([
                'success' => true,
                'data' => $permissions,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
