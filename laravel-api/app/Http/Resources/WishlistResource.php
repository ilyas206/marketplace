<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WishlistResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product' => [
                'id' => $this->product->id,
                'title' => $this->product->title,
                'slug' => $this->product->slug,
                'final_price' => (float) $this->product->final_price,
                'image' => $this->product->primaryImage?->image_path,
                'in_stock' => $this->product->stock > 0,
            ],
        ];
    }
}