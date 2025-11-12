<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // Transaksi hari ini
        $transactions = DB::table('transactions')
            ->whereDate('created_at', $today)
            ->get();

        $totalPenjualan = $transactions->sum('tsn_total');
        $totalTransaksi = $transactions->count();
        $rataRata = $totalTransaksi > 0 ? $totalPenjualan / $totalTransaksi : 0;

        // Produk terlaris
        $produkTerlaris = DB::table('transaction_details')
            ->join('products', 'transaction_details.tsnd_prd_id', '=', 'products.prd_id')
            ->whereDate('transaction_details.created_at', $today)
            ->select('products.prd_name', DB::raw('SUM(transaction_details.tsnd_qty) as terjual'))
            ->groupBy('products.prd_name')
            ->orderByDesc('terjual')
            ->limit(5)
            ->get();

        // Stok hampir habis
        $stokHampirHabis = DB::table('products')
            ->where('prd_stock', '<=', 5)
            ->orderBy('prd_stock')
            ->select('prd_id', 'prd_name', 'prd_stock')
            ->get();

        // Notifikasi penting
        $notifikasi = [];
        if ($stokHampirHabis->count() > 0) {
            $notifikasi[] = "Beberapa produk hampir habis, segera restok!";
        }
        if ($totalTransaksi == 0) {
            $notifikasi[] = "Belum ada transaksi hari ini.";
        }

        // Transaksi terbaru
        $transaksiTerbaru = DB::table('transactions')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['tsn_id', 'tsn_date', 'tsn_metode', 'tsn_total']);

        return Inertia::render('Dashboard/Index', [
            'dashboard' => [
                'totalPenjualanHariIni' => $totalPenjualan,
                'totalTransaksiHariIni' => $totalTransaksi,
                'rataRataTransaksi' => $rataRata,
                'produkTerlaris' => $produkTerlaris,
                'stokHampirHabis' => $stokHampirHabis,
                'notifikasiPenting' => $notifikasi,
                'transaksiTerbaru' => $transaksiTerbaru,
            ],
        ]);
    }
}
