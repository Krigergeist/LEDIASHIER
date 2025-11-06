<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionSeeder extends Seeder
{
    public function run()
    {
        $user = User::first() ?? User::factory()->create();
        $customers = Customer::all();
        $products = Product::take(5)->get();

        if ($products->isEmpty()) {
            // if your products factory doesn't exist, skip
            return;
        }

        foreach ($customers->take(5) as $customer) {
            DB::transaction(function () use ($user, $customer, $products) {
                $details = [];
                $total = 0;
                $picked = $products->random(2);
                foreach ($picked as $p) {
                    $qty = rand(1, 3);
                    $price = $p->price ?? 10000; // adjust field name if different
                    $total += $qty * $price;
                    $details[] = ['tsnd_prd_id' => $p->prd_id, 'tsnd_qty' => $qty, 'tsnd_price' => $price];
                }

                $paid = (rand(0, 1) ? $total : $total - rand(1000, 50000)); // some paid fully, some remaining

                $tsn = Transaction::create([
                    'tsn_usr_id' => $user->id,
                    'tsn_csm_id' => $customer->csm_id,
                    'tsn_date' => Carbon::now(),
                    'tsn_metode' => 'cash',
                    'tsn_total' => $total,
                    'tsn_paid' => $paid,
                    'tsn_paid_return' => 0,
                ]);

                foreach ($details as $d) {
                    TransactionDetail::create([
                        'tsnd_tsn_id' => $tsn->tsn_id,
                        'tsnd_prd_id' => $d['tsnd_prd_id'],
                        'tsnd_qty' => $d['tsnd_qty'],
                        'tsnd_price' => $d['tsnd_price'],
                    ]);
                }

                if ($paid < $total) {
                    // create a debt record
                    $remaining = $total - $paid;
                    \App\Models\Debt::create([
                        'deb_tsn_id' => $tsn->tsn_id,
                        'deb_csm_id' => $customer->csm_id,
                        'deb_amount' => $remaining,
                        'deb_paid_amount' => 0,
                        'deb_due_date' => Carbon::now()->addDays(30),
                        'deb_status' => 'unpaid',
                    ]);
                }
            });
        }
    }
}
