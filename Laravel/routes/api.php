<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ScholarshipsController;

// Auth routes
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

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});

// Scholarship routes
Route::prefix('scholarships')->group(function () {
    Route::get('/', [ScholarshipsController::class, 'index']);
    Route::get('/show', [ScholarshipsController::class, 'index']);
    Route::get('/{id}', [ScholarshipsController::class, 'show']);
    Route::post('/', [ScholarshipsController::class, 'store']);
    Route::put('/{id}', [ScholarshipsController::class, 'update']);
    Route::delete('/{id}', [ScholarshipsController::class, 'destroy']);
    Route::get('/search/{term}', [ScholarshipsController::class, 'search']);
});
