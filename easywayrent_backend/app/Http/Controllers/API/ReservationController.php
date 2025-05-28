<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Reservation;
use App\Models\Car;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    // Méthode utilitaire pour vérifier les conflits de dates
    private function hasDateConflict($carId, $startDate, $endDate, $excludeId = null)
    {
        $query = Reservation::where('car_id', $carId)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    public function index()// Lister toutes les réservations
    {
        $reservations = Reservation::with(['car', 'user'])->get();
        if ($reservations->isEmpty()) {
            return response()->json(['message' => 'No reservations found'], 404);
        }
        return response()->json($reservations);
    }

    public function userReservations() // Lister les reservations d'un utilisateur
    {
        $reservations = Reservation::where('user_id', Auth::id())->with('car')->get();

        return response()->json($reservations);
    }

    public function storeFromCart(Request $request) //créer une réservation à partir du panier
    {
        $user = Auth::user();
        $cartItem = Cart::where('user_id', $user->id)->find($request->cart_id);

        if (!$cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $car = Car::find($cartItem->car_id);
        if ($car->status !== 'available') {
            return response()->json(['message' => 'Car is no longer available'], 400);
        }

        if ($this->hasDateConflict($car->id, $cartItem->start_date, $cartItem->end_date)) {
            return response()->json(['message' => 'These dates conflict with an existing reservation'], 400);
        }

        $data = $request->validate([
            'payment_method' => 'required|string|in:credit_card,paypal,cash',
        ]);

        // Transaction pour garantir la consistance
        DB::beginTransaction();
        try {
            $reservation = Reservation::create([
                'user_id' => $user->id,
                'car_id' => $cartItem->car_id,
                'start_date' => $cartItem->start_date,
                'end_date' => $cartItem->end_date,
                'pickup_location' => $cartItem->pickup_location,
                'dropoff_location' => $cartItem->dropoff_location,
                'total_price' => $cartItem->total_price,
                'payment_method' => $data['payment_method'],
                'status' => 'pending',
            ]);

            $car->update(['status' => 'rented']);
            $cartItem->update(['reservation_id' => $reservation->id]);
            $cartItem->delete();

            DB::commit();
            return response()->json([
                'message' => 'Reservation created from cart successfully!',
                'reservation' => $reservation
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create reservation: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'pickup_location' => 'required|string|max:255',
            'dropoff_location' => 'required|string|max:255',
            'payment_method' => 'required|string|in:credit_card,paypal,cash',
        ]);

        try {
            $startDate = new \DateTime($data['start_date']);
            $endDate = new \DateTime($data['end_date']);

            // Vérifier si la date de fin est bien après la date de début
            if ($endDate < $startDate) {
                return response()->json(['message' => 'End date must be after start date'], 400);
            }

            // Vérifier la cohérence des années (éviter 2025 -> 2023)
            if ($endDate->format('Y') < $startDate->format('Y')) {
                return response()->json(['message' => 'End year cannot be before start year'], 400);
            }

            $days = $startDate->diff($endDate)->days;

            if ($days <= 0) {
                return response()->json(['message' => 'Reservation must be at least 1 day long'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid date format'], 400);
        }

        $car = Car::find($data['car_id']);
        if ($car->status !== 'available') {
            return response()->json(['message' => 'Car is not available'], 400);
        }

        if ($this->hasDateConflict($car->id, $data['start_date'], $data['end_date'])) {
            return response()->json(['message' => 'These dates conflict with an existing reservation'], 400);
        }

        $totalPrice = $days * $car->price_per_day;

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'car_id' => $data['car_id'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'pickup_location' => $data['pickup_location'],
            'dropoff_location' => $data['dropoff_location'],
            'total_price' => $totalPrice,
            'payment_method' => $data['payment_method'],
            'status' => 'pending',
        ]);

        $car->update(['status' => 'rented']);

        return response()->json(['message' => 'Reservation created successfully', 'reservation' => $reservation], 201);
    }


    public function showForAdmin($id) // Afficher une réservation pour l'administrateur
    {
        $reservation = Reservation::with(['car', 'user'])->find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        return response()->json($reservation);
    }

    public function showForClient($id) // Afficher une réservation pour le client
    {
        $user = Auth::user();
        $reservation = Reservation::with('car')->where('id', $id)->where('user_id', $user->id)->first();

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found or unauthorized'], 404);
        }

        return response()->json($reservation);
    }


    public function updateReservationStatus(Request $request, $id)// Mettre à jour le statut d'une réservation
    {

        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        $data = $request->validate([
            'status' => 'required|string|in:pending,confirmed,cancelled,completed',
        ]);

        $reservation->update(['status' => $data['status']]);
        if (in_array($data['status'], ['cancelled', 'completed'])) {
            $reservation->car->update(['status' => 'available']);
        }

        return response()->json(['message' => 'Reservation updated successfully!', 'reservation' => $reservation]);
    }

    public function updateReservation(Request $request, $id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        // Vérifier si la réservation est confirmée ou complétée
        if (in_array($reservation->status, ['confirmed', 'completed'])) {
            return response()->json(['message' => 'You cannot modify a confirmed or completed reservation'], 403);
        }

        // Vérifier si l'utilisateur est autorisé
        if (Auth::id() !== $reservation->user_id && Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'start_date' => 'sometimes|date|after_or_equal:today',
            'end_date' => 'sometimes|date|after:start_date',
            'pickup_location' => 'sometimes|string|max:255',
            'dropoff_location' => 'sometimes|string|max:255',
            'payment_method' => 'sometimes|string|in:credit_card,paypal,cash',
        ]);

        if (empty($data)) {
            return response()->json(['message' => 'No changes provided'], 400);
        }

        if ($request->has('start_date') || $request->has('end_date')) {
            $startDate = new \DateTime($request->input('start_date', $reservation->start_date));
            $endDate = new \DateTime($request->input('end_date', $reservation->end_date));
            $days = $startDate->diff($endDate)->days;
            $data['total_price'] = $days * $reservation->car->price_per_day;

            if ($this->hasDateConflict($reservation->car_id, $startDate, $endDate, $reservation->id)) {
                return response()->json(['message' => 'These dates conflict with an existing reservation'], 400);
            }
        }

        $reservation->update($data);

        return response()->json(['message' => 'Reservation updated successfully', 'reservation' => $reservation]);
    }


    public function cancel($id)
    {
        $reservation = Reservation::find($id);

        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        // Vérifier que seul le client peut annuler sa propre réservation
        if (Auth::id() !== $reservation->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Vérifier si la réservation est déjà annulée
        if ($reservation->status === 'cancelled') {
            return response()->json(['message' => 'Reservation is already cancelled'], 400);
        }

        // Vérifier si la réservation est confirmée ou complétée (annulation non autorisée)
        if (in_array($reservation->status, ['confirmed', 'completed'])) {
            return response()->json(['message' => 'You cannot cancel a confirmed or completed reservation'], 403);
        }

        // Mettre à jour le statut de la réservation
        $reservation->update(['status' => 'cancelled']);

        // Rendre la voiture à nouveau disponible
        $reservation->car->update(['status' => 'available']);

        return response()->json(['message' => 'Reservation cancelled successfully']);
    }


    public function destroy($id)// Supprimer une réservation
    {

        $reservation = Reservation::find($id);
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        $reservation->car->update(['status' => 'available']);
        $reservation->delete();

        return response()->json(['message' => 'Reservation deleted successfully']);
    }
}
