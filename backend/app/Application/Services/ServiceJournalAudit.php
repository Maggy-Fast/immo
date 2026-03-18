<?php

namespace App\Application\Services;

use App\Domaine\Entities\JournalAudit;
use Exception;

class ServiceJournalAudit
{
    public function listerLogs(array $filtres = [])
    {
        $query = JournalAudit::with(['tenant', 'utilisateur'])->latest();

        if (isset($filtres['id_tenant'])) {
            $query->where('id_tenant', $filtres['id_tenant']);
        }

        if (isset($filtres['action'])) {
            $query->where('action', 'like', '%' . $filtres['action'] . '%');
        }

        if (isset($filtres['debut'])) {
            $query->whereDate('created_at', '>=', $filtres['debut']);
        }

        if (isset($filtres['fin'])) {
            $query->whereDate('created_at', '<=', $filtres['fin']);
        }

        return $query->paginate(50);
    }

    public function obtenirLog(int $id)
    {
        $log = JournalAudit::with(['tenant', 'utilisateur'])->find($id);
        if (!$log) {
            throw new Exception("Log non trouvé");
        }
        return $log;
    }
}
