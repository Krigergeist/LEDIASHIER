import React from "react";
import { usePage, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
    const { debts } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Kelola Hutang</h1>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="p-2 border">#</th>
                            <th className="p-2 border">Nama Customer</th>
                            <th className="p-2 border">Jumlah Hutang</th>
                            <th className="p-2 border">Hutang Dibayar</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debts.data.map((deb, i) => (
                            <tr key={deb.deb_id} className="border-t hover:bg-gray-50">
                                <td className="p-2 border">{i + 1}</td>
                                <td className="p-2 border">{deb.customer?.csm_name || "-"}</td>
                                <td className="p-2 border">Rp {deb.deb_amount?.toLocaleString("id-ID")}</td>
                                <td className="p-2 border">Rp {deb.deb_paid_amount?.toLocaleString("id-ID")}</td>
                                <td className="p-2 border capitalize">{deb.deb_status}</td>
                                <td className="p-2 border flex gap-2">
                                    <Link href={`/debts/${deb.deb_id}`} className="text-blue-600 hover:underline">
                                        Detail
                                    </Link>
                                    <Link href={`/debts/${deb.deb_id}/edit`} className="text-green-600 hover:underline">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
