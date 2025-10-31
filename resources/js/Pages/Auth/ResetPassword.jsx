import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const [passwordMismatch, setPasswordMismatch] = useState('');

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        if (data.password !== data.password_confirmation) {
            setPasswordMismatch('Password dan konfirmasi password tidak sama.');
            return;
        }

        setPasswordMismatch('');
        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <div className="flex w-full">
                {/* Kiri */}
                <div className="hidden md:flex max-w-lg flex-col justify-center items-start w-1/2 bg-sky-500 p-12 rounded-lg">
                    <Link href="/">
                        <h1 className="w-full text-4xl font-bold text-gray-800 text-center mb-4 text-white">
                            Lediashier
                        </h1>
                        <p className="text-medium text-center mb-6 text-white">
                            Solusi kasir modern untuk mengelola transaksi dengan cepat, akurat, dan aman.
                        </p>
                    </Link>
                </div>

                {/* Kanan */}
                <div className="flex-1 flex flex-col max-w-lg justify-center p-8 md:p-12">
                    <Link
                        href="/"
                        className="mb-4 text-m font-bold text-gray-600 underline hover:text-gray-800"
                    >
                        &larr; Kembali
                    </Link>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                        Atur Ulang Password Anda
                    </h2>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div>
                            <InputLabel htmlFor="password" value="Password Baru" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan password baru"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Konfirmasi Password */}
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Ulangi password baru"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                            {passwordMismatch && (
                                <div className="text-red-600 text-sm font-medium mt-2">
                                    ! {passwordMismatch}
                                </div>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full bg-sky-500 hover:bg-sky-600 transition text-white py-2 rounded-lg"
                            disabled={processing}
                        >
                            Reset Password
                        </PrimaryButton>
                    </form>

                    <p className="text-center text-gray-600 mt-6 md:text-left">
                        Sudah ingat password?{' '}
                        <Link href={route('login')} className="text-blue-600 hover:underline">
                            Kembali ke login
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
