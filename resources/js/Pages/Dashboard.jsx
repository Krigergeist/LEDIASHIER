import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Dashboard() {
    const { dashboard, auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="p-6 space-y-6">

                {/* Ringkasan Cepat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-2xl shadow">
                        <p className="text-gray-500">Total Penjualan Hari Ini</p>
                        <h2 className="text-2xl font-bold text-green-600">
                            Rp {dashboard.totalPenjualanHariIni.toLocaleString()}
                        </h2>
                    </div>

                    <div className="p-4 bg-white rounded-2xl shadow">
                        <p className="text-gray-500">Total Transaksi Hari Ini</p>
                        <h2 className="text-2xl font-bold text-blue-600">
                            {dashboard.totalTransaksiHariIni}
                        </h2>
                    </div>

                    <div className="p-4 bg-white rounded-2xl shadow">
                        <p className="text-gray-500">Rata-Rata Transaksi</p>
                        <h2 className="text-2xl font-bold text-purple-600">
                            Rp {dashboard.rataRataTransaksi.toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Opsi Cepat */}
                <div className="bg-white rounded-2xl shadow p-4">
                    <h3 className="font-semibold mb-3">Opsi Cepat</h3>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href={route("transactions.create")}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            + Transaksi Baru
                        </Link>
                        <Link
                            href={route("products.create")}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            + Tambah Produk
                        </Link>
                        <Link
                            href={route("reports.index")}
                            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                        >
                            📊 Laporan Penjualan
                        </Link>
                    </div>
                </div>

                {/* Produk Terlaris & Stok Hampir Habis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Produk Terlaris */}
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h3 className="font-semibold mb-3">Produk Terlaris Hari Ini</h3>
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">Produk</th>
                                    <th className="p-2 text-right">Terjual</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.produkTerlaris.length > 0 ? (
                                    dashboard.produkTerlaris.map((p, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="p-2">{p.prd_name}</td>
                                            <td className="p-2 text-right">{p.terjual}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="2" className="text-center text-gray-500 p-2">Belum ada penjualan hari ini</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Stok Hampir Habis */}
                    <div className="bg-white p-4 rounded-2xl shadow">
                        <h3 className="font-semibold mb-3 text-red-600">⚠️ Stok Hampir Habis</h3>
                        <ul className="text-sm space-y-1">
                            {dashboard.stokHampirHabis.length > 0 ? (
                                dashboard.stokHampirHabis.map((p) => (
                                    <li key={p.prd_id}>
                                        {p.prd_name} — <span className="text-red-500 font-semibold">{p.prd_stock} stok</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500">Semua stok aman ✅</li>
                            )}
                        </ul>

                        {/* Notifikasi tambahan */}
                        {dashboard.notifikasiPenting?.length > 0 && (
                            <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-300">
                                <h4 className="font-semibold text-yellow-700 mb-1">🔔 Notifikasi Penting</h4>
                                <ul className="text-sm list-disc list-inside text-yellow-800">
                                    {dashboard.notifikasiPenting.map((n, i) => (
                                        <li key={i}>{n}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transaksi Terbaru */}
                <div className="bg-white p-4 rounded-2xl shadow">
                    <h3 className="font-semibold mb-3">Transaksi Terbaru</h3>
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Tanggal</th>
                                <th className="p-2 text-left">Metode</th>
                                <th className="p-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.transaksiTerbaru.length > 0 ? (
                                dashboard.transaksiTerbaru.map((t) => (
                                    <tr key={t.tsn_id} className="border-t">
                                        <td className="p-2">{t.tsn_date}</td>
                                        <td className="p-2">{t.tsn_metode}</td>
                                        <td className="p-2 text-right">Rp {t.tsn_total.toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="text-center text-gray-500 p-2">Belum ada transaksi</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
