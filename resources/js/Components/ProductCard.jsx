import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function ProductCard({ product, index }) {
    const alternateStyle =
        index % 2 === 0
            ? "shadow-[0_4px_12px_rgba(0,0,0,0.15)] bg-white"
            : "shadow-[0_6px_16px_rgba(0,0,0,0.20)] bg-sky-50";

    const [showDesc, setShowDesc] = useState(false);

    const handleDelete = () => {
        if (confirm("Yakin ingin menghapus produk ini?")) {
            router.delete(route("products.destroy", { product: product.prd_id }));
        }
    };

    const handleEdit = () => {
        router.get(route("products.edit", { product: product.prd_id }));
    };

    return (
        <>
            {/* CARD */}
            <div className="bg-white rounded-lg shadow p-5 w-full max-w-[260px] flex flex-col items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.12)] ">
                <div className="w-full h-[160px] relative bg-white rounded-md mb-4 overflow-hidden shadow-md flex items-center justify-center">

                    {product.prd_img ? (
                        <img
                            src={`/storage/${product.prd_img}`}
                            alt={product.prd_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 font-medium absolute shadow-[inset_0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center">
                            No Image
                        </span>
                    )}

                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_8px_20px_rgba(0,0,0,0.25)]"></div>

                </div>

                <div className="justify-end text-left text-lg font-semibold mb-auto w-full h-max">
                    {product.prd_name}
                </div>

                <div className="mt-2 justify-end content-between w-full text-left">
                    <div className="my-auto"></div>
                    <div className="mt-auto flex flex-row">
                        <div className="flex flex-col">
                            <div className="font-medium">Harga</div>
                            <div className="font-medium">Stok</div>
                        </div>
                        <div className="ms-2 flex flex-col">
                            <div className="font-medium">:</div>
                            <div className="font-medium">:</div>
                        </div>
                        <div className="ms-2 flex flex-col">
                            <div className="font-medium">
                                Rp. {Number(product.prd_price).toLocaleString()}
                            </div>
                            <div className="font-medium">{product.prd_stock}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4"></div>

                <div className="flex flex-row w-full max-w-[230px] gap-3 mt-auto overflow-hidden justify-between">
                    {/* SHOW POPUP */}
                    <button
                        onClick={() => setShowDesc(true)}
                        className="w-full flex justify-center px-2 py-1 bg-sky-500 text-white rounded text-center"
                    >
                        {/* SVG TIDAK DIUBAH */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </button>

                    {/* EDIT */}
                    <button
                        onClick={handleEdit}
                        className="w-full flex justify-center px-2 py-1 bg-yellow-500 text-white rounded text-center"
                    >
                        {/* SVG TIDAK DIUBAH */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </button>

                    {/* DELETE */}
                    <button
                        onClick={handleDelete}
                        className="w-full flex justify-center px-2 py-1 bg-red-500 text-white rounded text-center"
                    >
                        {/* SVG TIDAK DIUBAH */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* POPUP MODAL */}
            {showDesc && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[300px] rounded-xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">

                        <h2 className="text-lg font-semibold mb-2">{product.prd_name}</h2>

                        <p className="text-gray-700 text-sm mb-3">{product.prd_description}</p>

                        <div className="text-xs text-gray-600 mt-2 border-t pt-2">
                            <div>Ditambahkan: {new Date(product.created_at).toLocaleString()}</div>
                            <div>Diubah: {new Date(product.updated_at).toLocaleString()}</div>
                        </div>

                        <button
                            onClick={() => setShowDesc(false)}
                            className="mt-4 w-full bg-sky-500 text-white rounded py-1"
                        >
                            Tutup
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}
