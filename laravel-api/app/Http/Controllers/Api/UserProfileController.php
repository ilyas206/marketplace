<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserProfileController extends Controller
{
    // Minimal public-safe profile — just enough to identify who you're chatting with.
    // No email/phone/financial data exposed here.
    public function show(User $user)
    {
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'roles' => $user->getRoleNames(),
            'business_name' => $user->sellerProfile?->status === 'approved' ? $user->sellerProfile?->business_name : null,
        ]);
    }

    public function supportContact()
    {
        $admin = \App\Models\User::role('admin')->first();

        abort_if(! $admin, 404, 'No support contact available.');

        return response()->json(['id' => $admin->id, 'name' => $admin->name]);
    }
}

