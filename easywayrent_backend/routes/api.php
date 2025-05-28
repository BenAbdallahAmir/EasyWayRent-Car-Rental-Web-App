<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CarController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\CartController;
use App\Http\Controllers\API\CategoryController;
use Illuminate\Http\Request;

// Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
        return $request->user();
    });
});

// User Routes
Route::prefix('user')->group(function () {
    // Cars Routes
    Route::get('/cars', [CarController::class, 'index']);
    Route::get('/car/{id}', [CarController::class, 'show']);
    Route::middleware('auth:sanctum')->post('/cars/{id}/reserve', [ReservationController::class, 'store']);
});

// Admin Routes
// middleware(['auth:sanctum', 'admin'])->
Route::prefix('admin')->group(function () {
    // Cars Routes (Admin only)
    Route::post('/add_car', [CarController::class, 'store']);
    Route::put('/update_car/{id}', [CarController::class, 'update']);
    Route::delete('/delete_car/{id}', [CarController::class, 'destroy']);
    Route::get('/cars_list', [CarController::class, 'index']);
    Route::get('/car/{id}', [CarController::class, 'show']);
    Route::get('/cars/{status}', [CarController::class, 'listByStatus']);
    Route::get('/cars', [CarController::class, 'getCars']);

    // Reservations Routes (Admin only)
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::get('/reservations/{id}/admin', [ReservationController::class, 'showForClient']);
    Route::put('/reservations/{id}', [ReservationController::class, 'updateReservationStatus']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    // Users Routes (Admin only)
    Route::get('/getusers', [AuthController::class, 'index']);
    Route::get('/getadmins', [AuthController::class, 'getAdmins']);
    Route::get('/getclients', [AuthController::class, 'getClients']);
    Route::put('/user_update/{id}', [AuthController::class, 'updateUser']);
    Route::delete('/user_delete/{id}', [AuthController::class, 'deleteUser']);
    Route::put('/users/{id}/setAdmin', [AuthController::class, 'setAdmin']);

    // Categories Routes
    Route::post('/create_category', [CategoryController::class, 'store']);
    Route::put('/update_category/{id}', [CategoryController::class, 'update']);
    Route::delete('/delete_category/{id}', [CategoryController::class, 'destroy']);
    Route::get('/categories_list', [CategoryController::class, 'index']);
    Route::get('category/{id}', [CategoryController::class, 'show']);
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{id}', [CategoryController::class, 'show']);
});

// Clients routes
// middleware('auth:sanctum')->
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/carts', CartController::class)->only(['store', 'index', 'update', 'show', 'destroy']);
    Route::get('/reservations/user', [ReservationController::class, 'userReservations']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::put('/reservations/{id}', [ReservationController::class, 'updateReservation']);
    Route::get('/reservations/{id}/client', [ReservationController::class, 'showForClient']);
    Route::post('/reservations/from-cart', [ReservationController::class, 'storeFromCart']);
});
Route::middleware('auth:sanctum')->group(function () {
    // Routes de profil utilisateur
    Route::get('/auth/profile', [AuthController::class, 'getUserProfile']);
    Route::put('/auth/password', [AuthController::class, 'updatePassword']);
});
