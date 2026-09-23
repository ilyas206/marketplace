<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Complaint;
use App\Models\Message;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\SellerProfile;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RealisticDataSeeder extends Seeder
{
    private array $moroccanCities = [
        'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger',
        'Agadir', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan',
    ];

    private array $categoryTree = [
        'Électronique' => ['Téléphones', 'Ordinateurs', 'Accessoires audio'],
        'Mode Homme' => ['Vêtements', 'Chaussures'],
        'Mode Femme' => ['Vêtements', 'Chaussures', 'Sacs'],
        'Maison & Cuisine' => ['Électroménager', 'Décoration'],
        'Beauté & Soins' => [],
        'Sport & Loisirs' => [],
        'Auto & Moto' => [],
        'Bébé & Enfant' => [],
    ];

    private array $productNamesByCategory = [
        'Téléphones' => ['Samsung Galaxy A54', 'iPhone 13', 'Xiaomi Redmi Note 12', 'Coque de protection renforcée', 'Chargeur rapide 20W'],
        'Ordinateurs' => ['Laptop HP Pavilion 15', 'Souris sans fil Logitech', 'Clavier mécanique RGB', 'Disque SSD 512Go'],
        'Accessoires audio' => ['Écouteurs Bluetooth', 'Enceinte portable JBL', 'Casque audio filaire'],
        'Vêtements' => ['Chemise en lin', 'Jean slim fit', 'Djellaba brodée', 'T-shirt coton bio', 'Veste en cuir'],
        'Chaussures' => ['Baskets running', 'Babouches artisanales', 'Sandales en cuir', 'Chaussures de ville'],
        'Sacs' => ['Sac à main cuir', 'Sac à dos voyage', 'Pochette de soirée'],
        'Électroménager' => ['Mixeur multifonction', 'Bouilloire électrique', 'Aspirateur sans fil'],
        'Décoration' => ['Tapis berbère', 'Lanterne marocaine', 'Coussin brodé'],
        'Beauté & Soins' => ['Huile d\'argan pure', 'Crème hydratante visage', 'Kit de hammam traditionnel'],
        'Sport & Loisirs' => ['Tapis de yoga', 'Ballon de football', 'Vélo VTT'],
        'Auto & Moto' => ['Housse de siège auto', 'Support téléphone voiture', 'Kit d\'entretien moto'],
        'Bébé & Enfant' => ['Poussette pliable', 'Jouet éducatif en bois', 'Vêtements bébé coton'],
    ];

    public function run(): void
    {
        // --- Admin ---
        $admin = User::firstOrCreate(
            ['email' => 'admin@marketplace.test'],
            ['name' => 'Youssef El Admin', 'password' => bcrypt('password')]
        );
        if (! $admin->hasRole('admin')) $admin->assignRole('admin');

        // --- Categories ---
        $categories = collect();
        foreach ($this->categoryTree as $parentName => $children) {
            $parent = Category::firstOrCreate(
                ['slug' => Str::slug($parentName)],
                ['name' => $parentName, 'created_by' => $admin->id]
            );
            $categories->push($parent);

            foreach ($children as $childName) {
                $child = Category::firstOrCreate(
                    ['slug' => Str::slug($parentName.'-'.$childName)],
                    ['name' => $childName, 'parent_id' => $parent->id, 'created_by' => $admin->id]
                );
                $categories->push($child);
            }
        }

        $leafCategories = $categories->filter(fn ($c) => isset($this->productNamesByCategory[$c->name]));

        // --- Sellers (Moroccan business names) ---
        $sellerNames = [
            ['name' => 'Amine Bennani', 'business' => 'TechSouk Casablanca'],
            ['name' => 'Sara Idrissi', 'business' => 'Mode Riad'],
            ['name' => 'Karim Ouazzani', 'business' => 'Maison Atlas'],
            ['name' => 'Leila Fassi', 'business' => 'Beauté Argane'],
        ];

        $sellers = collect();
        foreach ($sellerNames as $i => $info) {
            $user = User::firstOrCreate(
                ['email' => "seller{$i}@marketplace.test"],
                ['name' => $info['name'], 'password' => bcrypt('password')]
            );
            if (! $user->hasRole('seller')) $user->assignRole('seller');

            SellerProfile::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'business_name' => $info['business'],
                    'description' => "Vendeur agréé spécialisé en {$info['business']}, basé à ".fake()->randomElement($this->moroccanCities).'.',
                    'status' => 'approved',
                    'approved_at' => now()->subDays(rand(10, 90)),
                ]
            );
            $sellers->push($user);
        }

        // A pending seller (approval flow demo)
        $pendingSeller = User::firstOrCreate(
            ['email' => 'pending-seller@marketplace.test'],
            ['name' => 'Nabil Chraibi', 'password' => bcrypt('password')]
        );
        SellerProfile::firstOrCreate(
            ['user_id' => $pendingSeller->id],
            ['business_name' => 'Chraibi Electronics', 'description' => 'Nouveau vendeur en électronique.', 'status' => 'pending']
        );

        // --- Products, spread across sellers/categories ---
        $allProducts = collect();
        foreach ($sellers as $seller) {
            foreach ($leafCategories->random(min(3, $leafCategories->count())) as $category) {
                $names = $this->productNamesByCategory[$category->name];
                foreach (fake()->randomElements($names, min(2, count($names))) as $name) {
                    $price = fake()->randomFloat(2, 80, 4000);
                    $hasDiscount = fake()->boolean(25);

                    $product = Product::create([
                        'seller_id' => $seller->id,
                        'category_id' => $category->id,
                        'title' => $name,
                        'slug' => Str::slug($name).'-'.uniqid(),
                        'description' => fake('fr_FR')->paragraph(3),
                        'price' => $price,
                        'discount_price' => $hasDiscount ? round($price * 0.82, 2) : null,
                        'stock' => rand(5, 60),
                        'status' => 'active',
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => 'products/placeholder.jpg',
                        'is_primary' => true,
                    ]);

                    $allProducts->push($product);
                }
            }
        }

        // --- Buyers (Moroccan names) ---
        $buyerNames = [
            'Yassine Alaoui', 'Ghita Tazi', 'Omar Benjelloun', 'Salma Cherkaoui',
            'Hamza Lahlou', 'Imane Berrada', 'Reda Amrani', 'Nadia Squalli',
        ];
        $buyers = collect();
        foreach ($buyerNames as $i => $name) {
            $user = User::firstOrCreate(
                ['email' => 'buyer'.$i.'@marketplace.test'],
                ['name' => $name, 'password' => bcrypt('password')]
            );
            if (! $user->hasRole('buyer')) $user->assignRole('buyer');
            $buyers->push($user);
        }

        // --- Orders, spanning every status realistically ---
        $orderScenarios = [
            ['item_status' => 'delivered', 'count' => 8],   // completed orders → generates reviews
            ['item_status' => 'shipped', 'count' => 3],
            ['item_status' => 'confirmed', 'count' => 3],
            ['item_status' => 'pending', 'count' => 4],
            ['item_status' => 'cancelled', 'count' => 2],
        ];

        foreach ($orderScenarios as $scenario) {
            for ($i = 0; $i < $scenario['count']; $i++) {
                $buyer = $buyers->random();
                $city = fake()->randomElement($this->moroccanCities);
                $product = $allProducts->random();
                $qty = rand(1, 3);
                $unitPrice = $product->discount_price ?? $product->price;

                $order = Order::create([
                    'buyer_id' => $buyer->id,
                    'shipping_address' => fake('fr_FR')->streetAddress().", {$city}",
                    'phone' => '06'.fake()->numerify('########'),
                    'payment_method' => 'cod',
                    'total_amount' => $unitPrice * $qty,
                    'status' => 'pending', // syncStatus() below sets the real value
                ]);

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'seller_id' => $product->seller_id,
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'subtotal' => $unitPrice * $qty,
                    'item_status' => $scenario['item_status'],
                ]);

                $order->syncStatus();

                // Backdate delivered/shipped orders so income stats spread across months
                if (in_array($scenario['item_status'], ['delivered', 'shipped'])) {
                    $backdate = now()->subDays(rand(1, 75));
                    $order->update(['created_at' => $backdate, 'updated_at' => $backdate]);
                    $orderItem->update(['created_at' => $backdate, 'updated_at' => $backdate]);
                }
            }
        }

        // --- Reviews (only for delivered items, matches the business rule from StoreReviewRequest) ---
        $deliveredItems = OrderItem::where('item_status', 'delivered')->get();
        $comments = [
            'Très satisfait, livraison rapide et produit conforme.',
            'Bon rapport qualité-prix, je recommande.',
            'Produit correct mais l\'emballage pouvait être mieux soigné.',
            'Exactement comme décrit, vendeur sérieux.',
            'Un peu déçu par la qualité, sinon délai respecté.',
        ];
        foreach ($deliveredItems as $item) {
            Review::firstOrCreate(
                ['product_id' => $item->product_id, 'buyer_id' => $item->order->buyer_id],
                ['rating' => rand(3, 5), 'comment' => fake()->randomElement($comments)]
            );
        }

        // --- Wishlists ---
        foreach ($buyers as $buyer) {
            foreach ($allProducts->random(rand(1, 4)) as $product) {
                Wishlist::firstOrCreate(['user_id' => $buyer->id, 'product_id' => $product->id]);
            }
        }

        // --- Messages (buyer<->seller threads + one seller<->admin thread) ---
        $chatOpeners = [
            'Bonjour, ce produit est-il toujours disponible ?',
            'Est-ce que vous livrez à Marrakech ?',
            'Merci pour la commande, tout est bien arrivé.',
            'Bonjour, j\'aimerais avoir plus de détails sur la garantie.',
        ];
        foreach (range(1, 6) as $i) {
            $buyer = $buyers->random();
            $seller = $sellers->random();
            Message::create([
                'sender_id' => $buyer->id,
                'receiver_id' => $seller->id,
                'body' => fake()->randomElement($chatOpeners),
                'created_at' => now()->subHours(rand(1, 200)),
            ]);
            if (fake()->boolean(70)) {
                Message::create([
                    'sender_id' => $seller->id,
                    'receiver_id' => $buyer->id,
                    'body' => 'Bonjour, oui bien sûr. N\'hésitez pas si vous avez d\'autres questions.',
                    'read_at' => fake()->boolean(50) ? now() : null,
                    'created_at' => now()->subHours(rand(1, 150)),
                ]);
            }
        }
        // Seller <-> admin support thread
        Message::create([
            'sender_id' => $sellers->first()->id,
            'receiver_id' => $admin->id,
            'body' => 'Bonjour, j\'ai une question concernant les frais de commission.',
        ]);

        // --- Complaints ---
        $complaintSubjects = [
            'Produit non conforme à la description',
            'Retard de livraison important',
            'Problème avec le service client du vendeur',
        ];
        foreach (range(1, 3) as $i) {
            $buyer = $buyers->random();
            $seller = $sellers->random();
            Complaint::create([
                'buyer_id' => $buyer->id,
                'seller_id' => $seller->id,
                'subject' => fake()->randomElement($complaintSubjects),
                'description' => fake('fr_FR')->paragraph(2),
                'status' => fake()->randomElement(['open', 'in_progress', 'resolved']),
                'admin_response' => fake()->boolean(50) ? 'Merci pour votre retour, nous avons contacté le vendeur concerné.' : null,
            ]);
        }
    }
}