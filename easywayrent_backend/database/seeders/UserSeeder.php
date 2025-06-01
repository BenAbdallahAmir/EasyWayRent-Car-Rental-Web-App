<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'admin',
            'email' => 'admin@example.com',
            'address' => 'Admin Address',
            'phone' => '1234567890',
            'password' => Hash::make('password'),
        ]);

        // User
        User::create([
            'name' => 'user',
            'email' => 'user@example.com',
            'address' => 'Sousse',
            'phone' => '29831012',
            'password' => Hash::make('password'),
        ]);
    }
}
