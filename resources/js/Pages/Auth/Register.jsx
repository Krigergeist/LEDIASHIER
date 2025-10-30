import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="flex w-full">
                <div className="hidden md:flex max-w-lg flex-col justify-center items-start w-1/2 bg-sky-500 p-12 rounded-lg">
                    <div>
                        <Link href="/">
                            <h1 className="w-full text-4xl font-bold text-gray-800 text-center mb-4 text-white">
                                Lediashier
                            </h1>
                            <p className="text-medium text-center mb-6 text-white">
                                Solusi kasir modern untuk mengelola transaksi dengan cepat, akurat, dan aman.
                            </p>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex flex-col max-w-lg justify-center p-8 md:p-12">
                    <Link
                        href="/"
                        className="mb-4 text-m font-bold text-gray-600 underline hover:text-gray-800"
                    >
                        &larr; Kembali
                    </Link>

                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">
                        Daftar Akun Baru
                    </h2>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan nama lengkap"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan email"
                                required
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Masukkan password"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full rounded-lg bg-[#E8F0FE] placeholder-[#6F6F6F] shadow-[inset_0_4px_12px_rgba(0,0,0,0.12)] p-3 focus:ring-0 border-none"
                                placeholder="Ulangi password"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <PrimaryButton
                            className="w-full bg-sky-500 hover:bg-sky-600 transition text-white py-2 rounded-lg"
                            disabled={processing}
                        >
                            Register
                        </PrimaryButton>
                    </form>

                    <p className="text-center text-gray-600 mt-6 md:text-left">
                        Sudah punya akun?{' '}
                        <Link href={route('login')} className="text-blue-600 hover:underline">
                            Login sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
