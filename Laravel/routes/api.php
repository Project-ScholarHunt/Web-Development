<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\TokenValidation;
use App\Http\Middleware\EnsureAdmin;

Route::prefix('users')->group(function () {
    Route::post('/register', [UserController::class, 'registerUser']);
    Route::post('/login', [UserController::class, 'loginUser']);
    Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
});

Route::prefix('admin')->group(function () {
    Route::post('/register', [UserController::class, 'registerAdmin']);
    Route::post('/login', [UserController::class, 'loginAdmin']);
    Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
});

Route::middleware(['auth:sanctum', TokenValidation::class])->get('/user/check-token', function (Request $request) {
    return response()->json([
        'message' => 'Token and email are valid',
    ]);
});

Route::middleware(['auth:sanctum', EnsureAdmin::class])->get('/admin/check-token', function (Request $request) {
    return response()->json(['message' => 'Admin token is valid']);
});