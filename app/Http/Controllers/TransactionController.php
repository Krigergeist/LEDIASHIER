<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Debt;
use App\Models\Customer;
use App\Models\Product;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class TransactionController extends Controller
{
    // ✅ Halaman daftar transaksi
    public function index(Request $request): Response
    {
        $query = Transaction::with(['user', 'customer', 'details.product', 'debt'])
            ->latest();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('tsn_id', 'like', "%{$search}%")
                    ->orWhere('tsn_metode', 'like', "%{$search}%")
                    ->orWhere('tsn_total', 'like', "%{$search}%")
                    ->orWhere('tsn_paid', 'like', "%{$search}%")
                    ->orWhere('tsn_type', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($qc) use ($search) {
                        $qc->where('csm_name', 'like', "%{$search}%")
                            ->orWhere('csm_phone', 'like', "%{$search}%");
                    })
                    ->orWhereHas('user', function ($qu) use ($search) {
                        $qu->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })
                    ->orWhereHas('details.product', function ($qp) use ($search) {
                        $qp->where('prd_name', 'like', "%{$search}%")
                            ->orWhere('prd_code', 'like', "%{$search}%");
                    });
            });
        }

        $transactions = $query->paginate(10);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'customers' => Customer::all(['csm_id', 'csm_name']),
            'products' => Product::all(['prd_id', 'prd_name', 'prd_price', 'prd_stock']),
            'flash' => session('flash') ?? null,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }

    // ✅ Halaman tambah transaksi (React)
    public function create(): Response
    {
        return Inertia::render('Transactions/Create', [
            'customers' => Customer::all(['csm_id', 'csm_name']),
            'products' => Product::all(['prd_id', 'prd_name', 'prd_price', 'prd_stock']),
        ]);
    }

    // ✅ Simpan transaksi baru
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tsn_metode' => 'required|string',
                'details' => 'required|array|min:1',
                'details.*.tsnd_prd_id' => 'required|integer|exists:products,prd_id',
                'details.*.tsnd_qty' => 'required|integer|min:1',
            ]);

            $user = auth()->user();
            if (!$user) {
                throw new \Exception("User belum login, tsn_usr_id tidak boleh null.");
            }

            DB::beginTransaction();

            // Buat customer baru jika perlu
            $customerId = null;
            if ($request->csm_id) {
                $customerId = $request->csm_id;
            } elseif ($request->csm_name) {
                $customer = Customer::firstOrCreate(
                    ['csm_name' => $request->csm_name],
                    [
                        'csm_nik' => $request->csm_nik,
                        'csm_phone' => $request->csm_phone,
                        'csm_address' => $request->csm_address,
                    ]
                );
                $customerId = $customer->csm_id;
            }

            // Hitung kembalian jika overpaid
            $paidReturn = max(0, $request->tsn_paid - $request->tsn_total);

            // Simpan transaksi
            $transaction = Transaction::create([
                'tsn_usr_id' => $user->usr_id ?? $user->id,
                'csm_id' => $customerId,
                'csm_name' => $request->csm_name,
                'tsn_metode' => $request->tsn_metode,
                'tsn_total' => $request->tsn_total,
                'tsn_paid' => $request->tsn_paid,
                'tsn_paid_return' => $paidReturn,
                'tsn_type' => $request->tsn_type ?? 'normal',
            ]);

            // Simpan detail dan kurangi stok
            foreach ($request->details as $detail) {
                $prd = Product::findOrFail($detail['tsnd_prd_id']);

                if ($prd->prd_stock < $detail['tsnd_qty']) {
                    throw new \Exception("Stok produk {$prd->prd_name} tidak cukup!");
                }

                $transaction->details()->create([
                    'tsnd_prd_id' => $prd->prd_id,
                    'tsnd_qty' => $detail['tsnd_qty'],
                ]);

                // Kurangi stok produk
                $prd->decrement('prd_stock', $detail['tsnd_qty']);
            }


            // Jika transaksi hutang
            if (($request->tsn_type ?? 'normal') === 'hutang' && $request->tsn_total > $request->tsn_paid) {
                $remaining = $request->remaining ?? ($request->tsn_total - $request->tsn_paid);

                Debt::create([
                    'deb_tsn_id' => $transaction->tsn_id,
                    'deb_csm_id' => $customerId,
                    'deb_amount' => $remaining,
                    'deb_paid_amount' => 0,
                    'deb_due_date' => $request->deb_due_date ?? now()->addDays(30),
                    'deb_status' => 'unpaid',
                ]);
            }

            DB::commit();

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil disimpan');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Gagal menyimpan transaksi', [
                'message' => $e->getMessage(),
                'input' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->with('error', 'Gagal menyimpan transaksi: ' . $e->getMessage());
        }
    }






    // ✅ Halaman edit transaksi (React)
    public function edit($tsnId): Response
    {
        $transaction = Transaction::with(['details.product', 'customer', 'debt'])
            ->findOrFail($tsnId);

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'customers' => Customer::all(['csm_id', 'csm_name']),
            'products' => Product::all(['prd_id', 'prd_name', 'prd_price']),
        ]);
    }

    // ✅ Konfirmasi hutang
    public function confirmDebt(Request $request, $tsnId)
    {
        $data = $request->validate([
            'deb_csm_id' => 'required|exists:customers,csm_id',
            'deb_due_date' => 'nullable|date',
        ]);

        $transaction = Transaction::findOrFail($tsnId);
        $remaining = $transaction->tsn_total - $transaction->tsn_paid;

        if ($remaining <= 0) {
            return redirect()->route('transactions.index')->with('flash', [
                'error' => 'Tidak ada sisa hutang untuk transaksi ini.'
            ]);
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

            $transaction->update(['tsn_csm_id' => $data['deb_csm_id']]);
            DB::commit();

            return redirect()->route('transactions.index')->with('flash', [
                'success' => 'Debt berhasil dibuat.',
                'debt' => $debt
            ]);
        } catch (Throwable $e) {
            DB::rollBack();
            return redirect()->route('transactions.index')->with('flash', [
                'error' => 'Gagal membuat debt: ' . $e->getMessage()
            ]);
        }
    }

    // ✅ Hapus transaksi
    public function destroy($tsnId)
    {
        $transaction = Transaction::findOrFail($tsnId);

        if ($transaction->debt()->exists()) {
            return redirect()->route('transactions.index')->with('flash', [
                'error' => 'Transaksi memiliki debt, tidak bisa dihapus.'
            ]);
        }

        $transaction->delete();

        return redirect()->route('transactions.index')->with('flash', [
            'success' => 'Transaksi berhasil dihapus.'
        ]);
    }

    // ✅ Detail transaksi
    public function show($tsnId)
    {
        $transaction = Transaction::with(['user', 'customer', 'details.product', 'debt'])
            ->findOrFail($tsnId);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction
        ]);
    }
}
