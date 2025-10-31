<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'usr_name' => 'Admin',
            'usr_email' => 'admin@gmail.com',
            'usr_password' => Hash::make('11111111'),
            'usr_created_at' => now(),
            'usr_updated_at' => now(),
        ]);
    }
}
