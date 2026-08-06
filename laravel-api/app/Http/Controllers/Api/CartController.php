<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function getOrCreateCart(Request $request): Cart
    {
        if ($request->user()) {
            return Cart::firstOrCreate(['user_id' => $request->user()->id]);
        }

        // Guest cart, identified by a client-generated ID (React stores this in localStorage)
        $guestId = $request->header('X-Guest-Cart-Id');
        abort_if(! $guestId, 422, 'Missing guest cart identifier.');

        return Cart::firstOrCreate(['session_id' => $guestId, 'user_id' => null]);
    }

    public function show(Request $request)
    {
        $cart = $this->getOrCreateCart($request);

        return new CartResource($cart->load('items.product.primaryImage'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = Product::available()->findOrFail($request->product_id);

        if ($product->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available.'], 422);
        }

        $cart = $this->getOrCreateCart($request);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($item) {
            $newQty = $item->quantity + $request->quantity;
            if ($product->stock < $newQty) {
                return response()->json(['message' => 'Not enough stock available.'], 422);
            }
            $item->update(['quantity' => $newQty]);
        } else {
            $item = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        return new CartResource($cart->fresh()->load('items.product.primaryImage'));
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate(['quantity' => ['required', 'integer', 'min:1']]);

        if ($cartItem->product->stock < $request->quantity) {
            return response()->json(['message' => 'Not enough stock available.'], 422);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return new CartResource($cartItem->cart->fresh()->load('items.product.primaryImage'));
    }

    public function destroy(CartItem $cartItem)
    {
        $cart = $cartItem->cart;
        $cartItem->delete();

        return new CartResource($cart->fresh()->load('items.product.primaryImage'));
    }

    // Called right after login — merges guest cart into the now-authenticated user's cart
    public function merge(Request $request)
    {
        $guestId = $request->header('X-Guest-Cart-Id');
        if (! $guestId) {
            return response()->json(['message' => 'No guest cart to merge.']);
        }

        $guestCart = Cart::where('session_id', $guestId)->first();
        if (! $guestCart) {
            return response()->json(['message' => 'No guest cart to merge.']);
        }

        $userCart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        foreach ($guestCart->items as $guestItem) {
            $existing = CartItem::where('cart_id', $userCart->id)
                ->where('product_id', $guestItem->product_id)
                ->first();

            if ($existing) {
                $existing->update(['quantity' => $existing->quantity + $guestItem->quantity]);
            } else {
                CartItem::create([
                    'cart_id' => $userCart->id,
                    'product_id' => $guestItem->product_id,
                    'quantity' => $guestItem->quantity,
                ]);
            }
        }

        $guestCart->delete(); // cascades to guest cart_items

        return new CartResource($userCart->fresh()->load('items.product.primaryImage'));
    }
}