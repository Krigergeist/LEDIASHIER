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
                <p className="text-xl font-semibold text-gray-800">
                    Produk
                </p>
            }
        >
            <Head title="Produk" />

            <div className="p-6">
                <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)] p-6 space-y-6">

                    {/* Header & Tambah Produk */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-700">Daftar Produk</h1>

                        <Link
                            href={route("products.create")}
                            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition"
                        >
                            Tambah Produk
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full sm:w-1/2"
                    >
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari nama, kode, deskripsi..."
                            className="w-full border-none placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] px-3 py-2 rounded-l-md"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-r-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition"
                        >
                            Cari
                        </button>
                    </form>

                    <div className='bg-[#d9d9d9] h-[5px] w-full mb-6 rounded-md'></div>

                    {/* Produk Grid */}
                    <div
                        className="grid gap-5"
                        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
                    >
                        {products.data.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-6">
                                Tidak ada produk yang ditemukan.
                            </div>
                        )}

                        {products.data.map((p, idx) => (
                            <ProductCard key={p.prd_id} product={p} index={idx} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <nav className="flex flex-wrap gap-1 mt-4">
                        {products.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url || "#"}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded-lg text-sm shadow-[0_4px_12px_rgba(0,0,0,0.12)] border 
                                    ${link.active
                                        ? "bg-sky-500 text-white border-sky-500"
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                    }
                                `}
                            />
                        ))}
                    </nav>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
