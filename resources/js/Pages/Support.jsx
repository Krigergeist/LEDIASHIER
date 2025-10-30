import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Support({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        message: '',
    });

    const [success, setSuccess] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('support.send'), {
            onSuccess: () => setSuccess('Pesan berhasil dikirim!'),
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
        <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
            <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Bantuan</h2>

                <button
                    onClick={handleBack}
                    className="mb-4 text-m font-bold text-gray-600 underline hover:text-gray-800"
                >
                    &larr; Kembali
                </button>

                {success && (
                    <div className="bg-green-100 text-green-800 p-2 rounded mb-3 text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 outline-none">
                    <div>
                        <label className="block mb-1 font-semibold">Nama</label>
                        <input
                            type="text"
                            className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                            placeholder='Masukan nama anda'
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                            placeholder='Masukan email anda'
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Pesan</label>
                        <textarea
                            className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                            placeholder='Masukan pesan anda disini...'
                            rows="5"
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                        />
                        {errors.message && <p className="text-red-600 text-sm">{errors.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                </form>
            </div>
        </div>
    );
}
