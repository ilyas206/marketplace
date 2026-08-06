<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(CheckoutRequest $request)
    {
        $cart = Cart::where('user_id', $request->user()->id)
            ->with('items.product')
            ->first();

        if (! $cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 422);
        }

        try {
            $order = DB::transaction(function () use ($cart, $request) {
                $total = 0;
                $orderItemsData = [];

                foreach ($cart->items as $cartItem) {
                    // lockForUpdate: prevents two simultaneous checkouts from
                    // both reading stale stock and overselling the same product
                    $product = Product::where('id', $cartItem->product_id)
                        ->lockForUpdate()
                        ->first();

                    if (! $product || $product->status !== 'active') {
                        throw new \Exception("Product '{$cartItem->product->title}' is no longer available.");
                    }

                    if ($product->stock < $cartItem->quantity) {
                        throw new \Exception("Not enough stock for '{$product->title}'. Only {$product->stock} left.");
                    }

                    $unitPrice = $product->final_price;
                    $subtotal = $unitPrice * $cartItem->quantity;
                    $total += $subtotal;

                    $orderItemsData[] = [
                        'product_id' => $product->id,
                        'seller_id' => $product->seller_id,
                        'quantity' => $cartItem->quantity,
                        'unit_price' => $unitPrice,
                        'subtotal' => $subtotal,
                    ];

                    // Decrement stock immediately, inside the same locked transaction
                    $product->decrement('stock', $cartItem->quantity);
                }

                $order = Order::create([
                    'buyer_id' => $request->user()->id,
                    'shipping_address' => $request->shipping_address,
                    'phone' => $request->phone,
                    'payment_method' => 'cod',
                    'total_amount' => $total,
                    'status' => 'pending',
                ]);

                foreach ($orderItemsData as $itemData) {
                    OrderItem::create([...$itemData, 'order_id' => $order->id]);
                }

                // Clear the cart now that the order is placed
                $cart->items()->delete();

                return $order;
            });

            return response()->json([
                'message' => 'Order placed successfully.',
                'order' => $order->load('items.product'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}