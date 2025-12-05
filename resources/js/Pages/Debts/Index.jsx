import React, { useState } from "react";
import { usePage, router, Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { debts, auth } = usePage().props;
    const [query, setQuery] = useState("");
    const [showDetail, setShowDetail] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const openDetail = async (id) => {
        const res = await fetch(route("debts.popup", id));
        const data = await res.json();

        setSelectedDebt(data.debt);
        setShowDetail(true);
    };

    function handleSearch(e) {
        e.preventDefault();
        router.get(route("debts.index"), { search: query }, { preserveState: true, replace: true });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">Hutang</p>}
        >
            <Head title="Hutang" />

            <div className="p-6 flex flex-col">
                <div className="flex flex-col p-6 bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] space-y-6">
                    {/* Header dan tombol tambah */}
                    <div className="flex flex-row items-center justify-between ">
                        <h1 className="text-xl font-bold">Daftar Hutang</h1>
                    </div>

                    {/* Pencarian */}
                    <form onSubmit={handleSearch} className="flex w-1/2 ">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari nama customer, jumlah, status..."
                            className="w-full border-none placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] px-3 py-2 rounded-l-md"
                        />
                        <button className="bg-green-500 text-white px-4 rounded-r-md">Cari</button>
                    </form>

                    <div className="bg-[#d9d9d9] h-[5px] w-full mb-6 rounded-md"></div>

                    {/* Tabel Hutang */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse rounded-lg overflow-hidden">
                            <thead className="bg-gray-200">
                                <tr className="text-left text-black">
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Nama Customer</th>
                                    <th className="p-3 border">Jumlah Hutang</th>
                                    <th className="p-3 border">Hutang Dibayar</th>
                                    <th className="p-3 border">Sisa Hutang</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Jatuh Tempo</th>
                                    <th className="p-3 border">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {debts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center p-4 text-gray-500">
                                            Tidak ada data hutang.
                                        </td>
                                    </tr>
                                ) : (
                                    debts.data.map((deb, i) => {
                                        const sisa = (deb.deb_amount || 0) - (deb.deb_paid_amount || 0);

                                        return (
                                            <tr key={deb.deb_id} className="hover:bg-gray-50">
                                                <td className="p-3 border">{i + 1}</td>
                                                <td className="p-3 border">{deb.customer?.csm_name || "-"}</td>

                                                <td className="p-3 border text-red-600 font-medium">
                                                    Rp {deb.deb_amount?.toLocaleString("id-ID")}
                                                </td>

                                                <td className="p-3 border text-green-600 font-medium">
                                                    Rp {deb.deb_paid_amount?.toLocaleString("id-ID")}
                                                </td>

                                                <td className="p-3 border text-orange-600 font-semibold">
                                                    Rp {sisa.toLocaleString("id-ID")}
                                                </td>

                                                <td
                                                    className={`p-3 border font-semibold ${deb.deb_status === "unpaid"
                                                        ? "text-red-500"
                                                        : deb.deb_status === "partial"
                                                            ? "text-yellow-500"
                                                            : "text-green-500"
                                                        }`}
                                                >
                                                    {deb.deb_status === "unpaid"
                                                        ? "Belum Lunas"
                                                        : deb.deb_status === "partial"
                                                            ? "Sebagian"
                                                            : "Lunas"}
                                                </td>

                                                <td className="p-3 border">
                                                    {new Date(deb.deb_due_date).toLocaleDateString("id-ID")}
                                                </td>

                                                <td className="p-3 border flex gap-3">
                                                    <button
                                                        onClick={() => openDetail(deb.deb_id)}
                                                        className="px-2 py-1 bg-sky-500 text-white rounded text-center"
                                                    >
                                                        Detail
                                                    </button>

                                                    <Link
                                                        href={route("debts.edit", deb.deb_id)}
                                                        className="px-2 py-1 bg-yellow-500 text-white rounded text-center"
                                                    >
                                                        Kelola
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>






                    {/* Pagination */}
                    <nav className="flex flex-row gap-2 mt-5 bg-white w-fit rounded-md">
                        {debts.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${link.active ? "bg-sky-500 text-white" : ""
                                    }`}
                            />
                        ))}
                    </nav>
                </div>

                {showDetail && selectedDebt && (
                    <div
                        className="fixed inset-0 left-0 top-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
                        onClick={() => setShowDetail(false)} // klik area gelap menutup overlay
                    >
                        <div
                            className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg relative"
                            onClick={(e) => e.stopPropagation()} // mencegah klik di dalam konten menutup overlay
                        >
                            <h1 className="text-xl font-bold mb-4">Detail Hutang</h1>

                            <div className="space-y-2">
                                <p><b>Nama Debitur:</b> {selectedDebt.customer?.csm_name}</p>
                                <p><b>No. Telepon:</b> {selectedDebt.customer?.csm_phone || "-"}</p>
                                <p><b>Alamat:</b> {selectedDebt.customer?.csm_address || "-"}</p>

                                <p><b>Total Hutang:</b> Rp {selectedDebt.deb_amount?.toLocaleString("id-ID")}</p>
                                <p><b>Sudah Dibayar:</b> Rp {selectedDebt.deb_paid_amount?.toLocaleString("id-ID")}</p>

                                <p className="text-red-600 font-semibold">
                                    <b>Sisa Hutang:</b> Rp {(
                                        selectedDebt.deb_amount - selectedDebt.deb_paid_amount
                                    ).toLocaleString("id-ID")}
                                </p>

                                <p><b>Jatuh Tempo:</b> {new Date(selectedDebt.deb_due_date).toLocaleDateString("id-ID")}</p>
                                <p><b>Status:</b> {selectedDebt.deb_status}</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowDetail(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Tutup
                                </button>

                                <Link
                                    href={`/debts/${selectedDebt.deb_id}/edit`}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                                >
                                    Kelola / Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
