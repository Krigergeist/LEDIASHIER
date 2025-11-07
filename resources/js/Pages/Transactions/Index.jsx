import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { transactions, flash } = usePage().props;
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/transactions", { search }, { preserveState: true });
    };

    const handleSort = (column) => {
        const currentSort = new URLSearchParams(window.location.search).get("sort");
        const currentDir = new URLSearchParams(window.location.search).get("dir") || "asc";
        const newDir = currentSort === column && currentDir === "asc" ? "desc" : "asc";
        router.get("/transactions", { sort: column, dir: newDir, search }, { preserveState: true });
    };


    return (
        <AuthenticatedLayout title="Transactions">
            <div className="bg-white p-6 rounded shadow">
                <div className="flex justify-between mb-4">
                    <h1 className="text-xl font-bold">Transactions</h1>
                    <Link
                        href="/transactions/create"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Add Transaction
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari customer..."
                        className="border p-2 rounded w-1/3"
                    />
                    <button className="px-4 bg-green-500 text-white rounded">Cari</button>
                </form>

                {/* Flash message */}
                {flash?.success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{flash.error}</div>
                )}

                {/* Table */}
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            {[
                                ["tsn_id", "ID"],
                                ["customer.csm_name", "Customer"],
                                ["tsn_date", "Date"],
                                ["tsn_metode", "Method"],
                                [null, "Products"],
                                ["total_qty", "Qty"],
                                ["tsn_total", "Total"],
                                [null, "Actions"],
                            ].map(([col, title]) => (
                                <th
                                    key={title}
                                    className="p-2 border text-left cursor-pointer select-none"
                                    onClick={() => col && handleSort(col)}
                                >
                                    {title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.data.length > 0 ? (
                            transactions.data.map((tx) => (
                                <tr key={tx.tsn_id}>
                                    <td className="p-2 border">{tx.tsn_id}</td>
                                    <td className="p-2 border">{tx.customer?.csm_name ?? "-"}</td>
                                    <td className="p-2 border">{tx.tsn_date}</td>
                                    <td className="p-2 border">{tx.tsn_metode}</td>
                                    <td className="p-2 border">
                                        <ul className="list-disc ml-4">
                                            {tx.details.map((d) => (
                                                <li key={d.tsnd_id}>
                                                    {d.product?.prd_name ?? "Produk dihapus"} ({d.tsnd_qty})
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="p-2 border">{tx.total_qty}</td>
                                    <td className="p-2 border">
                                        Rp {parseInt(tx.tsn_total).toLocaleString("id-ID")}
                                    </td>
                                    <td className="p-2 border flex gap-2">
                                        <Link
                                            href={`/transactions/${tx.tsn_id}/edit`}
                                            className="px-2 py-1 bg-yellow-500 text-white rounded text-center"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => {
                                                if (confirm("Yakin hapus transaksi ini?")) {
                                                    router.delete(`/transactions/${tx.tsn_id}`);
                                                }
                                            }}
                                            className="px-2 py-1 bg-red-500 text-white rounded text-center"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center p-4 text-gray-400">
                                    No transactions yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-4 flex gap-2">
                    {transactions.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`px-3 py-1 border rounded ${link.active ? "bg-blue-500 text-white" : "bg-gray-100"
                                }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
