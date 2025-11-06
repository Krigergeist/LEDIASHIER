<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Customer;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition()
    {
        return [
            'csm_nik' => $this->faker->unique()->numerify('ID##########'),
            'csm_name' => $this->faker->name(),
            'csm_phone' => $this->faker->phoneNumber(),
            'csm_address' => $this->faker->address(),
        ];
    }
}
