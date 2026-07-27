<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SellerProfileFactory extends Factory
{
    public function definition(): array
    {
        return [
            'business_name' => fake()->company(),
            'description' => fake()->sentence(15),
            'status' => 'approved',
            'approved_at' => now(),
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending', 'approved_at' => null]);
    }
}