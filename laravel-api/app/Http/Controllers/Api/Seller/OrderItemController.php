<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function index(Request $request)
    {
        $items = $request->user()->soldOrderItems()
            ->with('product:id,title,slug', 'order:id,buyer_id,shipping_address,phone,created_at', 'order.buyer:id,name')
            ->when($request->status, fn ($q) => $q->where('item_status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json($items);
    }

    public function updateStatus(Request $request, OrderItem $orderItem)
    {
        abort_unless($orderItem->seller_id === $request->user()->id, 403);

        $request->validate([
            'status' => ['required', 'in:confirmed,shipped,delivered,cancelled'],
        ]);

        // Enforce valid forward-only transitions — a seller shouldn't be able to
        // jump straight from 'pending' to 'delivered', or move backwards
        $allowedTransitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['shipped', 'cancelled'],
            'shipped' => ['delivered'],
        ];

        $current = $orderItem->item_status;
        if (! in_array($request->status, $allowedTransitions[$current] ?? [])) {
            return response()->json([
                'message' => "Cannot transition from '{$current}' to '{$request->status}'.",
            ], 422);
        }

        $orderItem->update(['item_status' => $request->status]);
        if ($request->status === 'cancelled') {
            $orderItem->product->increment('stock', $orderItem->quantity);
        }
        $orderItem->order->syncStatus(); 

        return response()->json(['message' => 'Status updated successfully to ' . $request->status . '.', 'item' => $orderItem]);
    }
}