import React, { useState, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const [errorMessage, setErrorMessage] = useState("");

    const { products, customers } = usePage().props;
    const [form, setForm] = useState({
        csm_id: "", // customer ID bisa kosong
        csm_name: "", // input manual jika tidak pilih
        tsn_metode: "cash",
        tsn_paid: 0,
        details: [{ tsnd_prd_id: "", tsnd_qty: 1 }],
    });

    const [showHutang, setShowHutang] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [remainingAmount, setRemainingAmount] = useState(0);

    // Hitung total otomatis
    const totalHarga = useMemo(() => {
        return form.details.reduce((sum, d) => {
            const prd = products.find(p => p.prd_id == d.tsnd_prd_id);
            return sum + (prd ? prd.prd_price * d.tsnd_qty : 0);
        }, 0);
    }, [form.details, products]);

    const addProduct = () => {
        setForm({
            ...form,
            details: [...form.details, { tsnd_prd_id: "", tsnd_qty: 1 }],
        });
    };

    const removeProduct = (i) => {
        setForm({
            ...form,
            details: form.details.filter((_, idx) => idx !== i),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sisa = totalHarga - form.tsn_paid;

        if (form.tsn_paid < totalHarga) {
            setRemainingAmount(sisa);
            setShowHutang(true); // tampilkan form hutang di bawah
            return;
        }

        if (form.tsn_paid >= totalHarga) {
            setShowDetail(true); // tampilkan detail konfirmasi
            return;
        }
    };




    const handleSave = () => {
        setErrorMessage(""); // reset error sebelumnya
        router.post(
            "/transactions",
            { ...form, tsn_total: totalHarga },
            {
                onSuccess: () => {
                    alert("✅ Transaksi berhasil disimpan");
                },
                onError: (errors) => {
                    console.error("❌ Error saat menyimpan transaksi:", errors);
                    setErrorMessage(
                        errors.message ||
                        "Terjadi kesalahan saat menyimpan transaksi. Periksa kembali data yang diinput."
                    );
                },
                onFinish: () => {
                    console.log("📝 Proses penyimpanan selesai (sukses atau gagal)");
                },
            }
        );
    };

    const handleSaveHutang = () => {
        setErrorMessage("");
        router.post(
            "/transactions",
            { ...form, tsn_total: totalHarga, tsn_type: "hutang" },
            {
                onSuccess: () => {
                    alert("✅ Transaksi disimpan sebagai hutang");
                },
                onError: (errors) => {
                    console.error("❌ Error saat menyimpan hutang:", errors);
                    setErrorMessage(
                        errors.message ||
                        "Terjadi kesalahan saat menyimpan data hutang. Silakan cek kembali input atau server."
                    );
                },
            }
        );
    };

    return (
        <AuthenticatedLayout>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Add Transaction</h1>

                {/* FORM TRANSAKSI */}
                <form onSubmit={handleSubmit}>
                    {/* CUSTOMER */}
                    <div className="mb-3">
                        <label className="block font-semibold">Customer</label>
                        <div className="flex gap-2">
                            <select
                                value={form.csm_id}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        csm_id: e.target.value,
                                        csm_name: "",
                                    })
                                }
                                className="border rounded p-2 flex-1"
                            >
                                <option value="">Tanpa Customer</option>
                                {customers?.map((c) => (
                                    <option key={c.csm_id} value={c.csm_id}>
                                        {c.csm_name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Atau ketik nama customer"
                                value={form.csm_name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        csm_name: e.target.value,
                                        csm_id: "",
                                    })
                                }
                                className="border rounded p-2 flex-1"
                            />
                        </div>
                    </div>

                    {/* METODE */}
                    <div className="mb-3">
                        <label className="block font-semibold">Payment Method</label>
                        <select
                            value={form.tsn_metode}
                            onChange={(e) =>
                                setForm({ ...form, tsn_metode: e.target.value })
                            }
                            className="w-full border rounded p-2"
                        >
                            <option value="cash">Cash</option>
                            <option value="credit">Credit</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>

                    {/* PRODUK */}
                    <h2 className="text-lg font-semibold mb-2">Products</h2>
                    {form.details.map((d, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                            <select
                                value={d.tsnd_prd_id}
                                onChange={(e) => {
                                    const newDetails = [...form.details];
                                    newDetails[i].tsnd_prd_id = e.target.value;
                                    setForm({ ...form, details: newDetails });
                                }}
                                className="border rounded p-2 flex-1"
                                required
                            >
                                <option value="">Pilih Produk</option>
                                {products.map((p) => (
                                    <option key={p.prd_id} value={p.prd_id}>
                                        {p.prd_name} - Rp{" "}
                                        {p.prd_price.toLocaleString("id-ID")}
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
                                className="w-20 border rounded p-2"
                            />
                            {form.details.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeProduct(i)}
                                    className="px-2 bg-red-500 text-white rounded"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addProduct}
                        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        + Add Product
                    </button>

                    {/* TOTAL DAN BAYAR */}
                    <div className="flex justify-between items-center border-t pt-3 mt-3">
                        <div>
                            <span className="font-bold">Total:</span> Rp{" "}
                            {totalHarga.toLocaleString("id-ID")}
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="font-semibold">Paid:</label>
                            <input
                                type="number"
                                className="w-32 border rounded p-2 text-right"
                                value={form.tsn_paid === 0 ? "" : form.tsn_paid}
                                onFocus={(e) => {
                                    e.target.select();
                                    if (form.tsn_paid === 0)
                                        setForm({ ...form, tsn_paid: "" });
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === "" || isNaN(e.target.value)) {
                                        setForm({ ...form, tsn_paid: 0 });
                                    }
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                        setForm({ ...form, tsn_paid: "" });
                                        return;
                                    }
                                    const num = parseFloat(val);
                                    if (!isNaN(num)) {
                                        setForm({ ...form, tsn_paid: num });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Simpan / Lanjut
                    </button>
                    {errorMessage && (
                        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                </form>

                {/* === FORM HUTANG (jika uang kurang) === */}
                {showHutang && (
                    <div className="mt-6 p-4 border-t border-gray-300">
                        <h3 className="font-semibold text-red-600 mb-2">
                            Uang kurang Rp {remainingAmount.toLocaleString("id-ID")}
                        </h3>
                        <p className="mb-3">Simpan transaksi ini sebagai hutang?</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowHutang(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveHutang}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Ya, Simpan Hutang
                            </button>
                        </div>
                    </div>
                )}

                {/* === DETAIL KONFIRMASI (jika uang lebih) === */}
                {showDetail && (
                    <div className="mt-6 p-4 border-t border-gray-300 bg-gray-50 rounded">
                        <h3 className="font-semibold text-green-700 mb-2">
                            Konfirmasi Transaksi
                        </h3>
                        <p>Customer: {form.csm_name || "Tanpa nama"}</p>
                        <p>Metode: {form.tsn_metode}</p>
                        <p>Total: Rp {totalHarga.toLocaleString("id-ID")}</p>
                        <p>Dibayar: Rp {form.tsn_paid.toLocaleString("id-ID")}</p>
                        <p>
                            Kembalian: Rp{" "}
                            {(form.tsn_paid - totalHarga).toLocaleString("id-ID")}
                        </p>

                        <h4 className="mt-3 font-semibold">Produk:</h4>
                        <ul className="list-disc ml-5">
                            {form.details.map((d, i) => {
                                const prd = products.find(p => p.prd_id == d.tsnd_prd_id);
                                return (
                                    <li key={i}>
                                        {prd ? prd.prd_name : "Produk dihapus"} (
                                        {d.tsnd_qty})
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowDetail(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Simpan Transaksi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
