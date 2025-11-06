<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Debt;
use App\Models\Customer;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(): Response
    {
        $transactions = Transaction::with(['user', 'customer', 'details.product', 'debt'])
            ->latest()->paginate(20);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'customers' => \App\Models\Customer::all(['csm_id', 'csm_name']),
            'products' => \App\Models\Product::all(['prd_id', 'prd_name', 'prd_price']),
        ]);
    }

    // POST /api/transactions
    public function store(Request $request)
    {
        $data = $request->validate([
            'tsn_csm_id' => 'nullable|exists:customers,csm_id',
            'tsn_metode' => 'nullable|string',
            'tsn_paid' => 'required|numeric|min:0',
            'tsn_paid_return' => 'nullable|numeric|min:0',
            'details' => 'required|array|min:1',
            'details.*.tsnd_prd_id' => 'required|exists:products,prd_id',
            'details.*.tsnd_qty' => 'required|integer|min:1',
            'details.*.tsnd_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // compute total from details
            $total = 0;
            foreach ($request->details as $d) {
                $total += ($d['tsnd_qty'] * $d['tsnd_price']);
            }

            $transaction = Transaction::create([
                'tsn_usr_id' => auth()->user()->usr_id,
                'tsn_csm_id' => $data['tsn_csm_id'] ?? null,
                'tsn_date' => now(),
                'tsn_metode' => $data['tsn_metode'] ?? null,
                'tsn_total' => $total,
                'tsn_paid' => $data['tsn_paid'],
                'tsn_paid_return' => $data['tsn_paid_return'] ?? 0,
            ]);


            // create details
            foreach ($request->details as $d) {
                TransactionDetail::create([
                    'tsnd_tsn_id' => $transaction->tsn_id,
                    'tsnd_prd_id' => $d['tsnd_prd_id'],
                    'tsnd_qty' => $d['tsnd_qty'],
                    'tsnd_price' => $d['tsnd_price'],
                ]);
            }

            DB::commit();

            $remaining = round($total - $transaction->tsn_paid, 2);
            if ($remaining > 0) {
                return response()->json([
                    'message' => 'Pembayaran kurang, butuh konfirmasi kasir apakah buat hutang atau batalkan transaksi.',
                    'requires_confirmation' => true,
                    'remaining_amount' => $remaining,
                    'transaction' => $transaction->load('details')
                ], 202);
            }

            return response()->json([
                'message' => 'Transaksi berhasil.',
                'requires_confirmation' => false,
                'transaction' => $transaction->load('details')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat transaksi', 'error' => $e->getMessage()], 500);
        }
    }

    // POST /api/transactions/{tsn}/confirm-debt
    public function confirmDebt(Request $request, $tsnId)
    {
        $data = $request->validate([
            'deb_csm_id' => 'required|exists:customers,csm_id',
            'deb_due_date' => 'nullable|date',
        ]);

        $transaction = Transaction::findOrFail($tsnId);
        $remaining = $transaction->tsn_total - $transaction->tsn_paid;

        if ($remaining <= 0) {
            return response()->json(['message' => 'Tidak ada sisa hutang.'], 400);
        }

        DB::beginTransaction();
        try {
            $debt = Debt::create([
                'deb_tsn_id' => $transaction->tsn_id,
                'deb_csm_id' => $data['deb_csm_id'],
                'deb_amount' => $remaining,
                'deb_paid_amount' => 0,
                'deb_due_date' => $data['deb_due_date'] ?? now()->addDays(30),
                'deb_status' => 'unpaid',
            ]);

            // update transaksi agar terkait customer
            $transaction->update(['tsn_csm_id' => $data['deb_csm_id']]);

            DB::commit();
            return response()->json(['message' => 'Debt berhasil dibuat.', 'debt' => $debt], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal membuat debt', 'error' => $e->getMessage()], 500);
        }
    }


    // DELETE /api/transactions/{tsn}  -> cancel
    public function destroy($tsnId)
    {
        $transaction = Transaction::findOrFail($tsnId);

        // Only allow deleting if debt doesn't exist (safety)
        if ($transaction->debt()->exists()) {
            return response()->json(['message' => 'Transaksi memiliki debt, tidak bisa dibatalkan.'], 422);
        }

        $transaction->delete();

        return response()->json(['message' => 'Transaksi dibatalkan dan dihapus.'], 200);
    }

    // Optional endpoint to fetch single transaction
    public function show($tsnId)
    {
        $transaction = Transaction::with(['user', 'customer', 'details.product', 'debt'])->findOrFail($tsnId);
        return response()->json($transaction);
    }
}
