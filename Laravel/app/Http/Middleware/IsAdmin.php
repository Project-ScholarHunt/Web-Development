<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = JWTAuth::getToken();

            $claims = JWTAuth::setToken($token)->getPayload();

            if (empty($claims->get('is_admin')) || (int) $claims->get('is_admin') != 1) {
                return response()->json(['message' => 'Access denied.'], 403);
            }

            return $next($request);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Token error: ' . $e->getMessage()], 401);
        }
    }
}
