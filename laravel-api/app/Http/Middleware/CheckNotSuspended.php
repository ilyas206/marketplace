<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckNotSuspended
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->is_suspended) {
            $request->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Your account has been suspended.'], 403);
        }

        return $next($request);
    }
}