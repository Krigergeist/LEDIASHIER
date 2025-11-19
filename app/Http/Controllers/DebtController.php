<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Debt;
use App\Models\Customer;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DebtController extends Controller
{
    // 📋 Halaman utama daftar hutang
    public function index(Request $request)
    {
        $query = Debt::with('customer');

        if ($request->search) {
            $query->whereHas('customer', function ($q) use ($request) {
                $q->where('csm_name', 'like', "%{$request->search}%");
            })
                ->orWhere('deb_amount', 'like', "%{$request->search}%")
                ->orWhere('deb_status', 'like', "%{$request->search}%");
        }

        $debts = $query->orderBy('deb_id', 'desc')->paginate(10);

        return inertia('Debts/Index', [
            'debts' => $debts,
            'auth' => [
                'user' => $request->user(),
            ],
        ]);
    }

    // 🔍 Detail hutang
    public function show($deb_id)
    {
        $debt = Debt::with(['customer', 'transaction'])->findOrFail($deb_id);

        return response()->json([
            'debt' => $debt
        ]);
    }

    public function popup($deb_id)
    {
        $debt = Debt::with(['customer', 'transaction'])->findOrFail($deb_id);
        return response()->json(['debt' => $debt]);
    }

    // ✏️ Halaman edit hutang
    public function edit($deb_id): Response
    {
        $debt = Debt::with('customer')->findOrFail($deb_id);

        return Inertia::render('Debts/Edit', [
            'debt' => $debt,
        ]);
    }

    // 💾 Update hutang
    public function update(Request $request, $deb_id)
    {
        try {
            $validated = $request->validate([
                'bayar' => 'nullable|numeric|min:0',
                'deb_due_date' => 'required|date',
                'csm_name' => 'required|string|max:100',
                'csm_phone' => 'nullable|string|max:50',
                'csm_address' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            $debt = Debt::findOrFail($deb_id);

            $totalHutang = $debt->deb_amount;
            $sudahBayar = $debt->deb_paid_amount;
            $bayarBaru = $request->bayar ?? 0;
            $totalDibayar = $sudahBayar + $bayarBaru;

            // Jika lebih bayar
            if ($totalDibayar > $totalHutang) {
                return back()->with('error', 'Nominal pembayaran melebihi total hutang!');
            }

            // Tentukan status otomatis
            $status = 'unpaid';
            if ($totalDibayar == $totalHutang) {
                $status = 'paid';
            } elseif ($totalDibayar > 0 && $totalDibayar < $totalHutang) {
                $status = 'partial';
            }

            // Update data hutang
            $debt->update([
                'deb_paid_amount' => $totalDibayar,
                'deb_status' => $status,
                'deb_due_date' => $validated['deb_due_date'], // tanggal baru selalu tersimpan
            ]);

            // Update data customer
            $debt->customer->update([
                'csm_name' => $validated['csm_name'],
                'csm_phone' => $validated['csm_phone'],
                'csm_address' => $validated['csm_address'],
            ]);

            DB::commit();

            return redirect()->route('debts.index')->with('success', 'Data hutang berhasil diperbarui');
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('❌ Gagal update hutang', ['message' => $e->getMessage()]);
            return back()->with('error', 'Gagal memperbarui data hutang: ' . $e->getMessage());
        }
    }
}
