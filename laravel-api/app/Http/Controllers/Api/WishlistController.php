<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\WishlistResource;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = $request->user()->wishlist()
            ->with('product.primaryImage')
            ->latest()
            ->get();

        return WishlistResource::collection($wishlist);
    }

    // Toggle: add if not present, remove if already there — simpler for a heart-icon UI
    // than separate add/remove endpoints
    public function toggle(Request $request)
    {
        $request->validate(['product_id' => ['required', 'exists:products,id']]);

        $existing = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['message' => 'Product removed from wishlist.', 'wishlisted' => false]);
        }

        Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Product added to wishlist.', 'wishlisted' => true]);
    }
}