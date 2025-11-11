<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $start = $request->input('start', Carbon::now()->startOfDay());
        $end = $request->input('end', Carbon::now()->endOfDay());
        $start = Carbon::parse($start);
        $end = Carbon::parse($end);

        // Transaksi
        $transactions = DB::table('transactions')
            ->select('tsn_total', 'tsn_metode', 'created_at')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $totalTransaksi = $transactions->count();
        $totalPenjualan = $transactions->sum('tsn_total');
        $metodePembayaran = $transactions->groupBy('tsn_metode')->map->count();

        // Tentukan interval waktu grafik
        $diff = $start->diffInDays($end);
        if ($diff <= 1) {
            $chartData = $transactions
                ->groupBy(fn($t) => Carbon::parse($t->created_at)->format('H:00'))
                ->map(fn($items) => $items->sum('tsn_total'))
                ->map(fn($v, $k) => ['label' => $k, 'total' => $v])
                ->values();
        } elseif ($diff <= 31) {
            $chartData = $transactions
                ->groupBy(fn($t) => Carbon::parse($t->created_at)->format('Y-m-d'))
                ->map(fn($items) => $items->sum('tsn_total'))
                ->map(fn($v, $k) => ['label' => $k, 'total' => $v])
                ->values();
        } else {
            $chartData = $transactions
                ->groupBy(fn($t) => Carbon::parse($t->created_at)->format('Y-m'))
                ->map(fn($items) => $items->sum('tsn_total'))
                ->map(fn($v, $k) => ['label' => $k, 'total' => $v])
                ->values();
        }

        // Produk & hutang
        $produkDitambah = DB::table('products')
            ->whereBetween('created_at', [$start, $end])
            ->select('prd_name', 'created_at')
            ->get();

        $produkDihapus = DB::table('products')
            ->whereNotNull('deleted_at')
            ->whereBetween('deleted_at', [$start, $end])
            ->select('prd_name', 'deleted_at')
            ->get();

        $hutangPerubahan = DB::table('debts')
            ->join('customers', 'debts.deb_csm_id', '=', 'customers.csm_id')
            ->whereBetween('debts.updated_at', [$start, $end])
            ->select(
                'debts.deb_id',
                'customers.csm_name',
                'debts.deb_amount',
                'debts.deb_paid_amount',
                'debts.deb_due_date',
                'debts.deb_status',
                'debts.updated_at'
            )
            ->get();

        return Inertia::render('Reports/Index', [
            'summary' => [
                'totalTransaksi' => $totalTransaksi,
                'totalPenjualan' => $totalPenjualan,
                'metodePembayaran' => $metodePembayaran,
            ],
            'produkDitambah' => $produkDitambah,
            'produkDihapus' => $produkDihapus,
            'hutangPerubahan' => $hutangPerubahan,
            'chartData' => $chartData,
            'filters' => [
                'start' => $start,
                'end' => $end,
            ],
        ]);
    }

    // ✅ EXPORT PDF
    public function exportPdf(Request $request)
    {
        $start = Carbon::parse($request->query('start'));
        $end = Carbon::parse($request->query('end'));

        $transactions = DB::table('transactions')
            ->select('tsn_total', 'tsn_metode', 'created_at')
            ->whereBetween('created_at', [$start, $end])
            ->get();

        $totalTransaksi = $transactions->count();
        $totalPenjualan = $transactions->sum('tsn_total');
        $metodePembayaran = $transactions->groupBy('tsn_metode')->map->count();

        $produkDitambah = DB::table('products')
            ->whereBetween('created_at', [$start, $end])
            ->select('prd_name', 'created_at')
            ->get();

        $produkDihapus = DB::table('products')
            ->whereNotNull('deleted_at')
            ->whereBetween('deleted_at', [$start, $end])
            ->select('prd_name', 'deleted_at')
            ->get();

        $hutangPerubahan = DB::table('debts')
            ->join('customers', 'debts.deb_csm_id', '=', 'customers.csm_id')
            ->whereBetween('debts.updated_at', [$start, $end])
            ->select(
                'customers.csm_name',
                'debts.deb_amount',
                'debts.deb_paid_amount',
                'debts.deb_due_date',
                'debts.deb_status'
            )
            ->get();

        $pdf = Pdf::loadView('reports.pdf', [
            'start' => $start,
            'end' => $end,
            'totalTransaksi' => $totalTransaksi,
            'totalPenjualan' => $totalPenjualan,
            'metodePembayaran' => $metodePembayaran,
            'produkDitambah' => $produkDitambah,
            'produkDihapus' => $produkDihapus,
            'hutangPerubahan' => $hutangPerubahan,
        ])->setPaper('a4', 'portrait');

        return $pdf->download('laporan_penjualan.pdf');
    }
}
