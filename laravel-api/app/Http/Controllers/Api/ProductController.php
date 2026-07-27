<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductListResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->available()
            ->when($request->category, fn ($q) => $q->inCategory($request->category))
            ->when($request->search, fn ($q) => $q->search($request->search))
            ->when($request->min_price || $request->max_price, fn ($q) => $q->priceBetween($request->min_price, $request->max_price))
            ->sortBy($request->sort ?? 'newest')
            ->paginate($request->per_page ?? 12);

        return ProductListResource::collection($products);
    }

    public function show(string $slug)
    {
        $product = Product::available()->where('slug', $slug)->firstOrFail();

        return new ProductDetailResource($product);
    }

    public function related(string $slug)
    {
        $product = Product::where('slug', $slug)->firstOrFail();

        $related = Product::available()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return ProductListResource::collection($related);
    }
}