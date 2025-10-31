import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '', // tetap "email" agar cocok dengan route('password.email')
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            preserveScroll: true,
            onSuccess: () => reset('email'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="flex w-full">
                {/* Bagian kiri - branding */}
                <div className="hidden md:flex max-w-lg flex-col justify-center items-start w-1/2 bg-sky-500 p-12 rounded-lg">
                    <div>
                        <Link href="/">
                            <h1 className="w-full text-4xl font-bold text-center mb-4 text-white">
                                Lediashier
                            </h1>
                            <p className="text-medium text-center mb-6 text-white">
                                Solusi kasir modern untuk mengelola transaksi dengan cepat, akurat, dan aman.
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Bagian kanan - form */}
                <div className="flex-1 flex flex-col max-w-lg justify-center p-8 md:p-12">
                    <Link
                        href={route('login')}
                        className="mb-4 text-m font-bold text-gray-600 underline hover:text-gray-800"
                    >
                        &larr; Kembali ke Login
                    </Link>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                        Lupa Password
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Lupa password? Tidak masalah. Masukkan alamat email kamu, dan kami akan mengirimkan tautan
                        untuk mereset password akunmu.
                    </p>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Alamat Email" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] 
                                shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan email kamu"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <PrimaryButton
                            className="w-full bg-sky-500 hover:bg-sky-600 transition text-white py-2 rounded-lg"
                            disabled={processing}
                        >
                            Kirim Link Reset Password
                        </PrimaryButton>
                    </form>

                    <p className="text-center text-gray-600 mt-6 md:text-left">
                        Kembali ke halaman{' '}
                        <Link href={route('login')} className="text-blue-600 hover:underline">
                            login
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
