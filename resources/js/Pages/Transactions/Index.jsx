import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionsIndex({ customers = [], products = [] }) {
    const { flash } = usePage().props;
    const [form, setForm] = useState({
        tsn_usr_id: "",
        tsn_csm_id: "",
        tsn_metode: "cash",
        tsn_paid: "",
        details: [],
    });

    const [selectedProduct, setSelectedProduct] = useState("");
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);
    const [modal, setModal] = useState(null);
    const [responseData, setResponseData] = useState(null);

    // Tambah item ke detail transaksi
    const addDetail = () => {
        if (!selectedProduct || qty <= 0 || price <= 0) return;
        setForm({
            ...form,
            details: [
                ...form.details,
                { tsnd_prd_id: selectedProduct, tsnd_qty: qty, tsnd_price: price },
            ],
        });
        setSelectedProduct("");
        setQty(1);
        setPrice(0);
    };

    // Hapus item
    const removeDetail = (i) => {
        const newDetails = [...form.details];
        newDetails.splice(i, 1);
        setForm({ ...form, details: newDetails });
    };

    // Hitung total
    const total = form.details.reduce(
        (acc, d) => acc + d.tsnd_qty * d.tsnd_price,
        0
    );

    // Submit transaksi
    const submit = (e) => {
        e.preventDefault();
        router.post(
            "/transactions",
            { ...form, tsn_total: total },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const response = page.props.flash?.response || {};
                    if (response.requires_confirmation) {
                        setResponseData(response);
                        setModal("confirm");
                    } else {
                        setModal("success");
                    }
                },
                onError: (err) => alert("Gagal menyimpan transaksi"),
            }
        );
    };

    // Konfirmasi kasir: buat hutang
    const confirmDebt = () => {
        router.post(
            `/transactions/${responseData.transaction.tsn_id}/confirm-debt`,
            {},
            {
                onSuccess: () => {
                    setModal("success");
                },
            }
        );
    };

    // Batalkan transaksi
    const cancelTransaction = () => {
        router.delete(`/transactions/${responseData.transaction.tsn_id}`, {
            onSuccess: () => setModal(null),
        });
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Transaksi Baru</h1>

            {/* Flash Message */}
            {flash?.success && (
                <div className="p-3 mb-4 bg-green-100 text-green-700 rounded-xl">
                    {flash.success}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Customer */}
                <div>
                    <label className="block text-sm font-semibold mb-1">Customer</label>
                    <select
                        value={form.tsn_csm_id}
                        onChange={(e) => setForm({ ...form, tsn_csm_id: e.target.value })}
                        className="w-full border p-2 rounded-xl"
                    >
                        <option value="">Pilih Customer</option>
                        {customers.map((c) => (
                            <option key={c.csm_id} value={c.csm_id}>
                                {c.csm_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Produk */}
                <div className="grid grid-cols-5 gap-2 items-end">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="border p-2 rounded-xl col-span-2"
                    >
                        <option value="">Pilih Produk</option>
                        {products.map((p) => (
                            <option key={p.prd_id} value={p.prd_id}>
                                {p.prd_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(parseInt(e.target.value))}
                        className="border p-2 rounded-xl"
                        placeholder="Qty"
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="border p-2 rounded-xl"
                        placeholder="Harga"
                    />
                    <button
                        type="button"
                        onClick={addDetail}
                        className="bg-blue-600 text-white rounded-xl py-2 hover:bg-blue-700"
                    >
                        Tambah
                    </button>
                </div>

                {/* Tabel Detail */}
                <table className="w-full mt-4 border rounded-xl">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-2">Produk</th>
                            <th className="p-2">Qty</th>
                            <th className="p-2">Harga</th>
                            <th className="p-2">Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {form.details.map((d, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-2">{products.find((p) => p.prd_id == d.tsnd_prd_id)?.prd_name}</td>
                                <td className="p-2">{d.tsnd_qty}</td>
                                <td className="p-2">{d.tsnd_price.toLocaleString()}</td>
                                <td className="p-2">
                                    {(d.tsnd_qty * d.tsnd_price).toLocaleString()}
                                </td>
                                <td className="p-2">
                                    <button
                                        type="button"
                                        onClick={() => removeDetail(i)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        <tr className="font-bold border-t">
                            <td colSpan={3} className="p-2 text-right">
                                Total:
                            </td>
                            <td className="p-2">{total.toLocaleString()}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                {/* Pembayaran */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Metode</label>
                        <input
                            type="text"
                            value={form.tsn_metode}
                            onChange={(e) => setForm({ ...form, tsn_metode: e.target.value })}
                            className="border p-2 rounded-xl w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Uang Dibayar
                        </label>
                        <input
                            type="number"
                            value={form.tsn_paid}
                            onChange={(e) => setForm({ ...form, tsn_paid: e.target.value })}
                            className="border p-2 rounded-xl w-full"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                >
                    Simpan Transaksi
                </button>
            </form>

            {/* Modal Konfirmasi */}
            <AnimatePresence>
                {modal === "confirm" && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="bg-white rounded-2xl p-6 w-[400px] text-center">
                            <h2 className="text-xl font-bold mb-2">Pembayaran Kurang</h2>
                            <p className="text-gray-600 mb-4">
                                Sisa yang belum dibayar:{" "}
                                <span className="font-bold text-red-600">
                                    Rp {responseData.remaining_amount.toLocaleString()}
                                </span>
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={confirmDebt}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                                >
                                    Buat Hutang
                                </button>
                                <button
                                    onClick={cancelTransaction}
                                    className="bg-red-600 text-white px-4 py-2 rounded-xl"
                                >
                                    Batalkan
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {modal === "success" && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="bg-white rounded-2xl p-6 w-[400px] text-center">
                            <h2 className="text-xl font-bold mb-3 text-green-600">
                                Transaksi Berhasil!
                            </h2>
                            <button
                                onClick={() => setModal(null)}
                                className="bg-green-600 text-white px-4 py-2 rounded-xl"
                            >
                                Tutup
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
