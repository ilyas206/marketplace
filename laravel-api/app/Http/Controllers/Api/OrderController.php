<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items.product.primaryImage', 'items.seller')
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, \App\Models\Order $order)
    {
        abort_unless($order->buyer_id === $request->user()->id, 403);

        return response()->json($order->load('items.product.primaryImage', 'items.seller:id,name'));
    }

    public function cancelItem(Request $request, \App\Models\OrderItem $orderItem)
    {
        abort_unless($orderItem->order->buyer_id === $request->user()->id, 403);

        if ($orderItem->item_status !== 'pending') {
            return response()->json([
                'message' => 'This item can no longer be cancelled — the seller has already started processing it.',
            ], 422);
        }

        $orderItem->update(['item_status' => 'cancelled']);
        $orderItem->product->increment('stock', $orderItem->quantity);
        $orderItem->order->syncStatus();

        return response()->json(['message' => 'Item cancelled successfully.', 'item' => $orderItem]);
    }
}