<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SellerProfile;
use Illuminate\Http\Request;

class SellerApprovalController extends Controller
{
    // List all pending applications
    public function index()
    {
        // with() is used when you are still building the query.
        $applications = SellerProfile::with('user:id,name,email')
            ->where('status', 'pending')
            ->latest()
            ->paginate(10);

        return response()->json($applications);
    }

    // View one application in detail (including document)
    public function show(SellerProfile $sellerProfile)
    {
        // load() is used after you already fetched the seller profile object.
        $sellerProfile->load('user:id,name,email,phone');

        return response()->json([
            'id' => $sellerProfile->id,
            'business_name' => $sellerProfile->business_name,
            'description' => $sellerProfile->description,
            'document_url' => asset('storage/' . $sellerProfile->document_path),
            'status' => $sellerProfile->status,
            'user' => $sellerProfile->user,
            'submitted_at' => $sellerProfile->created_at,
        ]);
    }

    public function approve(SellerProfile $sellerProfile)
    {
        if ($sellerProfile->status === 'approved') {
            return response()->json(['message' => 'Already approved.'], 409);
        }

        $sellerProfile->update([
            'status' => 'approved',
            'approved_at' => now(),
            'rejected_reason' => null,
        ]);

        $sellerProfile->user->assignRole('seller');

        return response()->json(['message' => 'Seller approved.']);
    }

    public function reject(Request $request, SellerProfile $sellerProfile)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $sellerProfile->update([
            'status' => 'rejected',
            'rejected_reason' => $request->reason,
            'approved_at' => null,
        ]);

        // If they previously had the seller role (e.g. re-review case), it stays untouched here —
        // rejection only applies to pending applications, not already-approved sellers.

        return response()->json(['message' => 'Application rejected.']);
    }
}