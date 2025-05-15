<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TokenValidation
{
    public function handle(Request $request, Closure $next)
    {
        $emailHeader = $request->header('X-User-Email');
        $user = $request->user();

        if (!$user || !$emailHeader) {
            return response()->json(['message' => 'Tidak terotorisasi'], 401);
        }

        if ($user->email !== $emailHeader) {
            return response()->json(['message' => 'Email does not match token'], 401);
        }

        return $next($request);
    }
}
