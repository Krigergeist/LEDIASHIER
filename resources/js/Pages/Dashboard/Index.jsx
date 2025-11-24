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
                    <div className="flex flex-row gap-4">
                        <Link
                            href={route("transactions.create")}
                            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            + Transaksi Baru
                        </Link>
                        <Link
                            href={route("products.create")}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            + Tambah Produk
                        </Link>
                        <Link
                            href={route("reports.index")}
                            className="w-full flex flex-row items-center bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 me-4 text-white">
                                <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z" clipRule="evenodd" />
                                <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                            </svg> Laporan Penjualan
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
                                <th className="p-2 text-left">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboard.transaksiTerbaru.length > 0 ? (
                                dashboard.transaksiTerbaru.map((t) => (
                                    <tr key={t.tsn_id} className="border-t">
                                        <td className="p-2">{t.tsn_date}</td>
                                        <td className="p-2">{t.tsn_metode}</td>
                                        <td className="p-2">Rp {t.tsn_total.toLocaleString()}</td>
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
