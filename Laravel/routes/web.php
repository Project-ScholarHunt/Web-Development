<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentsController;
use App\Http\Controllers\ScholarshipsController;

// Route::prefix('student')->group(function () {
//     Route::post('/register', [StudentsController::class, 'register']);
//     Route::post('/login', [StudentsController::class, 'login']);
//     Route::post('/logout', [StudentsController::class, 'logout']);
// });

Route::apiResource('scholarships', ScholarshipsController::class);

use App\Http\Controllers\ProfileController;

// Pastikan pakai auth:sanctum atau auth:api sesuai login-mu
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
});



