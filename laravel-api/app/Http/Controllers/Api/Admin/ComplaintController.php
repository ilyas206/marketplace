<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $complaints = Complaint::with('buyer:id,name', 'seller:id,name', 'order:id')
            ->when($request->status, fn ($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json($complaints);
    }

    public function resolve(Request $request, Complaint $complaint)
    {
        $request->validate([
            'admin_response' => ['required', 'string', 'max:1000'],
            'status' => ['required', 'in:in_progress,resolved'],
        ]);

        $complaint->update([
            'status' => $request->status,
            'admin_response' => $request->admin_response,
        ]);

        return response()->json(['message' => 'Complaint updated.', 'complaint' => $complaint]);
    }
}