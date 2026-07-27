<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        // When I create a category, give it a random name from this list.
        $name = fake()->unique()->randomElement([
            'Electronics', 'Fashion', 'Home & Kitchen', 'Books',
            'Sports & Outdoors', 'Beauty', 'Toys', 'Automotive',
        ]);

        // Also create a slug from that name so it can be used in URLs.
        return [
            'name' => $name,
            'slug' => Str::slug($name),
        ];
    }
}