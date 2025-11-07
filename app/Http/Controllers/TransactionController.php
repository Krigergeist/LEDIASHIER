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

class TransactionController extends Controller
{
    // ✅ Halaman daftar transaksi
    public function index(): Response
    {
        $transactions = Transaction::with(['user', 'customer', 'details.product', 'debt'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'customers' => Customer::all(['csm_id', 'csm_name']),
            'products' => Product::all(['prd_id', 'prd_name', 'prd_price']),
            'flash' => session('flash') ?? null,
        ]);
    }

    // ✅ Halaman tambah transaksi (React)
    public function create(): Response
    {
        return Inertia::render('Transactions/Create', [
            'customers' => Customer::all(['csm_id', 'csm_name']),
            'products' => Product::all(['prd_id', 'prd_name', 'prd_price']),
        ]);
    }

    // ✅ Simpan transaksi baru
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

            // Pastikan user login tersedia
            $user = auth()->user();
            if (!$user) {
                throw new \Exception("User belum login, tidak bisa menyimpan transaksi.");
            }

            // Simpan transaksi utama
            $transaction = Transaction::create([
                'tsn_usr_id' => $user->usr_id ?? $user->id, // sesuaikan kolom di tabel users
                'csm_id' => $request->csm_id ?: null,
                'csm_name' => $request->csm_name ?: null,
                'tsn_metode' => $request->tsn_metode,
                'tsn_total' => $request->tsn_total,
                'tsn_paid' => $request->tsn_paid,
                'tsn_type' => $request->tsn_type ?? 'normal',
            ]);

            // Simpan detail produk
            foreach ($request->details as $detail) {
                $transaction->details()->create([
                    'tsnd_prd_id' => $detail['tsnd_prd_id'],
                    'tsnd_qty' => $detail['tsnd_qty'],
                ]);
            }

            return redirect()->route('transactions.index')->with('success', 'Transaksi berhasil disimpan');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Validasi gagal: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('❌ Gagal menyimpan transaksi: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all(),
            ]);
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
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
        } catch (\Throwable $e) {
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
