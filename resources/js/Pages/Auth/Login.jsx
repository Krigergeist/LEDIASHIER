import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="flex w-full">
                {/* Kiri */}
                <div className="hidden md:flex max-w-lg flex-col justify-center items-start w-1/2 bg-sky-500 p-12 rounded-lg">
                    <div>
                        <Link href="/">
                            <h1 className="w-full text-4xl font-bold text-gray-800 text-center mb-4 text-white">Lediashier</h1>
                            <p className="text-medium text-center mb-6 text-white">
                                Solusi kasir modern untuk mengelola transaksi dengan cepat, akurat, dan aman.
                            </p>
                        </Link>
                    </div>

                </div>

                {/* Kanan - Form */}
                <div className="flex-1 flex flex-col max-w-lg    justify-center p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                        Login ke Akun Anda
                    </h2>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan email"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full bg-sky-500 hover:bg-sky-600 transition text-white py-2 rounded-lg"
                            disabled={processing}
                        >
                            Login
                        </PrimaryButton>
                    </form>

                    <p className="text-center text-gray-600 mt-6 md:text-left">
                        Belum punya akun?{' '}
                        <Link href={route('register')} className="text-blue-600 hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
