<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:users',
            'motDePasse' => 'required|string|min:8',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'password' => Hash::make($data['motDePasse']),
            'role'     => 'Membre',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => new UserResource($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'      => 'required|email',
            'motDePasse' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['motDePasse'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        // Révoquer les anciens tokens
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => new UserResource($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(new UserResource($request->user()));
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'nom'    => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email'  => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'role'   => 'sometimes|string|max:100',
            'avatar' => 'sometimes|nullable|string|max:500',
        ]);

        $request->user()->update($data);

        return response()->json(new UserResource($request->user()->fresh()));
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword'     => 'required|string|min:8|different:currentPassword',
        ]);

        if (! Hash::check($data['currentPassword'], $request->user()->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $request->user()->update(['password' => Hash::make($data['newPassword'])]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès.']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}
