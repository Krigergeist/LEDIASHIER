import React from "react";
import { usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show() {
    const { debt } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="bg-white p-6 rounded shadow">
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

                <div className="mt-6">
                    <Link
                        href={`/debts/${debt.deb_id}/edit`}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Edit Data
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
