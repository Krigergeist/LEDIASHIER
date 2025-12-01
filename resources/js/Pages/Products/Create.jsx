import React, { useState } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create() {
    const { auth } = usePage().props;

    const { data, setData, post, errors, processing } = useForm({
        prd_name: "",
        prd_price: "",
        prd_stock: "",
        prd_description: "",
        prd_img: null,
    });


    const [preview, setPreview] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"));
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
            header={<p className="font-semibold text-xl text-gray-800 leading-tight">Tambah Produk</p>}
        >
            <Head title="Tambah Produk" />

            <div className="p-6 flex flex-col">
                <div className="p-[20px] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                    <h1 className="text-xl font-bold mb-4">Tambah Produk</h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-semibold">Nama Produk</label>
                            <input
                                type="text"
                                value={data.prd_name}
                                onChange={(e) => setData("prd_name", e.target.value)}
                                className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                            />

                            {errors.prd_name && (
                                <p className="text-red-600 text-sm mt-1">{errors.prd_name}</p>
                            )}
                        </div>


                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block font-semibold">Harga</label>
                                <input
                                    type="number"
                                    value={data.prd_price}
                                    onChange={(e) => setData("prd_price", e.target.value)}
                                    className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                                /></div>
                            {errors.prd_price && (
                                <p className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]">{errors.prd_price}</p>
                            )}

                            <div className="w-1/2">
                                <label className="block font-semibold">Stok</label>
                                <input
                                    type="number"
                                    value={data.prd_stock}
                                    onChange={(e) => setData("prd_stock", e.target.value)}
                                    className="w-full bg-[#E8F0FE] p-3 rounded-lg border-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-semibold">Deskripsi</label>
                            <textarea
                                type="text"
                                value={data.prd_description}
                                onChange={(e) =>
                                    setData("prd_description", e.target.value)
                                }
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
                                    <span className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium z-10">
                                        Belum ada gambar
                                    </span>
                                )}

                                <label
                                    htmlFor="prd_img"
                                    className="absolute z-20 cursor-pointer bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg 
                                    text-sm font-semibold shadow-md hover:bg-white hover:scale-105 transition"
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
                                        setData("prd_img", file);
                                        if (file) setPreview(URL.createObjectURL(file));
                                    }}
                                />
                                {errors.prd_img && (
                                    <p className="text-red-600 text-sm mt-1">{errors.prd_img}</p>
                                )}
                            </div>
                        </div>




                        <div className="mt-6">
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
                                Simpan Produk
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
