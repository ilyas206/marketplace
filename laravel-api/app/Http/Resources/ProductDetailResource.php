<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (int) $this->id,
            'title' => (string) $this->title,
            'slug' => (string) $this->slug,
            'description' => $this->description ? (string) $this->description : null,
            'price' => (float) $this->price,
            'discount_price' => $this->discount_price !== null ? (float) $this->discount_price : null,
            'final_price' => (float) $this->final_price,
            'stock' => (int) $this->stock,
            'in_stock' => (bool) ($this->stock > 0),
            'average_rating' => $this->average_rating !== null ? (float) $this->average_rating : null,
            'category' => [
                'id' => (int) $this->category->id,
                'name' => (string) $this->category->name,
                'slug' => (string) $this->category->slug,
            ],
            'images' => ProductImageResource::collection($this->images),
            'seller' => [
                'id' => (int) $this->seller->id,
                'business_name' => $this->seller->sellerProfile?->business_name ? (string) $this->seller->sellerProfile?->business_name : null,
                'total_products' => (int) $this->seller->products()->available()->count(),
            ],
            'reviews_count' => (int) $this->reviews()->count(),
            'is_wishlisted' => $request->user()
                ? \App\Models\Wishlist::where('user_id', $request->user()->id)
                    ->where('product_id', $this->id)
                    ->exists()
                : false,
        ];
    }
}