<?php

namespace App\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Application\Services\ServiceTenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class TenantController extends Controller
{
    protected $serviceTenant;

    public function __construct(ServiceTenant $serviceTenant)
    {
        $this->serviceTenant = $serviceTenant;
    }

    public function index()
    {
        $tenants = $this->serviceTenant->listerTenants();
        return response()->json([
            'success' => true,
            'data' => $tenants
        ]);
    }

    public function show($id)
    {
        try {
            $tenant = $this->serviceTenant->obtenirTenant($id);
            return response()->json([
                'success' => true,
                'data' => $tenant
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'domaine' => 'nullable|string|max:255|unique:tenants,domaine',
            'plan' => 'sometimes|string|in:gratuit,pro,premium',
            'admin_nom' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'admin_password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'success' => false,
                'message' => $errors->first(),
                'errors' => $errors
            ], 422);
        }

        try {
            $tenant = $this->serviceTenant->creerTenant($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Tenant créé avec succès',
                'data' => $tenant
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du tenant : ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'domaine' => 'sometimes|string|max:255|unique:tenants,domaine,' . $id,
            'plan' => 'sometimes|string|in:gratuit,pro,premium',
            'actif' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $tenant = $this->serviceTenant->modifierTenant($id, $request->all());
            return response()->json([
                'success' => true,
                'message' => 'Tenant mis à jour avec succès',
                'data' => $tenant
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->serviceTenant->supprimerTenant($id);
            return response()->json([
                'success' => true,
                'message' => 'Tenant supprimé avec succès'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus(Request $request, $id)
    {
        try {
            $tenant = $this->serviceTenant->changerStatut($id, $request->actif);
            return response()->json([
                'success' => true,
                'message' => 'Statut du tenant mis à jour avec succès',
                'data' => $tenant
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
