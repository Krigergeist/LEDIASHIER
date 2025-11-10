import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit() {
    const { debt } = usePage().props;
    const [form, setForm] = useState({
        csm_name: debt.customer?.csm_name || "",
        csm_phone: debt.customer?.csm_phone || "",
        csm_address: debt.customer?.csm_address || "",
        deb_amount: debt.deb_amount,
        deb_paid_amount: debt.deb_paid_amount,
        deb_due_date: debt.deb_due_date,
        deb_status: debt.deb_status,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(`/debts/${debt.deb_id}`, form);
    };

    return (
        <AuthenticatedLayout>
            <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
                <h1 className="text-xl font-bold mb-4">Edit Hutang</h1>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block font-semibold">Nama Customer</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={form.csm_name}
                            onChange={(e) => setForm({ ...form, csm_name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">No. Telepon</label>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={form.csm_phone}
                            onChange={(e) => setForm({ ...form, csm_phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Alamat</label>
                        <textarea
                            className="w-full border p-2 rounded"
                            value={form.csm_address}
                            onChange={(e) => setForm({ ...form, csm_address: e.target.value })}
                        ></textarea>
                    </div>
                    <div>
                        <label className="block font-semibold">Total Hutang</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={form.deb_amount}
                            onChange={(e) => setForm({ ...form, deb_amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Hutang Dibayar</label>
                        <input
                            type="number"
                            className="w-full border p-2 rounded"
                            value={form.deb_paid_amount}
                            onChange={(e) => setForm({ ...form, deb_paid_amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Tenggat Waktu</label>
                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={form.deb_due_date}
                            onChange={(e) => setForm({ ...form, deb_due_date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block font-semibold">Status</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={form.deb_status}
                            onChange={(e) => setForm({ ...form, deb_status: e.target.value })}
                        >
                            <option value="unpaid">Belum Lunas</option>
                            <option value="partial">Sebagian</option>
                            <option value="paid">Lunas</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
