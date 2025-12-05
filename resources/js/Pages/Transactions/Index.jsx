import React, { useState } from "react";
import { Link, router, usePage, Head, } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { transactions, flash, auth } = usePage().props;
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
        <AuthenticatedLayout
            user={auth.user}
            header={<p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">Transaksi</p>}
        >
            <Head title="Transactions" />

            <div className="p-6 flex flex-col">
                <div className="flex flex-col space-y-6 bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] ">
                    <div className="flex justify-between  items-center">
                        <h1 className="text-xl font-bold">Daftar Transaksi</h1>
                        <Link
                            href="/transactions/create"
                            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition"
                        >
                            Buat Transaksi
                        </Link>
                    </div>

                    <form onSubmit={handleSearch} className="flex w-1/2 ">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari customer..."
                            className="w-full border-none placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]  hover:border-blue-500 px-3 py-2 rounded-l-md"
                        />
                        <button className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition">Cari</button>
                    </form>

                    <div className='bg-[#d9d9d9] h-[5px] w-full mb-6 rounded-md'></div>

                    {flash?.success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{flash.success}</div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{flash.error}</div>
                    )}

                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-200">
                                {[
                                    ["tsn_id", "ID"],
                                    // ["customer.csm_name", "Customer"],
                                    ["tsn_date", "Date"],
                                    ["tsn_metode", "Method"],
                                    [null, "Products"],
                                    // ["total_qty", "Qty"],
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
                                        {/* <td className="p-2 border">{tx.customer?.csm_name ?? "-"}</td> */}
                                        <td className="p-2 border">{tx.tsn_date}</td>
                                        <td className="p-2 border">{tx.tsn_metode}</td>
                                        <td className="p-2 border">
                                            <ul className="list-disc ml-4">
                                                {tx.details.map((d) => (
                                                    <li key={d.tsnd_id}>
                                                        {d.product?.prd_name || d.tsnd_product_name} ({d.tsnd_qty})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        {/* <td className="p-2 border">{tx.total_qty}</td> */}
                                        <td className="p-2 border">
                                            Rp {parseInt(tx.tsn_total).toLocaleString("id-ID")}
                                        </td>
                                        <td className="p-2 border flex gap-2">
                                            {/* <Link
                                                href={`/transactions/${tx.tsn_id}/edit`}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded text-center"
                                            >
                                                Ubah
                                            </Link> */}
                                            <button
                                                onClick={() => {
                                                    if (confirm("Yakin hapus transaksi ini?")) {
                                                        router.delete(`/transactions/${tx.tsn_id}`);
                                                    }
                                                }}
                                                className="px-2 py-1 bg-red-500 text-white rounded text-center"
                                            >
                                                Hapus
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

                    <div className="flex flex-row gap-2 mt-5 bg-white  w-fit rounded-md">
                        {transactions.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1 rounded-lg text-sm shadow-[0_4px_12px_rgba(0,0,0,0.12)] border  ${link.active ? "bg-sky-500 text-white border-sky-500" : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
