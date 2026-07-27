<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'image_path' => 'products/placeholder.jpg',
            'is_primary' => false,
        ];
    }
}