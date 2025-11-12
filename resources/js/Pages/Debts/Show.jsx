import React from "react";
import { usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show() {
    const { debt, auth } = usePage().props;

    const handleBack = () => {
        if (auth) {
            window.history.back();
        } else {
            window.location.href = route('welcome');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<p className="flex flex-auto font-semibold w-max text-xl text-gray-800 leading-tight">Hutang</p>}
        >
            <div className="p-6">
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
                    <h1 className="text-xl font-bold mb-4">Detail Hutang</h1>

                    <div className="space-y-2">
                        <p><b>Nama Debitur:</b> {debt.customer?.csm_name}</p>
                        <p><b>No. Telepon:</b> {debt.customer?.csm_phone || "-"}</p>
                        <p><b>Alamat:</b> {debt.customer?.csm_address || "-"}</p>
                        <p><b>Total Hutang:</b> Rp {debt.deb_amount?.toLocaleString("id-ID")}</p>
                        <p><b>Hutang Dibayar:</b> Rp {debt.deb_paid_amount?.toLocaleString("id-ID")}</p>
                        <p><b>Tenggat Waktu:</b> {debt.deb_due_date}</p>
                        <p><b>Status:</b> {debt.deb_status}</p>
                    </div>

                    <div className="flex">
                        <button
                            onClick={handleBack}
                            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition me-4 mt-6"
                        >
                            Kembali
                        </button>


                        <Link
                            href={`/debts/${debt.deb_id}/edit`}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-6"
                        >
                            Edit Data
                        </Link>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
