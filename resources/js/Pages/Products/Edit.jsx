import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit() {
    const { auth, product } = usePage().props;

    const [form, setForm] = useState({
        prd_name: product.prd_name || "",
        prd_code: product.prd_code || "",
        prd_price: product.prd_price || "",
        prd_stock: product.prd_stock || "",
        prd_description: product.prd_description || "",
        prd_img: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route("products.update", product.prd_id), {
            _method: "put",
            ...form,
        });
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
            header={<p className="font-semibold text-xl text-gray-800 leading-tight">Edit Produk</p>}
        >
            <Head title="Edit Produk" />

            <div className="p-6 flex flex-col">
                <div className="p-[20px] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                    <h1 className="text-xl font-bold mb-4">Edit Produk</h1>

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

                        <div className="mt-4">
                            <button
                                onClick={handleBack}
                                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition me-4 mt-6"
                            >
                                Kembali
                            </button>

                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            >
                                Update Produk
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
