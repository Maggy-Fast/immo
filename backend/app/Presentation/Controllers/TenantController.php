<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceTenant;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class TenantController extends Controller
{
    protected ServiceTenant $serviceTenant;

    public function __construct(ServiceTenant $serviceTenant)
    {
        $this->serviceTenant = $serviceTenant;
    }

    public function index()
    {
        try {
            $tenants = $this->serviceTenant->listerTenants();
            return response()->json([
                'success' => true,
                'data' => $tenants,
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
            $tenant = $this->serviceTenant->obtenirTenant($id);
            return response()->json([
                'success' => true,
                'data' => $tenant,
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
            'nom' => 'required|string|max:255',
            'domaine' => 'nullable|string|unique:tenants,domaine|max:255',
            'plan' => 'sometimes|string|in:gratuit,pro,premium',
            'actif' => 'sometimes|boolean',
            // Admin default user
            'admin_nom' => 'required_without:id|string|max:255',
            'admin_email' => 'required_without:id|email|unique:users,email|max:255',
            'admin_password' => 'required_without:id|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $tenant = $this->serviceTenant->creerTenant($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Tenant créé avec succès',
                'data' => $tenant,
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
            'nom' => 'sometimes|string|max:255',
            'domaine' => 'nullable|string|unique:tenants,domaine,' . $id . '|max:255',
            'plan' => 'sometimes|string|in:gratuit,pro,premium',
            'actif' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $tenant = $this->serviceTenant->modifierTenant($id, $request->all());
            return response()->json([
                'success' => true,
                'message' => 'Tenant modifié avec succès',
                'data' => $tenant,
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
            $this->serviceTenant->supprimerTenant($id);
            return response()->json([
                'success' => true,
                'message' => 'Tenant supprimé avec succès',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
