<?php

namespace App\Http\Requests;

use App\Models\OrderItem;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $buyerId = $this->user()->id;

            $hasDelivered = OrderItem::where('product_id', $this->product_id)
                ->where('item_status', 'delivered')
                ->whereHas('order', fn ($q) => $q->where('buyer_id', $buyerId))
                ->exists();

            if (! $hasDelivered) {
                $validator->errors()->add(
                    'product_id',
                    'You can only review products from a delivered order.'
                );
            }
        });
    }
}