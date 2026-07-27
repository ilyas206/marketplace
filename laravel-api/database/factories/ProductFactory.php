<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->words(3, true);
        $price = fake()->randomFloat(2, 50, 10000);
        $hasDiscount = fake()->boolean(30); // 30% of products have a discount

        return [
            'title' => ucfirst($title),
            'slug' => Str::slug($title) . '-' . fake()->unique()->numberBetween(100, 9999),
            'description' => fake()->paragraph(4),
            'price' => $price,
            'discount_price' => $hasDiscount ? round($price * 0.8, 2) : null,
            'stock' => fake()->numberBetween(0, 100),
            'status' => 'active',
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(['stock' => 0]);
    }
}