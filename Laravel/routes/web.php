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


