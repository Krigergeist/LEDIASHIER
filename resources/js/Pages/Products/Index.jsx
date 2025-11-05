import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import ProductForm from '@/Components/ProductForm';



export default function Index() {
    const { products, auth } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [query, setQuery] = useState('');

    function handleSearch(e) {
        e.preventDefault();
        router.get(route('products.index'), { search: query }, { preserveState: true, replace: true });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">Products</p>}
        >
            <Head title="Products" />

            <div className="p-6 flex flex-col">


                <div className='flex flex-col p-[20px] bg-white grid  rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]'>
                    <div className="flex flex-row items-center justify-between mb-6">
                        <form onSubmit={handleSearch} className=" flex w-1/2">
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Cari nama, kode, deskripsi..."
                                className="w-full border-none placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] px-3 py-2 rounded-l-md"
                            />
                            <button className="bg-green-500 text-white px-4 rounded-r-md">Cari</button>
                        </form>

                        <div>
                            <button
                                onClick={() => { setEditing(null); setShowForm(true); }}
                                className="bg-sky-500 text-white px-4 py-2 rounded"
                            >
                                Tambah Produk
                            </button>
                        </div>
                    </div>

                    <div className='bg-[#d9d9d9] h-[5px] w-full mb-6 rounded-md'>.</div>

                    <div
                        className="grid gap-5"
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
                    >
                        {products.data.length === 0 && (
                            <div className="p-6 bg-white rounded shadow">Tidak ada produk</div>
                        )}

                        {products.data.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onEdit={() => { setEditing(p); setShowForm(true); }}
                            />
                        ))}

                    </div>
                    <nav className="flex flex-row gap-2 mt-5 bg-white  w-fit rounded-md">
                        {products.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 rounded shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${link.active ? 'bg-sky-500 text-white' : ''}`}
                            />
                        ))}
                    </nav>
                </div>



                {showForm && (
                    <ProductForm
                        onClose={() => setShowForm(false)}
                        editing={editing}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
