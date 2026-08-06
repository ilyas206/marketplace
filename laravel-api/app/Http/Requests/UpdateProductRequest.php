<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    // $this->route('product') => route parameter value : Route::put('/products/{product}', [ProductController::class, 'update']);
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('product'));
    }

    // 'sometimes' (instead of 'required') lets the seller send just {"stock": 5} for example to update stock alone independently without resending the whole product
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string', 'max:2000'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0', 'lt:price'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', 'in:active,inactive'],
        ];
    }
}