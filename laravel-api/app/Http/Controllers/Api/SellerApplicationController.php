<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SellerApplicationRequest;
use App\Models\SellerProfile;
use Illuminate\Http\Request;

class SellerApplicationController extends Controller
{
    // Submit or resubmit an application
    public function store(SellerApplicationRequest $request)
    {
        $user = $request->user();

        $existing = $user->sellerProfile;

        if ($existing && in_array($existing->status, ['pending', 'approved'])) {
            return response()->json([
                'message' => $existing->status === 'approved'
                    ? 'You are already an approved seller.'
                    : 'You already have a pending application.',
            ], 409);
        }

        $path = $request->file('document')->store('seller-documents', 'public');

        // the first array is the “where” condition
        // the second array is the “values to set/update
        $profile = SellerProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'business_name' => $request->business_name,
                'description' => $request->description,
                'document_path' => $path,
                'status' => 'pending',
                'rejected_reason' => null,
                'approved_at' => null,
            ]
        );

        return response()->json([
            'message' => 'Application submitted. You will be notified once reviewed.',
            'status' => $profile->status,
        ], 201);
    }

    // Check own application status
    public function status(Request $request)
    {
        $profile = $request->user()->sellerProfile;

        if (! $profile) {
            return response()->json(['status' => 'not_applied']);
        }

        return response()->json([
            'status' => $profile->status,
            'rejected_reason' => $profile->rejected_reason,
            'submitted_at' => $profile->created_at,
        ]);
    }
}