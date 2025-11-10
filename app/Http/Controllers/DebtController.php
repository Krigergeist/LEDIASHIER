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
    public function index(): Response
    {
        $debts = Debt::with('customer', 'transaction')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Debts/Index', [
            'debts' => $debts,
        ]);
    }

    // 🔍 Detail hutang
    public function show($deb_id): Response
    {
        $debt = Debt::with(['customer', 'transaction'])->findOrFail($deb_id);

        return Inertia::render('Debts/Show', [
            'debt' => $debt,
        ]);
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
                'deb_amount' => 'required|numeric|min:0',
                'deb_paid_amount' => 'required|numeric|min:0',
                'deb_due_date' => 'required|date',
                'deb_status' => 'required|string|in:unpaid,paid,partial',
                'csm_name' => 'required|string|max:100',
                'csm_phone' => 'nullable|string|max:50',
                'csm_address' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            $debt = Debt::findOrFail($deb_id);
            $debt->update([
                'deb_amount' => $validated['deb_amount'],
                'deb_paid_amount' => $validated['deb_paid_amount'],
                'deb_due_date' => $validated['deb_due_date'],
                'deb_status' => $validated['deb_status'],
            ]);

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
