import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />

            {/* Background */}
            <div className="min-h-screen bg-white flex flex-col">

                {/* Navbar */}
                <nav className="w-full flex justify-between items-center px-8 py-4 bg-white bg-white drop-shadow-xl p-6 fixed top-0 left-0 z-50 rounded-lg">
                    <div className="bg-gradient-to-r from-emerald-500 to-sky-500 inline-block text-transparent bg-clip-text font-bold text-4xl font-sans">Lediashier</div>

                    <div>
                        {auth.user ? (
                            <div className='flex gap-4'>
                                <Link
                                    href={route('dashboard')}
                                    className="bg-sky-500 px-[20px] py-[15px] text-2x1 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('support')}
                                    className="bg-sky-500 px-[20px] py-[15px] text-2x1 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
                                >
                                    Bantuan
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={route('support')}
                                    className="bg-sky-500 px-[20px] py-[15px] text-2x1 text-white font-bold rounded-lg shadow hover:bg-sky-600 transition"
                                >
                                    Bantuan
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center text-center flex-grow px-6 pt-32 pb-20">
                    <h1 className="text-5xl font-extrabold mb-4 text-black">
                        Selamat Datang di Lediashier
                    </h1>
                    <p className="text-lg font-medium text-black max-w-2xl mb-8">
                        Aplikasi web kasir online untuk mencatat dan mengelola transaksi penjualan.
                    </p>

                    <div className="flex flex gap-4 items-center justify-center text-center">
                        <Link
                            href={route('register')}
                            className="text-2xl ml-6 p-[20px] text-white rounded-lg bg-sky-500 drop-shadow-lg font-bold shadow hover:bg-sky-600 transition"
                        >
                            Daftar Sekarang
                        </Link>
                        <Link
                            href={route('login')}
                            className="text-2xl ml-6 px-[77px] py-[20px] text-white rounded-lg bg-gray-400 drop-shadow-lg font-bold shadow hover:bg-gray-500 transition"
                        >
                            Masuk
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pb-6">
                    Laravel v{laravelVersion} (PHP v{phpVersion})
                </footer>
            </div>
        </>
    );
}
