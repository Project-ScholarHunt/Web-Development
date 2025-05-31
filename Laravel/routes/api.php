<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Middleware\TokenValidation;
use App\Http\Middleware\EnsureAdmin;
use App\Http\Controllers\ScholarshipsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicantsController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\SelectionsController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::prefix('users')->group(function () {
    Route::post('/register', [UserController::class, 'registerUser']);
    Route::post('/login', [UserController::class, 'loginUser']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/users/logout', [UserController::class, 'logout']);

    Route::get('/user/check-token', function (Request $request) {
        return response()->json([
            'message' => 'Token and email are valid',
        ]);
    })->middleware(TokenValidation::class);

    Route::get('/user', [UserController::class, 'getUser']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/password', [ProfileController::class, 'updatePassword']);

    Route::post('/apply', [ApplicantsController::class, 'store']);
    Route::get('/applicants/check/{scholarshipId}', [ApplicantsController::class, 'checkApplication']);
    Route::get('/my-applications', [ApplicantsController::class, 'myApplications']);
});

Route::get('/email/verify-register/{token}', [UserController::class, 'verifyRegistration']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [UserController::class, 'loginAdmin']);
    Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
        Route::post('/logout', [UserController::class, 'logout']);
        Route::get('/check-token', function (Request $request) {
            return response()->json(['message' => 'Admin token is valid']);
        });

        Route::get('/applicants', [ApplicantsController::class, 'index']);
        Route::put('/applicants/{applicantId}/status', [ApplicantsController::class, 'updateStatus']);
        Route::post('/selections/send-email', [SelectionsController::class, 'sendEmail']);
        Route::prefix('analytics')->group(function () {
            Route::get('/scholarships', [AnalyticsController::class, 'getScholarships']);
            Route::get('/applicants', [AnalyticsController::class, 'getApplicants']);
            Route::get('/general-stats', [AnalyticsController::class, 'getGeneralStats']);
        });
    });
});

Route::middleware(['auth:sanctum', EnsureAdmin::class])->group(function () {
    Route::prefix('scholarships')->group(function () {
        Route::post('/', [ScholarshipsController::class, 'store']);
        Route::put('/{id}', [ScholarshipsController::class, 'update']);
        Route::delete('/{id}', [ScholarshipsController::class, 'destroy']);
    });
});

Route::middleware(['auth:sanctum', TokenValidation::class])->get('/user/check-token', function (Request $request) {
    return response()->json([
        'message' => 'Token and email are valid',
    ]);
});

Route::prefix('scholarships')->group(function () {
    Route::get('/', [ScholarshipsController::class, 'index']);
    Route::get('/show', [ScholarshipsController::class, 'index']);
    Route::get('/{id}', [ScholarshipsController::class, 'show']);
    Route::get('/search/{term}', [ScholarshipsController::class, 'search']);
});

Route::post('/verify-otp/user', [UserController::class, 'verifyUserOtp']);
Route::post('/verify-otp/admin', [UserController::class, 'verifyAdminOtp']);
