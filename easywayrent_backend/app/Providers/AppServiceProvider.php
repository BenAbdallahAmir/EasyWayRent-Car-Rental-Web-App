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
        // Make sure the API routes are properly loaded
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Define an authorization rule for administrators
        Gate::define('admin', function ($user) {
            return $user->role === 'admin'
                ? Response::allow()
                : Response::deny('Unauthorized. Only admins can promote users.');
        });
    }
}
