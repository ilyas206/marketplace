<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        // Only top-level categories with their children nested — clean tree for UI
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->withCount('products');
            }])
            ->withCount('products')
            ->get();

        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($category, 201);
    }

    public function update(StoreCategoryRequest $request, Category $category)
    {
        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
        ]);

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category that still has products. Reassign or remove them first.',
            ], 422);
        }

        if ($category->children()->exists()) {
            return response()->json([
                'message' => 'Cannot delete a category with subcategories. Delete or reassign them first.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}