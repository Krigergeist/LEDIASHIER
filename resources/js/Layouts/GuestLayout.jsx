import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">

            <div className="mt-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)] bg-white overflow-hidden sm:rounded-lg ">
                {children}
            </div>
        </div>
    );
}
