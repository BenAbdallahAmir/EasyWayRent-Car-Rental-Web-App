<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // List all categories
    public function index()
    {
        $categories = Category::withCount('cars')->get();
        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No category found'], 404);
        }
        return response()->json($categories);
    }

    // Retrieve a category with its cars
    public function show($id)
    {
        $category = Category::with('cars')->find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    // Create a new category (protected by 'admin' middleware)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
        ]);
        $category = Category::create($data);
        return response()->json(['message' => 'Category created successfully!', 'category' => $category], 201);
    }

    // Update a category (protected by 'admin' middleware)
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

    // Delete a category (protected by 'admin' middleware)
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

