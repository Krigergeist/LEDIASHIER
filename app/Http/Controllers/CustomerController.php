<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'csm_name' => 'required|string|max:100',
            'csm_phone' => 'nullable|string|max:20',
            'csm_address' => 'nullable|string|max:255',
        ]);

        try {
            $customer = Customer::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Customer berhasil ditambahkan.',
                'customer' => $customer
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Gagal menambah customer', [
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Gagal menambah customer: ' . $e->getMessage()
            ], 500);
        }
    }
}
