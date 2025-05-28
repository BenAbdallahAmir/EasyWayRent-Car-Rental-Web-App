<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    // Inscription
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'password' => 'required|string|min:6',
            'role' => 'nullable|string|in:admin,client'
        ]);

        // Si aucun rôle n'est fourni, mettre "client" par défaut
        $role = $data['role'] ?? 'client';

        $user = User::create([
            'name' => $data['name'],
            'address' => $data['address'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User created successfully!',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    // Connexion (pour les clients et l'admin)
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials. Please check your email and password.'
            ], 401);
        }


        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Welcome back, ' . $user->name . '!',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    //Promouvoir un utilisateur en admin
    public function setAdmin($id)
    {
        // Vérifier que l'utilisateur est authentifié
        // $userAuthenticated = Auth::user();
        // if (!$userAuthenticated) {
        //     return response()->json(['message' => 'Unauthorized. User not authenticated.'], 401);
        // }

        // Vérifier si l'utilisateur authentifié est un administrateur
        // if ($userAuthenticated->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized. Only admins can promote users.'], 403);
        // }

        $user = User::findOrFail($id);

        // Vérifier si l'utilisateur est déjà admin
        if ($user->role === 'admin') {
            return response()->json(['message' => 'User is already an admin.'], 400);
        }

        // Promouvoir l'utilisateur
        $user->role = 'admin';
        $user->save();

        return response()->json([
            'message' => 'User promoted to admin successfully!',
            'user' => $user
        ]);

        //Lister tous les utilisateurs
    }
    public function index()
    {
        // Vérifier que l'utilisateur est authentifié
        // $userAuthenticated = Auth::user();
        // if (!$userAuthenticated) {
        //     return response()->json(['message' => 'Unauthorized. User not authenticated.'], 401);
        // }

        // Vérifier si l'utilisateur authentifié est un administrateur
        // if ($userAuthenticated->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized. Only admins can promote users.'], 403);
        // }
        $users = User::all();
        return response()->json($users);
    }

    // Liste des administrateurs (accessible uniquement par un admin)
    public function getAdmins()
    {
        // $userAuthenticated = Auth::user();
        // if (!$userAuthenticated || $userAuthenticated->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized. Only admins can view this list.'], 403);
        // }

        $admins = User::where('role', 'admin')->get();

        if ($admins->isEmpty()) {
            return response()->json(['message' => 'No administrators found.'], 404);
        }

        return response()->json($admins);
    }

    // Liste des clients (accessible uniquement par un admin)
    public function getClients()
    {
        // $userAuthenticated = Auth::user();
        // if (!$userAuthenticated || $userAuthenticated->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized. Only admins can view this list.'], 403);
        // }

        $clients = User::where('role', 'client')->get();

        if ($clients->isEmpty()) {
            return response()->json(['message' => 'No clients found.'], 404);
        }

        return response()->json($clients);
    }

    public function updateUser(Request $request, $id)
    {
        // $userAuthenticated = Auth::user();
        // if (!$userAuthenticated || $userAuthenticated->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized. Only admins can update users.'], 403);
        // }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'address' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:15',
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|string|in:admin,client',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json(['message' => 'User updated successfully!', 'user' => $user]);
    }

    public function deleteUser($id)
    {
        // $userAuthenticated = Auth::user();
        // if (!$userAuthenticated || $userAuthenticated->role !== 'admin') {
        //     return response()->json(['message' => 'Unauthorized. Only admins can delete users.'], 403);
        // }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully!']);
    }


    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
    public function getUserProfile(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        return response()->json($user);
    }

    /**
     * Mettre à jour le mot de passe de l'utilisateur
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'required|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Vérifier que le mot de passe actuel est correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully!']);
    }
}
