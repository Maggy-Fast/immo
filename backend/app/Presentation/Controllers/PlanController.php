<?php

namespace App\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Application\Services\ServicePlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class PlanController extends Controller
{
    protected ServicePlan $servicePlan;

    public function __construct(ServicePlan $servicePlan)
    {
        $this->servicePlan = $servicePlan;
    }

    public function index()
    {
        try {
            $plans = $this->servicePlan->listerPlans();
            return response()->json([
                'success' => true,
                'data' => $plans
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $plan = $this->servicePlan->obtenirPlan($id);
            return response()->json([
                'success' => true,
                'data' => $plan
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
            'slug' => 'nullable|string|max:255|unique:plans,slug',
            'prix' => 'nullable|numeric|min:0',
            'duree_mois' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $plan = $this->servicePlan->creerPlan($request->all());
            return response()->json([
                'success' => true,
                'message' => 'Plan créé avec succès',
                'data' => $plan
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:plans,slug,' . $id,
            'prix' => 'nullable|numeric|min:0',
            'duree_mois' => 'sometimes|integer|min:1',
            'description' => 'nullable|string',
            'actif' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $plan = $this->servicePlan->modifierPlan($id, $request->all());
            return response()->json([
                'success' => true,
                'message' => 'Plan mis à jour avec succès',
                'data' => $plan
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
            $this->servicePlan->supprimerPlan($id);
            return response()->json([
                'success' => true,
                'message' => 'Plan supprimé avec succès'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
