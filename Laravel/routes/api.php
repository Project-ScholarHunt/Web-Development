<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentsController;
use Illuminate\Http\Request;;

Route::prefix('students')->group(function () {
    Route::post('/register', [StudentsController::class, 'register']);
    Route::post('/login', [StudentsController::class, 'login']);
    Route::post('/logout', [StudentsController::class, 'logout']);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json($request->user());
});