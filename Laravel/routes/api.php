<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentsController;

Route::prefix('students')->group(function () {
    Route::post('/register', [StudentsController::class, 'register']);
    Route::post('/login', [StudentsController::class, 'login']);
    Route::post('/logout', [StudentsController::class, 'logout']);
});
