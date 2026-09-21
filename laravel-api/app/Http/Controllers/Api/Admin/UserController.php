<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles:name')
            ->when($request->role, fn ($q) => $q->role($request->role)) // Spatie scope
            ->when($request->search, fn ($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"))
            ->paginate($request->per_page ?? 15);

        return response()->json($users);
    }

    // Suspend/reinstate — using a simple boolean rather than deleting accounts
    public function toggleSuspension(User $user)
    {
        abort_if($user->hasRole('admin'), 403, 'Cannot suspend another admin.');

        $user->update(['is_suspended' => ! $user->is_suspended]);

        return response()->json([
            'message' => $user->is_suspended ? 'User suspended successfully.' : 'User reinstated successfully.',
            'is_suspended' => $user->is_suspended,
        ]);
    }
}