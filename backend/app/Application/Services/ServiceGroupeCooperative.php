<?php

namespace App\Application\Services;

use App\Domaine\Entities\GroupeCooperative;
use Illuminate\Support\Facades\Auth;

class ServiceGroupeCooperative
{
    public function lister()
    {
        $idTenant = Auth::user()->id_tenant;

        return GroupeCooperative::where('id_tenant', $idTenant)
            ->orderBy('nom')
            ->get();
    }

    public function creer(array $donnees)
    {
        $donnees['id_tenant'] = Auth::user()->id_tenant;

        return GroupeCooperative::create($donnees);
    }

    public function obtenirParId(int $id)
    {
        $idTenant = Auth::user()->id_tenant;
        
        return GroupeCooperative::where('id_tenant', $idTenant)
            ->with(['adherents' => function($q) {
                $q->orderBy('nom')->orderBy('prenom');
            }, 'parcelles' => function($q) {
                $q->orderBy('numero');
            }])
            ->findOrFail($id);
    }

    public function mettreAJour(int $id, array $donnees)
    {
        $groupe = $this->obtenirParId($id);
        $groupe->update($donnees);

        return $groupe->fresh();
    }

    public function supprimer(int $id)
    {
        $groupe = $this->obtenirParId($id);

        if ($groupe->adherents()->exists() || $groupe->parcelles()->exists()) {
            throw new \Exception("Impossible de supprimer un groupe contenant des adhérents ou des parcelles");
        }

        $groupe->delete();

        return true;
    }

    public function obtenirGroupeParDefautId(): int
    {
        $idTenant = Auth::user()->id_tenant;

        $groupe = GroupeCooperative::where('id_tenant', $idTenant)
            ->orderBy('id')
            ->first();

        if (!$groupe) {
            $groupe = GroupeCooperative::create([
                'id_tenant' => $idTenant,
                'nom' => 'Groupe par défaut',
                'description' => null,
            ]);
        }

        return (int) $groupe->id;
    }
}
