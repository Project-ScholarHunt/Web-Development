<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\TokenValidation;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Controllers\ScholarshipsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::prefix('users')->group(function () {
    Route::post('/register', [UserController::class, 'registerUser']);
    Route::post('/login', [UserController::class, 'loginUser']);
});

Route::get('/email/verify-register/{token}', [UserController::class, 'verifyRegistration']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [UserController::class, 'loginAdmin']);
});

Route::middleware(['auth:sanctum', TokenValidation::class])->get('/user/check-token', function (Request $request) {
    return response()->json([
        'message' => 'Token and email are valid',
    ]);
});

Route::middleware(['auth:sanctum', EnsureAdmin::class])->get('/admin/check-token', function (Request $request) {
    return response()->json(['message' => 'Admin token is valid']);
});

Route::prefix('scholarships')->group(function () {
    Route::get('/', [ScholarshipsController::class, 'index']);
    Route::get('/show', [ScholarshipsController::class, 'index']);
    Route::get('/{id}', [ScholarshipsController::class, 'show']);
    Route::get('/search/{term}', [ScholarshipsController::class, 'search']);
});

Route::middleware(['auth:sanctum', EnsureAdmin::class])->prefix('scholarships')->group(function () {
    Route::post('/', [ScholarshipsController::class, 'store']);
    Route::put('/{id}', [ScholarshipsController::class, 'update']);
    Route::delete('/{id}', [ScholarshipsController::class, 'destroy']);
});

// Pastikan pakai auth:sanctum atau auth:api sesuai login-mu
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
});

Route::post('/verify-otp/user', [UserController::class, 'verifyUserOtp']);
Route::post('/verify-otp/admin', [UserController::class, 'verifyAdminOtp']);