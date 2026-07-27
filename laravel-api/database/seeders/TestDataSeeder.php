<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\SellerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // --- Admin ---
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@marketplace.test',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('admin');

        // --- Categories (created by admin) ---
        $categories = Category::factory(5)->create(['created_by' => $admin->id]);

        // --- Approved sellers with products ---
        $sellers = User::factory(3)
            ->create(['password' => bcrypt('password')])
            ->each(function ($seller, $index) {
                $seller->assignRole('seller');
                $seller->email = "seller{$index}@marketplace.test";
                $seller->save();

                SellerProfile::factory()->create(['user_id' => $seller->id]);
            });

        // --- One pending seller (for testing the approval flow later) ---
        $pendingSeller = User::factory()->create([
            'email' => 'pending-seller@marketplace.test',
            'password' => bcrypt('password'),
        ]);
        SellerProfile::factory()->pending()->create(['user_id' => $pendingSeller->id]);

        // --- Products (5-8 per approved seller, spread across categories) ---
        $sellers->each(function ($seller) use ($categories) {
            Product::factory(rand(5, 8))
                ->create([
                    'seller_id' => $seller->id,
                    'category_id' => $categories->random()->id,
                ])
                ->each(function ($product) {
                    ProductImage::factory()->create([
                        'product_id' => $product->id,
                        'is_primary' => true,
                    ]);
                });
        });

        // --- A couple out-of-stock products (for testing that edge case) ---
        Product::factory(2)->outOfStock()->create([
            'seller_id' => $sellers->first()->id,
            'category_id' => $categories->first()->id,
        ])->each(fn ($p) => ProductImage::factory()->create([
            'product_id' => $p->id, 'is_primary' => true,
        ]));

        // --- Buyers ---
        $buyers = User::factory(5)->create(['password' => bcrypt('password')]);
        $buyers->each(fn ($buyer) => $buyer->assignRole('buyer'));

        // --- Reviews (random buyers reviewing random products) ---
        Product::inRandomOrder()->limit(10)->get()->each(function ($product) use ($buyers) {
            Review::factory()->create([
                'product_id' => $product->id,
                'buyer_id' => $buyers->random()->id,
            ]);
        });
    }
}