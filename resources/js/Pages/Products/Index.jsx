import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState } from "react";
import { Head, router, Link, usePage } from "@inertiajs/react";
import ProductCard from "@/Components/ProductCard";

export default function Index() {
    const { products, auth } = usePage().props;
    const [query, setQuery] = useState("");

    function handleSearch(e) {
        e.preventDefault();
        router.get(route("products.index"), { search: query }, { preserveState: true, replace: true });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">
                    Produk
                </p>
            }
        >
            <Head title="Produk" />

            <div className="p-6 flex flex-col">
                <div className="flex flex-col p-[20px] bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                    {/* Header dan tombol tambah */}
                    <div className="flex flex-row items-center justify-between mb-4">
                        <h1 className="text-xl font-bold">Daftar Produk</h1>

                        <Link
                            href={route("products.create")}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
                        >
                            Tambah Produk
                        </Link>
                    </div>

                    {/* Pencarian */}
                    <form onSubmit={handleSearch} className="flex w-1/2 mb-4">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari nama, kode, deskripsi..."
                            className="w-full border-none placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] px-3 py-2 rounded-l-md"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 rounded-r-md hover:bg-green-600"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="bg-[#d9d9d9] h-[5px] w-full mb-6 rounded-md"></div>

                    {/* Grid Produk */}
                    <div
                        className="grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
                    >
                        {products.data.length === 0 && (
                            <div className="p-6 bg-white rounded shadow text-gray-600">
                                Tidak ada produk.
                            </div>
                        )}

                        {products.data.map((p) => (
                            <ProductCard
                                key={p.prd_id}
                                product={p}
                            />
                        ))}

                    </div>

                    {/* Pagination */}
                    <nav className="flex flex-row gap-2 mt-5 bg-white w-fit rounded-md">
                        {products.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${link.active ? "bg-sky-500 text-white" : ""
                                    }`}
                            />
                        ))}
                    </nav>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
