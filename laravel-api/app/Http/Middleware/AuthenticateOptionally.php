<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateOptionally
{
    public function handle(Request $request, Closure $next): Response
    {
        // If a Bearer token is present and valid, resolve it into a user
        // and set it on the request — same effect auth:sanctum would have.
        // If no token, or it's invalid, just continue as guest — no abort.
        if ($request->bearerToken()) {
            $user = Auth::guard('sanctum')->user();

            if ($user) {
                $request->setUserResolver(fn () => $user);
            }
        }

        return $next($request);
    }
}