<?php

namespace App\Presentation\Controllers;

use App\Application\Services\ServiceJournalAudit;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Exception;

class JournalAuditController extends Controller
{
    protected ServiceJournalAudit $serviceJournalAudit;

    public function __construct(ServiceJournalAudit $serviceJournalAudit)
    {
        $this->serviceJournalAudit = $serviceJournalAudit;
    }

    public function index(Request $request)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            $logs = $this->serviceJournalAudit->listerLogs($request->all());
            return response()->json([
                'success' => true,
                'data' => $logs,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Request $request, $id)
    {
        if (!$request->user()->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé',
            ], 403);
        }

        try {
            $log = $this->serviceJournalAudit->obtenirLog($id);
            return response()->json([
                'success' => true,
                'data' => $log,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }
}
