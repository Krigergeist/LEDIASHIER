import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit() {
    const { auth, product } = usePage().props;

    const [form, setForm] = useState({
        prd_name: product.prd_name || "",
        prd_price: product.prd_price || "",
        prd_stock: product.prd_stock || "",
        prd_description: product.prd_description || "",
        prd_img: null,
    });

    const [preview, setPreview] = useState(
        product.prd_img ? `/storage/${product.prd_img}` : null
    );

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

    const MAX_PRICE = 999999999;

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
                                    min={0}
                                    max={MAX_PRICE}
                                    type="number"
                                    value={form.prd_price}
                                    onChange={(e) => {
                                        let val = Number(e.target.value);

                                        if (val > MAX_PRICE) val = MAX_PRICE;
                                        if (val < 0) val = 0;

                                        setForm({ ...form, prd_price: val });
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block font-semibold">Stok</label>
                                <input
                                    min={0}
                                    max={MAX_PRICE}
                                    type="number"
                                    value={form.prd_stock}
                                    onChange={(e) => {
                                        let val = Number(e.target.value);

                                        if (val > MAX_PRICE) val = MAX_PRICE;
                                        if (val < 0) val = 0;

                                        setForm({ ...form, prd_stock: val });
                                    }}
                                    onFocus={(e) => e.target.select()}
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
                            <label className="block font-semibold mb-2">Gambar Produk</label>

                            <div
                                className="w-48 h-48 bg-[#E8F0FE] rounded-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] 
        relative flex items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: preview ? `url('${preview}')` : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="absolute inset-0 bg-black/10 shadow-[inset_0_8px_20px_rgba(0,0,0,0.25)]"></div>

                                {!preview && (
                                    <span className="absolute inset-0 flex items-center justify-center 
                             text-gray-600 font-medium z-10">
                                        Belum ada gambar
                                    </span>
                                )}

                                <label
                                    htmlFor="prd_img"
                                    className="absolute z-20 cursor-pointer bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-white hover:scale-105 transition"
                                >
                                    Pilih Gambar
                                </label>

                                <input
                                    id="prd_img"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setForm({ ...form, prd_img: file });

                                        if (file) {
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>
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
