<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CarController extends Controller
{
    // Lister toutes les voitures disponibles (public)
    public function index()
    {
        $cars = Car::with('category')->get();

        // Ajouter l'URL complète de l'image pour chaque voiture
        foreach ($cars as $car) {
            if ($car->image) {
                // Vérifier si l'image est déjà une URL complète
                if (!Str::startsWith($car->image, ['http://', 'https://'])) {
                    $car->image = asset('storage/' . $car->image);
                }
            }

            if ($car->category) {
                $car->category_name = $car->category->name;
            }
        }

        return response()->json($cars);
    }

    public function listByStatus($status)
    {
        if (!in_array($status, ['available', 'rented'])) {
            return response()->json(['message' => 'Invalid status'], 400);
        }

        $cars = Car::where('status', $status)->with('category')->get();

        // Ajouter l'URL complète de l'image pour chaque voiture
        foreach ($cars as $car) {
            if ($car->image) {
                // Vérifier si l'image est déjà une URL complète
                if (!Str::startsWith($car->image, ['http://', 'https://'])) {
                    $car->image = asset('storage/' . $car->image);
                }
            }
            if ($car->category) {
                $car->category_name = $car->category->name;
            }
        }

        return response()->json($cars);
    }

    public function getCars()
    {
        $cars = Car::all();

        $cars->transform(function ($car) {
            if ($car->image) {
                // Vérifier si l'image est déjà une URL complète
                if (!Str::startsWith($car->image, ['http://', 'https://'])) {
                    $car->image = asset('storage/' . $car->image);
                }
            }
            return $car;
        });

        return response()->json($cars);
    }

    // Afficher une voiture spécifique (public)
    public function show($id)
    {
        $car = Car::with('category')->find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        if ($car->image) {
            // Vérifier si l'image est déjà une URL complète
            if (!Str::startsWith($car->image, ['http://', 'https://'])) {
                $car->image = asset('storage/' . $car->image);
            }
        }

        return response()->json($car);
    }

    // Ajouter une voiture
    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'model' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'doors' => 'required|integer',
            'luggage' => 'required|integer',
            'passengers' => 'required|integer',
            'year' => 'required|integer',
            'status' => 'required|string|in:available,rented,Available,Rented',
            'price_per_day' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'license_plate' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        try {
            if ($request->hasFile('image')) {
                // Générer un nom unique pour éviter les collisions
                $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
                $imagePath = $request->file('image')->storeAs('car_images', $fileName, 'public');
                $data['image'] = $imagePath;
            }

            $car = Car::create($data);

            // Charger la relation categorie et formater l'URL de l'image
            $car->load('category');

            if ($car->image) {
                $car->image = asset('storage/' . $car->image);
            }

            return response()->json($car, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to create car: ' . $e->getMessage()], 500);
        }
    }

    //Supprimer une voiture
    public function destroy($id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        if ($car->image && Storage::exists('public/' . $car->image)) {
            Storage::delete('public/' . $car->image);
        }

        $car->delete();

        return response()->json(['message' => 'Car successfully deleted'], 200);
    }

    public function update(Request $request, $id)
    {
        $car = Car::find($id);

        if (!$car) {
            return response()->json(['message' => 'Car not found'], 404);
        }

        $data = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'model' => 'sometimes|string|max:255',
            'brand' => 'sometimes|string|max:255',
            'doors' => 'sometimes|integer',
            'luggage' => 'sometimes|integer',
            'passengers' => 'sometimes|integer',
            'year' => 'sometimes|integer',
            'status' => 'sometimes|string|in:available,rented,Available,Rented',
            'price_per_day' => 'sometimes|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg',
            'license_plate' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        if (isset($data['status'])) {
            $data['status'] = strtolower($data['status']);
        }

        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image si elle existe
            if ($car->image) {
                $oldImagePath = str_replace(asset('storage/'), '', $car->image);
                if (Storage::exists('public/' . $oldImagePath)) {
                    Storage::delete('public/' . $oldImagePath);
                }
            }

            // Générer un nom unique pour éviter les collisions
            $fileName = time() . '_' . $request->file('image')->getClientOriginalName();
            $imagePath = $request->file('image')->storeAs('car_images', $fileName, 'public');
            $data['image'] = $imagePath;
        }

        $updated = $car->update($data);

        if (!$updated) {
            return response()->json(['message' => 'Failed to update car'], 500);
        }

        $car = $car->fresh('category');

        if ($car->image) {
            // Vérifier si l'image est déjà une URL complète
            if (!Str::startsWith($car->image, ['http://', 'https://'])) {
                $car->image = asset('storage/' . $car->image);
            }
        }

        return response()->json(['message' => 'Car successfully updated', 'car' => $car], 200);
    }
}
