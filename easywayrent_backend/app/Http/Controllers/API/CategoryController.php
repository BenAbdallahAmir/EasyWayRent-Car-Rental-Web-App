<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Lister toutes les catégories
    public function index()
    {
        $categories = Category::withCount('cars')->get();
        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No category found'], 404);
        }
        return response()->json($categories);
    }

    // Récupérer une catégorie avec ses voitures
    public function show($id)
    {
        $category = Category::with('cars')->find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    // Créer une nouvelle catégorie (protégé par le middleware 'admin')
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);
        $category = Category::create($data);
        return response()->json(['message' => 'Category created successfully!', 'category' => $category], 201);
    }

    // Modifier une catégorie (protégé par le middleware 'admin')
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
        ]);

        $category->update($data);

        return response()->json(['message' => 'Category updated successfully!', 'category' => $category]);
    }

    // Supprimer une catégorie (protégé par le middleware 'admin')
    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully!']);
    }
}
