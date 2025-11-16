<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'prd_code' => 'PRD-0001',
                'prd_name' => 'Indomie Goreng Original',
                'prd_price' => 3800,
                'prd_stock' => 120,
                'prd_description' => 'Mi goreng instan dengan rasa original yang paling populer.',
                'prd_img' => 'products/Indomie Goreng Original.jpg',
            ],
            [
                'prd_code' => 'PRD-0002',
                'prd_name' => 'Aqua Botol 600ml',
                'prd_price' => 4500,
                'prd_stock' => 200,
                'prd_description' => 'Air mineral kemasan botol ukuran 600ml.',
                'prd_img' => 'products/Aqua Botol 600ml.jpg',
            ],
            [
                'prd_code' => 'PRD-0003',
                'prd_name' => 'Susu Ultra Milk Cokelat 250ml',
                'prd_price' => 6500,
                'prd_stock' => 80,
                'prd_description' => 'Susu UHT rasa cokelat 250ml.',
                'prd_img' => 'products/Susu Ultra Milk Cokelat 250ml.jpg',
            ],
            [
                'prd_code' => 'PRD-0004',
                'prd_name' => 'Beras Cap Topi Koki 5kg',
                'prd_price' => 69000,
                'prd_stock' => 40,
                'prd_description' => 'Beras premium wangi kualitas tinggi.',
                'prd_img' => 'products/Beras Cap Topi Koki 5kg.jpg',
            ],
            [
                'prd_code' => 'PRD-0005',
                'prd_name' => 'Telur Ayam Ras 1 Kg',
                'prd_price' => 29000,
                'prd_stock' => 50,
                'prd_description' => 'Telur ayam ras segar per kilogram.',
                'prd_img' => 'products/Telur Ayam Ras 1 Kg.jpg',
            ],
            [
                'prd_code' => 'PRD-0006',
                'prd_name' => 'Minyak Goreng Bimoli 1L',
                'prd_price' => 15500,
                'prd_stock' => 70,
                'prd_description' => 'Minyak goreng Bimoli ukuran 1 liter.',
                'prd_img' => 'products/Minyak Goreng Bimoli 1L.jpg',
            ],
            [
                'prd_code' => 'PRD-0007',
                'prd_name' => 'Gula Pasir Gulaku 1kg',
                'prd_price' => 14500,
                'prd_stock' => 65,
                'prd_description' => 'Gula pasir putih merek Gulaku.',
                'prd_img' => 'products/Gula Pasir Gulaku 1kg.jpg',
            ],
            [
                'prd_code' => 'PRD-0008',
                'prd_name' => 'Saus ABC Sambal Extra Pedas 275ml',
                'prd_price' => 9500,
                'prd_stock' => 90,
                'prd_description' => 'Saus sambal ABC ekstra pedas.',
                'prd_img' => 'products/Saus ABC Sambal Extra Pedas 275ml.jpg',
            ],
            [
                'prd_code' => 'PRD-0009',
                'prd_name' => 'Rinso Anti Noda 700g',
                'prd_price' => 18000,
                'prd_stock' => 40,
                'prd_description' => 'Detergen bubuk Rinso anti noda kemasan 700g.',
                'prd_img' => 'products/Rinso Anti Noda 700g.jpg',
            ],
            [
                'prd_code' => 'PRD-0010',
                'prd_name' => 'Mie Sedaap Ayam Bawang',
                'prd_price' => 3200,
                'prd_stock' => 150,
                'prd_description' => 'Mi instan Mie Sedaap rasa ayam bawang.',
                'prd_img' => 'products/Mie Sedaap Ayam Bawang.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
