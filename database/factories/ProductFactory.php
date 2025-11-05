<?php


namespace Database\Factories;


use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


class ProductFactory extends Factory
{
    protected $model = \App\Models\Product::class;


    public function definition()
    {
        $name = $this->faker->words(3, true);
        return [
            'prd_code' => Str::upper(\Illuminate\Support\Str::random(6)),
            'prd_name' => ucfirst($name),
            'prd_price' => $this->faker->randomFloat(2, 5, 500),
            'prd_stock' => $this->faker->numberBetween(0, 200),
            'prd_description' => $this->faker->sentence(12),
            'prd_img' => null,
        ];
    }
}
