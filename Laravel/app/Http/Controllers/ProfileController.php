<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Ambil data profil user yang sedang login
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Update data profil (name, email, phone)
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable'],
        ]);

        $user->update($data);

        return response()->json(['user' => $user, 'message' => 'Profil berhasil diperbarui']);
    }

    // Update password
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'currentPassword' => 'required',
            'newPassword' => 'required|confirmed|min:6',
        ]);

        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Password lama salah'], 400);
        }

        $user->password = bcrypt($request->newPassword);
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah']);
    }
}
