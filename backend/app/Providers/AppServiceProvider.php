<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Application\Services\ServiceTravaux;
use App\Application\Services\ServiceDepense;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(ServiceTravaux::class, ServiceTravaux::class);
        $this->app->singleton(ServiceDepense::class, ServiceDepense::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (str_contains(config('app.url'), 'ngrok-free.app')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }
    }
}
