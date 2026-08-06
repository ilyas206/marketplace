<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()->orders()
            ->with('items.product.primaryImage')
            ->latest()
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, \App\Models\Order $order)
    {
        abort_unless($order->buyer_id === $request->user()->id, 403);

        return response()->json($order->load('items.product.primaryImage', 'items.seller:id,name'));
    }
}