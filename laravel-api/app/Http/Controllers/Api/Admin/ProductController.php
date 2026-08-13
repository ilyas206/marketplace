<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Full visibility — including other sellers' inactive/out-of-stock products
    public function index(Request $request)
    {
        $products = Product::with('seller:id,name', 'category:id,name', 'primaryImage')
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->when($request->seller_id, fn ($q) => $q->where('seller_id', $request->seller_id))
            ->latest()
            ->paginate($request->per_page ?? 15);

        return response()->json($products);
    }

    public function show(Product $product)
    {
        return new ProductDetailResource($product->load('images', 'category', 'seller'));
    }

    // Admin can deactivate any product (e.g. reported/inappropriate/counterfeit)
    public function updateStatus(Request $request, Product $product)
    {
        $request->validate(['status' => ['required', 'in:active,inactive']]);

        $product->update(['status' => $request->status]);

        return response()->json(['message' => 'Product status updated.', 'product' => $product]);
    }
}