import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit() {
    const { debt, auth, flash } = usePage().props;
    const [form, setForm] = useState({
        csm_name: debt.customer?.csm_name || "",
        csm_phone: debt.customer?.csm_phone || "",
        csm_address: debt.customer?.csm_address || "",
        deb_amount: debt.deb_amount,
        deb_paid_amount: debt.deb_paid_amount,
        deb_due_date: debt.deb_due_date,
        bayar: 0,
        deb_status: debt.deb_status,
    });

    // otomatis hitung status berdasarkan input bayar
    useEffect(() => {
        const total = parseFloat(form.deb_amount);
        const sudah = parseFloat(form.deb_paid_amount);
        const bayar = parseFloat(form.bayar || 0);
        const totalDibayar = sudah + bayar;

        if (totalDibayar > total) {
            alert("Nominal pembayaran melebihi total hutang!");
            setForm({ ...form, bayar: 0 });
        } else if (totalDibayar === total) {
            setForm({ ...form, deb_status: "paid" });
        } else if (totalDibayar > 0) {
            setForm({ ...form, deb_status: "partial" });
        } else {
            setForm({ ...form, deb_status: "unpaid" });
        }
    }, [form.bayar]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/debts/${debt.deb_id}`, form);
    };

    const handleBack = () => {
        if (auth) {
            window.history.back();
        } else {
            window.location.href = route('welcome');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">
                    Edit Hutang
                </p>
            }
        >
            <div className="p-6 flex flex-col w-full">
                <div className="flex flex-col w-full bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] mx-auto">
                    <h1 className="text-xl font-bold mb-4">Edit Data Hutang</h1>

                    {flash?.error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
                            {flash.error}
                        </div>
                    )}
                    {flash?.success && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-3">
                            {flash.success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Informasi customer */}
                        <div>
                            <label className="block font-semibold">Nama Customer</label>
                            <input
                                type="text"
                                className="w-full rounded-lg bg-[#E8F0FE] p-3 shadow-inner border-none"
                                value={form.csm_name}
                                onChange={(e) =>
                                    setForm({ ...form, csm_name: e.target.value })
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block font-semibold">Total Hutang</label>
                                <input
                                    type="number"
                                    readOnly
                                    className="w-full rounded-lg bg-gray-100 p-3 border-none"
                                    value={form.deb_amount}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">Sudah Dibayar</label>
                                <input
                                    type="number"
                                    readOnly
                                    className="w-full rounded-lg bg-gray-100 p-3 border-none"
                                    value={form.deb_paid_amount}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold">Bayar Sekarang</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full rounded-lg bg-[#E8F0FE] p-3 shadow-inner border-none"
                                value={form.bayar}
                                onChange={(e) =>
                                    setForm({ ...form, bayar: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Tenggat Waktu</label>
                            <input
                                type="date"
                                className="w-full rounded-lg bg-[#E8F0FE] p-3 shadow-inner border-none"
                                value={form.deb_due_date}
                                onChange={(e) => setForm({ ...form, deb_due_date: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Status</label>
                            <input
                                type="text"
                                readOnly
                                className={`w-full rounded-lg p-3 border-none text-white ${form.deb_status === "paid"
                                    ? "bg-green-500"
                                    : form.deb_status === "partial"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                    }`}
                                value={
                                    form.deb_status === "paid"
                                        ? "Lunas"
                                        : form.deb_status === "partial"
                                            ? "Sebagian"
                                            : "Belum Lunas"
                                }
                            />
                        </div>

                        <div className="">
                            <button
                                onClick={handleBack}
                                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition me-4 mt-6"
                            >
                                Kembali
                            </button>

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
