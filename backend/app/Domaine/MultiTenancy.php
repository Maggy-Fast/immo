<?php

namespace App\Domaine;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Session;

trait MultiTenancy
{
    public static function bootMultiTenancy()
    {
        if (app()->runningInConsole()) return;

        static::creating(function ($model) {
            if (!$model->id_tenant && auth()->check()) {
                $model->id_tenant = auth()->user()->id_tenant;
            }
        });

        static::addGlobalScope('tenant', function (Builder $builder) {
            if (auth()->check()) {
                $table = $builder->getModel()->getTable();
                $builder->where($table . '.id_tenant', auth()->user()->id_tenant);
            }
        });
    }
}
