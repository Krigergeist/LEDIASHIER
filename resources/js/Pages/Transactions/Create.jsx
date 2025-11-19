import React, { useState, useMemo, useEffect } from "react";
import { router, usePage, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { products, auth } = usePage().props;

    const [form, setForm] = useState({
        csm_name: "",
        csm_nik: "",
        csm_phone: "",
        csm_address: "",
        tsn_metode: "cash",
        tsn_paid: 0,
        tsn_total: 0,
        deb_due_date: "",
        details: [{ tsnd_prd_id: "", tsnd_qty: 1 }],
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showDebt, setShowDebt] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const confirmSave = () => {
        const remaining = totalHarga - form.tsn_paid;

        if (remaining > 0) {
            setShowDebt(true);
            setShowPreview(false);
        } else {
            handleSave("normal", 0);
            setShowPreview(false);
        }
    };

    const [search, setSearch] = useState("");

    const filteredProducts = products.filter((p) =>
        p.prd_name.toLowerCase().includes((search || "").toLowerCase())
    );

    const [showSearchPopup, setShowSearchPopup] = useState(false);

    const totalHarga = useMemo(() => {
        return form.details.reduce((sum, d) => {
            const prd = products.find(p => p.prd_id == d.tsnd_prd_id);
            return sum + (prd ? prd.prd_price * d.tsnd_qty : 0);
        }, 0);
    }, [form.details, products]);

    useEffect(() => {
        const remaining = totalHarga - form.tsn_paid;

        if (remaining <= 0 && showDebt) {
            setShowDebt(false);
        }
    }, [form.tsn_paid, totalHarga]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleAddProduct = () => {
        setForm({
            ...form,
            details: [...form.details, { tsnd_prd_id: "", tsnd_qty: 1 }],
        });
    };

    const handleRemoveProduct = (i) => {
        setForm({
            ...form,
            details: form.details.filter((_, idx) => idx !== i),
        });
    };

    const hasEmptyStockProduct = form.details.some(d => {
        const p = products.find(pr => pr.prd_id === d.tsnd_prd_id);
        return p && p.prd_stock === 0;
    });



    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPreview(true);
    };

    const handleBack = () => {
        if (auth) {
            window.history.back();
        } else {
            window.location.href = route('welcome');
        }
    };


    const handleSave = (type = "normal", remaining = 0) => {
        setErrorMessage("");

        // 🔥 Hapus produk kosong sebelum kirim ke server
        const cleanDetails = form.details.filter(d => d.tsnd_prd_id);

        router.post(
            "/transactions",
            {
                ...form,
                details: cleanDetails,     // ⬅️ FIX PENTING
                tsn_total: totalHarga,
                tsn_type: type,
                remaining,
            },
            {
                onSuccess: () => {
                    alert("✅ Transaksi berhasil disimpan");
                },
                onError: (errors) => {
                    console.error("❌ Error:", errors);
                    setErrorMessage("Terjadi kesalahan saat menyimpan data.");
                },
            }
        );
    };




    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">Buat Transaksi</p>}
        >
            <Head title="Transactions" />
            <div className="p-6">
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                    <h1 className="text-xl font-bold mb-4">Buat Transaksi</h1>

                    <form onSubmit={handleSubmit}>
                        {/* METODE */}
                        <div className="mb-3">
                            <label className="font-semibold block">Metode Pembayaran</label>
                            <select
                                value={form.tsn_metode}
                                onChange={(e) =>
                                    setForm({ ...form, tsn_metode: e.target.value })
                                }
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none rounded-xl"
                            >
                                <option value="cash">Tunai</option>
                                {/* <option value="credit">Kredit</option>
                                <option value="debit">Debit</option> */}
                            </select>
                        </div>

                        {/* PRODUK */}
                        <h2 className="font-semibold mb-2">Cari Produk</h2>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value.toLowerCase())}
                                className="w-full mb-3 p-3 rounded-lg bg-[#E8F0FE] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] border-none"
                            />

                            {/* HASIL PENCARIAN SEBAGAI OVERLAY */}
                            {search && (
                                <div className="absolute left-0 right-0 top-full z-50 bg-white border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-h-48 overflow-y-auto">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.slice(0, 3).map((p) => (
                                            <div
                                                key={p.prd_id}
                                                onClick={() => {
                                                    setForm({
                                                        ...form,
                                                        details: [
                                                            ...form.details,
                                                            { tsnd_prd_id: p.prd_id, tsnd_qty: 1 },
                                                        ],
                                                    });
                                                    setSearch("");
                                                }}
                                                className="p-3 cursor-pointer hover:bg-blue-100"
                                            >
                                                {p.prd_name} — Rp {p.prd_price.toLocaleString("id-ID")}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-gray-500">Produk tidak ditemukan</div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* LIST PRODUK YANG SUDAH DIPILIH */}
                        <h2 className="font-semibold mb-2">Daftar Produk Dipilih</h2>

                        {form.details.map((d, i) => {
                            const p = products.find(p => p.prd_id === d.tsnd_prd_id);
                            if (!p) return null;

                            return (
                                <div key={i} className="flex flex-row items-center p-3 mb-2 bg-gray-50 border rounded-lg">
                                    <div className="flex-auto font-semibold">{p.prd_name}</div>

                                    {/* QTY */}

                                    <input
                                        type="number"
                                        min="1"
                                        max={p?.prd_stock ?? 1}
                                        value={d.tsnd_qty}
                                        disabled={p?.prd_stock === 0}
                                        onChange={(e) => {
                                            let value = parseInt(e.target.value);
                                            if (isNaN(value) || value < 1) value = 1;
                                            if (p?.prd_stock) value = Math.min(value, p.prd_stock);

                                            const newDetails = [...form.details];
                                            newDetails[i].tsnd_qty = value;
                                            setForm({ ...form, details: newDetails });
                                        }}
                                        onFocus={(e) => e.target.select()}
                                        className={`w-auto mx-4 rounded-lg shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] border-none ${p?.prd_stock === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#E8F0FE]'
                                            }`}
                                    />

                                    <div className="text-sm mx-4">
                                        {p?.prd_stock === 0 ? (
                                            <span className="text-red-600 font-semibold">Stok habis</span>
                                        ) : (
                                            <span className="text-black-500">Stok: {p.prd_stock}</span>
                                        )}
                                    </div>


                                    <div className="text-right font-semibold w-auto mx-4">
                                        Rp {(p.prd_price * d.tsnd_qty).toLocaleString("id-ID")}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                details: form.details.filter((_, idx) => idx !== i),
                                            })
                                        }
                                        className="bg-red-500 text-white px-2 py-1 rounded w-[40px] mx-auto"
                                    >
                                        X
                                    </button>
                                </div>
                            );
                        })}






                        {/* TOTAL & BAYAR */}
                        <div className="border-t pt-3 mt-3 flex justify-between items-center">
                            <div>
                                <strong>Total:</strong> Rp {totalHarga.toLocaleString("id-ID")}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="font-semibold">Bayar:</label>
                                <input
                                    type="number"
                                    max="9999999999999"
                                    className="w-32 rounded-lg bg-[#E8F0FE] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] border-none"
                                    value={form.tsn_paid || ""}
                                    onChange={(e) => {
                                        const bayar = Math.min(parseFloat(e.target.value) || 0, 9999999999999);

                                        if (bayar === 0 && showDebt) {
                                            setShowDebt(false);
                                        }

                                        setForm({
                                            ...form,
                                            tsn_paid: bayar,
                                        });
                                    }}

                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleBack}
                                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition me-4 mt-6"
                            >
                                Kembali
                            </button>

                            <button
                                type="submit"
                                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Simpan
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">
                                ⚠️ {errorMessage}
                            </div>
                        )}
                    </form>

                    {/* FORM DEBT & CUSTOMER */}
                    {showDebt && (
                        <div className="mt-6 border-t pt-4">
                            <h1 className="text-xl font-bold mb-4">Data Pelanggan Yang Berhutang</h1>
                            <h3 className="text-red-600 font-bold mb-3">
                                Uang kurang Rp {(totalHarga - form.tsn_paid).toLocaleString("id-ID")}
                            </h3>
                            {hasEmptyStockProduct && (
                                <p className="mb-4 text-red-600 font-medium">
                                    ⚠️ Ada produk yang stoknya sudah habis. Transaksi tidak dapat disimpan sebagai hutang.
                                </p>
                            )}


                            <h4 className="font-semibold mb-2">Data Customer</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    placeholder="Nama Customer *"
                                    value={form.csm_name}
                                    onChange={(e) => setForm({ ...form, csm_name: e.target.value })}
                                    className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none col-span-2"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="NIK"
                                    value={form.csm_nik}
                                    onChange={(e) => setForm({ ...form, csm_nik: e.target.value })}
                                    className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Nomor Telepon"
                                    value={form.csm_phone}
                                    onChange={(e) => setForm({ ...form, csm_phone: e.target.value })}
                                    className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none"
                                />
                                <textarea
                                    placeholder="Alamat"
                                    value={form.csm_address}
                                    onChange={(e) => setForm({ ...form, csm_address: e.target.value })}
                                    className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none col-span-2"
                                />
                                <input
                                    type="date"
                                    placeholder="Jatuh Tempo Hutang"
                                    value={form.deb_due_date}
                                    onChange={(e) => setForm({ ...form, deb_due_date: e.target.value })}
                                    className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none "
                                />
                            </div>

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => setShowDebt(false)}
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() =>
                                        !hasEmptyStockProduct && handleSave("hutang", totalHarga - form.tsn_paid)
                                    }
                                    disabled={hasEmptyStockProduct}
                                    className={`px-4 py-2 rounded text-white 
        ${hasEmptyStockProduct ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
                                >
                                    Simpan Sebagai Hutang
                                </button>
                            </div>
                        </div>
                    )}

                    {showPreview && (
                        <div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            onClick={() => setShowPreview(false)}
                        >
                            <div
                                className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-xl font-bold mb-4">Preview Transaksi</h2>

                                {/* Detail Produk */}
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Produk</h3>
                                    <ul className="space-y-2">
                                        {form.details
                                            .filter(d => d.tsnd_prd_id)
                                            .map((d, i) => {
                                                const p = products.find(pr => pr.prd_id == d.tsnd_prd_id);
                                                if (!p) return null;
                                                const overStock = d.tsnd_qty > p.prd_stock;
                                                return (
                                                    <li key={i} className="flex justify-between">
                                                        <span>
                                                            {p.prd_name} x {d.tsnd_qty} {overStock && `(Stok tersedia: ${p.prd_stock})`}
                                                        </span>
                                                        <span>Rp {(p.prd_price * d.tsnd_qty).toLocaleString("id-ID")}</span>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>

                                {/* Total, Bayar, Kembalian */}
                                <div className="border-t pt-3 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span>Rp {totalHarga.toLocaleString("id-ID")}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="font-semibold">Dibayar</span>
                                        <span>Rp {form.tsn_paid.toLocaleString("id-ID")}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="font-semibold">Kembalian</span>
                                        <span>
                                            {form.tsn_paid >= totalHarga
                                                ? `Rp ${(form.tsn_paid - totalHarga).toLocaleString("id-ID")}`
                                                : "Rp 0"}
                                        </span>
                                    </div>
                                </div>

                                {/* Peringatan stok */}
                                {form.details.some(d => {
                                    const p = products.find(pr => pr.prd_id == d.tsnd_prd_id);
                                    return p && d.tsnd_qty > p.prd_stock;
                                }) && (
                                        <p className="mt-3 text-red-600 font-medium">
                                            ⚠️ Beberapa produk melebihi stok yang tersedia. Silakan sesuaikan jumlah.
                                        </p>
                                    )}

                                {/* Tombol Aksi */}
                                <div className="flex justify-end gap-3 mt-5">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded"
                                    >
                                        Kembali
                                    </button>

                                    {/* Jika ada qty melebihi stok, tombol simpan disembunyikan */}
                                    {!form.details.some(d => {
                                        const p = products.find(pr => pr.prd_id == d.tsnd_prd_id);
                                        return p && d.tsnd_qty > p.prd_stock;
                                    }) && (
                                            totalHarga > form.tsn_paid ? (
                                                <button
                                                    onClick={() => {
                                                        setShowPreview(false);
                                                        setShowDebt(true);
                                                    }}
                                                    className="px-4 py-2 bg-orange-600 text-white rounded"
                                                >
                                                    Tampilkan Form Hutang
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={confirmSave}
                                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                                >
                                                    Simpan Sekarang
                                                </button>
                                            )
                                        )}
                                </div>
                            </div>
                        </div>
                    )}



                </div></div>
        </AuthenticatedLayout>
    );
}
