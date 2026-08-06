<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($this->items),
            'total' => (float) $this->items->sum(fn ($item) => $item->quantity * $item->product->final_price),
            'items_count' => $this->items->sum('quantity'),
        ];
    }
}