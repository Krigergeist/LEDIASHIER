import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export default function ProductForm({ editing, onClose }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        prd_code: editing?.prd_code || '',
        prd_name: editing?.prd_name || '',
        prd_price: editing?.prd_price || 0,
        prd_stock: editing?.prd_stock || 0,
        prd_description: editing?.prd_description || '',
        prd_img: null,
    });

    useEffect(() => {
        if (editing) {
            setData({
                prd_code: editing.prd_code,
                prd_name: editing.prd_name,
                prd_price: editing.prd_price,
                prd_stock: editing.prd_stock,
                prd_description: editing.prd_description,
                prd_img: null,
            });
        } else {
            reset();
        }
    }, [editing]);

    function validateForm() {
        const required = ['prd_code', 'prd_name', 'prd_price', 'prd_stock'];
        for (let field of required) {
            if (!data[field] || data[field] === '' || data[field] === null) {
                alert('⚠️ Harap isi semua data penting sebelum menyimpan!');
                return false;
            }
        }
        if (data.prd_price < 0 || data.prd_stock < 0) {
            alert('⚠️ Nilai harga dan stok tidak boleh negatif!');
            return false;
        }
        return true;
    }

    function submit(e) {
        e.preventDefault();

        if (!validateForm()) return;

        const confirmMsg = editing
            ? 'Apakah Anda yakin ingin menyimpan perubahan pada produk ini?'
            : 'Apakah Anda yakin ingin menambahkan produk baru ini?';

        if (!confirm(confirmMsg)) return;

        if (editing) {
            put(route('products.update', editing.id), { onSuccess: onClose });
        } else {
            post(route('products.store'), { onSuccess: onClose });
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <form
                onSubmit={submit}
                className="relative bg-white p-6 rounded shadow w-[680px] max-w-full"
            >
                <h3 className="text-xl mb-4 font-semibold text-gray-800">
                    {editing ? 'Edit Produk' : 'Tambah Produk'}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium">Kode</label>
                        <input
                            value={data.prd_code}
                            onChange={(e) => setData('prd_code', e.target.value)}
                            className="w-full border p-2 rounded focus:outline-sky-400"
                        />
                        {errors.prd_code && (
                            <div className="text-sm text-red-600">{errors.prd_code}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nama</label>
                        <input
                            value={data.prd_name}
                            onChange={(e) => setData('prd_name', e.target.value)}
                            className="w-full border p-2 rounded focus:outline-sky-400"
                        />
                        {errors.prd_name && (
                            <div className="text-sm text-red-600">{errors.prd_name}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Harga</label>
                        <input
                            type="number"
                            value={data.prd_price}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setData('prd_price', e.target.value)}
                            className="w-full border p-2 rounded focus:outline-sky-400"
                        />
                        {errors.prd_price && (
                            <div className="text-sm text-red-600">{errors.prd_price}</div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Stok</label>
                        <input
                            type="number"
                            value={data.prd_stock}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setData('prd_stock', e.target.value)}
                            className="w-full border p-2 rounded focus:outline-sky-400"
                        />
                        {errors.prd_stock && (
                            <div className="text-sm text-red-600">{errors.prd_stock}</div>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Deskripsi</label>
                        <textarea
                            value={data.prd_description}
                            onChange={(e) => setData('prd_description', e.target.value)}
                            className="w-full border p-2 rounded focus:outline-sky-400"
                            rows={4}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium">Gambar</label>
                        <input
                            type="file"
                            onChange={(e) => setData('prd_img', e.target.files[0])}
                            className="w-full"
                        />
                        {errors.prd_img && (
                            <div className="text-sm text-red-600">{errors.prd_img}</div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Apakah Anda yakin ingin membatalkan perubahan?')) {
                                onClose();
                            }
                        }}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
}
