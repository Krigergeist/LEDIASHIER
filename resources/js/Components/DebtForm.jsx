function DebtForm({ transactionId }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        due_date: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(`/transactions/${transactionId}/confirm-debt`, form, {
            onSuccess: () => alert("Data hutang berhasil disimpan."),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-2">
            <input
                placeholder="Nama Debitur"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border p-2 rounded"
                required
            />
            <input
                placeholder="Nomor Telepon"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                placeholder="Alamat"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="border p-2 rounded"
            />
            <button
                className="bg-yellow-600 text-white px-4 py-2 rounded mt-2"
                type="submit"
            >
                Simpan Hutang
            </button>
        </form>
    );
}
