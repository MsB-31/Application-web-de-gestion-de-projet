<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom',    'like', "%{$s}%")
                  ->orWhere('prenom', 'like', "%{$s}%")
                  ->orWhere('email',  'like', "%{$s}%")
                  ->orWhere('role',   'like', "%{$s}%");
            });
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        return UserResource::collection($query->orderBy('nom')->get());
    }

    public function show(User $user)
    {
        return new UserResource($user->load('projets'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:users',
            'role'       => 'required|string|max:100',
            'motDePasse' => 'required|string|min:8',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'role'     => $data['role'],
            'password' => Hash::make($data['motDePasse']),
        ]);

        return new UserResource($user);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'nom'    => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email'  => 'sometimes|email|unique:users,email,' . $user->id,
            'role'   => 'sometimes|string|max:100',
            'avatar' => 'sometimes|nullable|string|max:500',
        ]);

        $user->update($data);

        return new UserResource($user->fresh());
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(null, 204);
    }
}
