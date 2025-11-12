import React, { useState } from "react";
import { router } from "@inertiajs/react";

export default function ProductCard({ product }) {
    const [showDesc, setShowDesc] = useState(false);

    const handleDelete = () => {
        if (confirm("Yakin ingin menghapus produk ini?")) {
            router.delete(route("products.destroy", { product: product.prd_id }));
        }
    };

    function handleEdit() {
        router.get(route("products.edit", { product: product.prd_id }));
    }


    return (
        <div className="bg-white rounded-lg shadow p-5 w-full max-w-[260px] flex flex-col items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            <div className="w-full h-[160px] flex flex-col items-center justify-center bg-[#E8F0FE] rounded-md mb-4 overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)]">
                {product.prd_img ? (
                    <img
                        src={`/storage/${product.prd_img}`}
                        alt={product.prd_name}
                        className="max-h-full max-w-full object-cover"
                    />
                ) : (
                    <div className="text-gray-400">No Image</div>
                )}
            </div>

            <div className="flex flex-col justify-end w-full text-left">
                <div className="text-lg font-semibold">{product.prd_name}</div>
                <div className="mt-2 flex flex-row">
                    <div className="flex flex-col">
                        <div className="font-medium">Kode</div>
                        <div className="font-medium">Harga</div>
                        <div className="font-medium">Stok</div>
                    </div>
                    <div className="ms-2 flex flex-col">
                        <div className="font-medium">:</div>
                        <div className="font-medium">:</div>
                        <div className="font-medium">:</div>
                    </div>
                    <div className="ms-2 flex flex-col">
                        <div className="font-medium">{product.prd_code}</div>
                        <div className="font-medium">
                            Rp. {Number(product.prd_price).toLocaleString()}
                        </div>
                        <div className="font-medium">{product.prd_stock}</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row w-full max-w-[230px] gap-3 mt-4 overflow-hidden">
                <button
                    onClick={() => setShowDesc(!showDesc)}
                    className="px-2 py-1 bg-sky-500 text-white rounded text-center"
                >
                    Detail
                </button>
                <button
                    onClick={handleEdit}
                    className="px-2 py-1 bg-yellow-500 text-white rounded text-center"
                >
                    Ubah
                </button>
                <button
                    onClick={handleDelete}
                    className="px-2 py-1 bg-red-500 text-white rounded text-center"
                >
                    Hapus
                </button>
            </div>

            {showDesc && (
                <div className="mt-3 text-left w-full text-sm text-gray-700 border-t pt-3">
                    {product.prd_description}
                </div>
            )}
        </div>
    );
}
