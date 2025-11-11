import React, { useState, useMemo } from "react";
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

    // hitung total otomatis
    const totalHarga = useMemo(() => {
        return form.details.reduce((sum, d) => {
            const prd = products.find(p => p.prd_id == d.tsnd_prd_id);
            return sum + (prd ? prd.prd_price * d.tsnd_qty : 0);
        }, 0);
    }, [form.details, products]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const remaining = totalHarga - form.tsn_paid;

        if (remaining > 0) {
            setShowDebt(true);
        } else {
            handleSave("normal", 0);
        }
    };

    const handleSave = (type = "normal", remaining = 0) => {
        setErrorMessage("");
        router.post(
            "/transactions",
            {
                ...form,
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
            <div className="bg-white p-6 rounded shadow">
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
                            className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                        >
                            <option value="cash">Cash</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>

                    {/* PRODUK */}
                    <h2 className="font-semibold mb-2">Daftar Produk</h2>
                    {form.details.map((d, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                            <select
                                value={d.tsnd_prd_id}
                                onChange={(e) => {
                                    const newDetails = [...form.details];
                                    newDetails[i].tsnd_prd_id = e.target.value;
                                    setForm({ ...form, details: newDetails });
                                }}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none"
                                required
                            >
                                <option value="">Pilih Produk</option>
                                {products.map((p) => (
                                    <option key={p.prd_id} value={p.prd_id}>
                                        {p.prd_name} - Rp {p.prd_price.toLocaleString("id-ID")}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="1"
                                value={d.tsnd_qty}
                                onChange={(e) => {
                                    const newDetails = [...form.details];
                                    newDetails[i].tsnd_qty = parseInt(e.target.value);
                                    setForm({ ...form, details: newDetails });
                                }}
                                className="w-24 rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none"
                            />

                            {form.details.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(i)}
                                    className="px-2 bg-red-500 text-white rounded"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="mb-4 px-3 py-2 bg-blue-500 text-white rounded"
                    >
                        + Tambah Produk
                    </button>

                    {/* TOTAL & BAYAR */}
                    <div className="border-t pt-3 mt-3 flex justify-between items-center">
                        <div>
                            <strong>Total:</strong> Rp {totalHarga.toLocaleString("id-ID")}
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">Bayar:</label>
                            <input
                                type="number"
                                className="w-32 rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                value={form.tsn_paid || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tsn_paid: parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Simpan
                    </button>

                    {errorMessage && (
                        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">
                            ⚠️ {errorMessage}
                        </div>
                    )}
                </form>

                {/* FORM DEBT & CUSTOMER */}
                {showDebt && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-red-600 font-bold mb-3">
                            Uang kurang Rp {(totalHarga - form.tsn_paid).toLocaleString("id-ID")}
                        </h3>

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
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 mb-2 focus:ring-0 border-none col-span-2"
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
                                    handleSave("hutang", totalHarga - form.tsn_paid)
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Simpan Sebagai Hutang
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
