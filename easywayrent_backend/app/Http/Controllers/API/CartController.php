<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $cartItems = Cart::where('user_id', $user->id)
            ->with('car') // Charger les détails de la voiture
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty'], 200);
        }

        return response()->json($cartItems);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'pickup_location' => 'required|string|max:255',
            'dropoff_location' => 'required|string|max:255',
        ]);

        // Vérifier la disponibilité de la voiture
        $car = Car::find($data['car_id']);
        if (!$car || $car->status !== 'available') {
            return response()->json(['message' => 'This car is not available'], 400);
        }

        // Calculer le prix total
        $days = (strtotime($data['end_date']) - strtotime($data['start_date'])) / 86400;
        $totalPrice = $days * $car->price_per_day;

        // Créer l'article dans le panier
        $cartItem = Cart::create([
            'user_id' => $user->id,
            'car_id' => $data['car_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'pickup_location' => $data['pickup_location'],
            'dropoff_location' => $data['dropoff_location'],
            'total_price' => $totalPrice,
            'reservation_id' => null, // Pas encore lié à une réservation
        ]);

        return response()->json([
            'message' => 'Car added to cart successfully!',
            'cart_item' => $cartItem->load('car')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        $user = Auth::user();

        // Vérifier que l'article appartient à l'utilisateur
        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($cart->load('car'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        $user = Auth::user();

        // Vérifier que l'article appartient à l'utilisateur
        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date' => 'sometimes|date|after:start_date',
            'pickup_location' => 'sometimes|string|max:255',
            'dropoff_location' => 'sometimes|string|max:255',
        ]);

        // Recalculer le prix total si les dates changent
        if ($request->has('start_date') || $request->has('end_date')) {
            $startDate = $request->input('start_date', $cart->start_date);
            $endDate = $request->input('end_date', $cart->end_date);
            $days = (strtotime($endDate) - strtotime($startDate)) / 86400;
            $data['total_price'] = $days * $cart->car->price_per_day;
        }

        $cart->update($data);

        return response()->json([
            'message' => 'Cart item updated successfully!',
            'cart_item' => $cart->load('car')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = Auth::user();

        // Rechercher l'élément du panier
        $cart = Cart::find($id);

        // Vérifier s'il existe
        if (!$cart) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        // Vérifier que l'article appartient bien à l'utilisateur
        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized - This cart item does not belong to you'], 403);
        }

        // Supprimer l'élément
        $cart->delete();

        return response()->json(['message' => 'Cart item removed successfully'], 200);
    }
}
