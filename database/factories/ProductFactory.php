<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition()
    {
        return [
            'prd_code' => strtoupper($this->faker->bothify('PRD###')),
            'prd_name' => $this->faker->word(),
            'prd_price' => $this->faker->numberBetween(10000, 500000),
            'prd_stock' => $this->faker->numberBetween(1, 100),
            'prd_description' => $this->faker->sentence(),
            'prd_img' => null,
        ];
    }
}
