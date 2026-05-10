<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $payload = $request->validate([
            'email' => ['required', 'email'],
            'motDePasse' => ['required', 'string'],
        ]);

        $user = User::where('email', $payload['email'])->first();

        if (! $user || ! Hash::check($payload['motDePasse'], $user->password)) {
            return response()->json(['message' => 'Identifiants invalides.'], 401);
        }

        $user->api_token = Str::random(80);
        $user->save();

        return response()->json([
            'token' => $user->api_token,
            'user' => $this->formatUser($user),
        ]);
    }

    public function register(Request $request)
    {
        $payload = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'motDePasse' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'nom' => $payload['nom'],
            'prenom' => $payload['prenom'],
            'email' => $payload['email'],
            'password' => Hash::make($payload['motDePasse']),
            'role' => 'Utilisateur',
            'api_token' => Str::random(80),
        ]);

        return response()->json([
            'token' => $user->api_token,
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function me(Request $request)
    {
        $user = $this->authenticate($request);
        return response()->json($this->formatUser($user));
    }

    public function updateProfile(Request $request)
    {
        $user = $this->authenticate($request);

        $payload = $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'prenom' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,'.$user->id],
        ]);

        $user->update($payload);

        return response()->json($this->formatUser($user));
    }

    public function changePassword(Request $request)
    {
        $user = $this->authenticate($request);

        $payload = $request->validate([
            'currentPassword' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:6'],
        ]);

        if (! Hash::check($payload['currentPassword'], $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }

        $user->password = Hash::make($payload['newPassword']);
        $user->save();

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    public function logout(Request $request)
    {
        $user = $this->authenticate($request);
        $user->api_token = null;
        $user->save();

        return response()->json(['message' => 'Déconnecté.']);
    }
}
