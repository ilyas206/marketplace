<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'seller_id' => ['nullable', 'exists:users,id'],
            'order_id' => ['nullable', 'exists:orders,id'],
            'subject' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:2000'],
        ]);

        // If tied to an order, confirm it actually belongs to this buyer — prevents filing complaints on other people's orders
        if ($request->order_id) {
            $order = \App\Models\Order::findOrFail($request->order_id);
            abort_unless($order->buyer_id === $request->user()->id, 403);
        }

        $complaint = Complaint::create([
            'buyer_id' => $request->user()->id,
            'seller_id' => $request->seller_id,
            'order_id' => $request->order_id,
            'subject' => $request->subject,
            'description' => $request->description,
            'status' => 'open',
        ]);

        return response()->json($complaint, 201);
    }

    public function index(Request $request)
    {
        $complaints = $request->user()->complaintsFiled()->with('buyer:id,name', 'seller:id,name', 'order:id')
            ->latest()
            ->paginate(10);

        return response()->json($complaints);
    }
}