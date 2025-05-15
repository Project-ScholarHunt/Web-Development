<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;


class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user || !$user->is_admin) {
            return response()->json(['message' => 'Forbidden: Admin access only.'], 403);
        }

        $bearerToken = $request->bearerToken();
        $tokenId = explode('|', $bearerToken)[0] ?? null;

        if (!$tokenId || !$user->tokens()->where('id', $tokenId)->exists()) {
            return response()->json(['message' => 'Invalid or mismatched token.'], 401);
        }

        return $next($request);
    }
}