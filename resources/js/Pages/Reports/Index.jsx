import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const {
        summary,
        chartData,
        produkDitambah,
        produkDihapus,
        hutangPerubahan,
        filters,
        auth,
    } = usePage().props;

    const [start, setStart] = useState(filters.start);
    const [end, setEnd] = useState(filters.end);

    const handleFilter = () => {
        router.get(route("reports.index"), { start, end }, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = route("reports.export", { start, end });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Penjualan</h2>}
        >
            <Head title="Laporan Penjualan" />

            <div className="p-6 space-y-6">

                {/* Filter Waktu */}
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <h3 className="font-semibold mb-2">Filter Waktu</h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <input
                            type="datetime-local"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="border rounded-lg p-2"
                        />
                        <input
                            type="datetime-local"
                            value={end}
                            onChange={(e) => setEnd(e.target.value)}
                            className="border rounded-lg p-2"
                        />
                        <button
                            onClick={handleFilter}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Terapkan
                        </button>
                        <button
                            onClick={handleExport}
                            className="border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100"
                        >
                            Download CSV
                        </button>
                    </div>
                </div>

                {/* Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <p className="text-gray-500">Total Transaksi</p>
                        <h2 className="text-2xl font-bold">{summary.totalTransaksi}</h2>
                    </div>

                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <p className="text-gray-500">Total Penjualan</p>
                        <h2 className="text-2xl font-bold">
                            Rp {summary.totalPenjualan?.toLocaleString()}
                        </h2>
                    </div>

                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <p className="text-gray-500">Metode Pembayaran</p>
                        <ul className="text-sm mt-2">
                            {Object.entries(summary.metodePembayaran).map(([method, count]) => (
                                <li key={method}>
                                    {method}: {count}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Grafik Penjualan */}
                <div className="p-4 border rounded-lg shadow-sm bg-white">
                    <h3 className="font-semibold mb-4">Grafik Penjualan</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <XAxis dataKey="label" />
                            <YAxis tickFormatter={(v) => `Rp ${v.toLocaleString()}`} />
                            <Tooltip formatter={(value) => [`Rp ${value.toLocaleString()}`, "Total"]} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#16a34a"
                                fill="#86efac"
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                </div>

                {/* Aktivitas Produk dan Hutang */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold mb-2">Produk Ditambahkan</h3>
                        <ul className="text-sm space-y-1">
                            {produkDitambah.map((p) => (
                                <li key={p.prd_name}>✅ {p.prd_name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold mb-2">Produk Dihapus</h3>
                        <ul className="text-sm space-y-1">
                            {produkDihapus.map((p) => (
                                <li key={p.prd_name}>❌ {p.prd_name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 border rounded-lg shadow-sm bg-white">
                        <h3 className="font-semibold mb-2">Hutang Diubah</h3>
                        <ul className="text-sm space-y-1">
                            {hutangPerubahan.map((h) => (
                                <li key={h.deb_id}>
                                    🧾 {h.csm_name} — Rp {h.deb_amount.toLocaleString()}
                                    <span className="text-xs text-gray-500">
                                        {" "}
                                        (Status: {h.deb_status})
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
