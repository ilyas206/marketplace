<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'discount_price' => $this->discount_price ? (float) $this->discount_price : null,
            'final_price' => (float) $this->final_price,
            'stock' => $this->stock,
            'in_stock' => $this->stock > 0,
            'average_rating' => $this->average_rating,
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'images' => ProductImageResource::collection($this->images),
            'seller' => [
                'id' => $this->seller->id,
                'business_name' => $this->seller->sellerProfile?->business_name,
                'total_products' => $this->seller->products()->available()->count(),
            ],
            'reviews_count' => $this->reviews()->count(),
        ];
    }
}