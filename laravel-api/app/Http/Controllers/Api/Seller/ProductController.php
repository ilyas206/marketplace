<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductDetailResource;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use AuthorizesRequests;
    
    // Seller's own product list (includes inactive/out-of-stock — unlike public API)
    public function index(Request $request)
    {
        $products = $request->user()->products()
            ->with('category', 'primaryImage')
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->per_page ?? 10);

        return response()->json($products);
    }

    public function store(StoreProductRequest $request)
    {
        // safe() use only validated input
        // except('images') remove the images field from the product data
        $product = Product::create([
            ...$request->safe()->except('images'),
            'seller_id' => $request->user()->id,
            'slug' => \Illuminate\Support\Str::slug($request->title) . '-' . uniqid(),
        ]);

        foreach ($request->file('images') as $index => $image) {
            // Saves the image to storage , "products" is the folder name , "public" means the file is stored in the public disk, so it can be accessed later
            $path = $image->store('products', 'public');
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $path,
                'is_primary' => $index === 0,
            ]);
        }

        return new ProductDetailResource($product->load('images', 'category', 'seller'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        // load() gives you a new copy of the product with the newest saved values
        return new ProductDetailResource($product->fresh()->load('images', 'category', 'seller'));
    }

    public function destroy(Request $request, Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete(); // soft delete

        return response()->json(['message' => 'Product removed.']);
    }
}