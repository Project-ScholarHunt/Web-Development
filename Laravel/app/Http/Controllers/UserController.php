<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegisterVerificationMail;
use Illuminate\Support\Str;
use App\Mail\OtpMail;

class UserController extends Controller
{
    public function registerUser(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => [
                'required',
                'email',
                'unique:users,email',
            ],
            'password' => 'required|min:6',
            'phone'    => 'nullable|string|max:20',
        ]);

        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'Email already registered'], 409);
        }

        $token = Str::uuid();

        Cache::put('register_user_' . $token, [
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'is_admin' => 0,
        ], now()->addMinutes(30));

        $verifyUrl = url("/api/email/verify-register/{$token}");

        Mail::to($request->email)->send(new RegisterVerificationMail($verifyUrl));

        return response()->json(['message' => 'Verification email sent']);
    }

    public function verifyRegistration($token)
    {
        $userData = Cache::get('register_user_' . $token);

        if (!$userData) {
            return response()->json(['message' => 'Token invalid or expired'], 404);
        }

        $user = User::create($userData);
        $user->markEmailAsVerified();

        event(new Registered($user));

        Cache::forget('register_user_' . $token);

        Auth::login($user);
        return redirect()->away('http://localhost:5173/login');
    }

    public function loginUser(Request $request)
    {
        $request->validate([
            'email'     => 'required|email',
            'password'  => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email or Password is Incorrect'], 401);
        }

        $otp = rand(10000000, 99999999);
        $name = $user->name;
        Cache::put("otp_user_{$user->email}", $otp, now()->addMinutes(1));

        Mail::to($user->email)->send(new OtpMail($otp, $name));

        return response()->json([
            'message' => 'OTP Sent to your email',
            'email' => $user->email
        ]);
    }

    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email'     => 'required|email',
            'password'  => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Email or Password is Incorrect'], 401);
        }

        if ((int)$user->is_admin !== 1) {
            return response()->json(['message' => 'Access denied.'], 403);
        }

        $otp = rand(10000000, 99999999);
        $name = $user->name;
        Cache::put("otp_admin_{$user->email}", $otp, now()->addMinutes(1));

        Mail::to($user->email)->send(new OtpMail($otp, $name));

        return response()->json([
            'message' => 'OTP Sent to your email',
            'email' => $user->email
        ]);
    }

    public function verifyUserOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:8',
        ]);

        $email = $request->email;
        $cachedOtp = Cache::get("otp_user_{$email}");

        if (!$cachedOtp) {
            return response()->json(['message' => 'OTP Expired'], 401);
        }

        if ($cachedOtp != $request->otp) {
            return response()->json(['message' => 'OTP Invalid'. $cachedOtp], 401);
        }

        $user = User::where('email', $email)->first();

        if (!$user || $user->is_admin === 1) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        Cache::forget('otp_user_' . $request->otp);

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->email
        ]);
    }

    public function verifyAdminOtp(Request $request)
    {
        $request->validate([
            'otp' => 'required|digits:8',
        ]);

        $email = $request->email;
        $cachedOtp = Cache::get("otp_admin_{$email}");

        if (!$cachedOtp) {
            return response()->json(['message' => 'OTP Expired'], 401);
        }

        if ($cachedOtp != $request->otp) {
            return response()->json(['message' => 'OTP Invalid'], 401);
        }

        $user = User::where('email', $email)->first();

        if (!$user || (int)$user->is_admin !== 1) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        Cache::forget('otp_admin_' . $request->otp);

        return response()->json([
            'message' => 'Admin login successful',
            'token' => $token,
            'user' => $user
        ]);
    }
}
