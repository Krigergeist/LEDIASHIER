import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { auth } = usePage().props;
    const [form, setForm] = useState({
        prd_name: "",
        prd_code: "",
        prd_price: "",
        prd_stock: "",
        prd_description: "",
        prd_img: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("products.store"), form);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<p className="font-semibold text-xl text-gray-800 leading-tight">Tambah Produk</p>}
        >
            <Head title="Tambah Produk" />

            <div className="p-6 flex flex-col">
                <div className="p-[20px] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                    <h1 className="text-xl font-bold mb-4">Tambah Produk</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold">Kode Produk</label>
                            <input
                                type="text"
                                value={form.prd_code}
                                onChange={(e) => setForm({ ...form, prd_code: e.target.value })}
                                className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold">Nama Produk</label>
                            <input
                                type="text"
                                value={form.prd_name}
                                onChange={(e) => setForm({ ...form, prd_name: e.target.value })}
                                className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block font-semibold">Harga</label>
                                <input
                                    type="number"
                                    value={form.prd_price}
                                    onChange={(e) => setForm({ ...form, prd_price: e.target.value })}
                                    className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block font-semibold">Stok</label>
                                <input
                                    type="number"
                                    value={form.prd_stock}
                                    onChange={(e) => setForm({ ...form, prd_stock: e.target.value })}
                                    className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold">Deskripsi</label>
                            <textarea
                                value={form.prd_description}
                                onChange={(e) => setForm({ ...form, prd_description: e.target.value })}
                                className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block font-semibold">Gambar Produk</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setForm({ ...form, prd_img: e.target.files[0] })}
                                className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Simpan Produk
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
