<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Access\Response;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Assure-toi que les routes de l'API sont bien chargées
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Définir une règle d'autorisation pour les administrateurs
        Gate::define('admin', function ($user) {
            return $user->role === 'admin'
                ? Response::allow()
                : Response::deny('Unauthorized. Only admins can promote users.');
        });
    }
}
