<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <title>Laporan Penjualan</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        h1 {
            text-align: center;
            margin-bottom: 10px;
        }

        h2 {
            margin-top: 20px;
            font-size: 14px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table,
        th,
        td {
            border: 1px solid #aaa;
        }

        th,
        td {
            padding: 6px 8px;
            text-align: left;
        }

        .summary {
            margin-bottom: 15px;
        }

        .summary td {
            border: none;
        }

        .total {
            font-weight: bold;
            color: #007b55;
        }
    </style>
</head>

<body>
    <h1>Laporan Penjualan</h1>
    <p><strong>Periode:</strong> {{ $start->toDateTimeString() }} — {{ $end->toDateTimeString() }}</p>

    <table class="summary">
        <tr>
            <td>Total Transaksi:</td>
            <td>{{ $totalTransaksi }}</td>
        </tr>
        <tr>
            <td>Total Penjualan:</td>
            <td>Rp {{ number_format($totalPenjualan, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td>Metode Pembayaran:</td>
            <td>
                @foreach($metodePembayaran as $metode => $jumlah)
                {{ $metode }}: {{ $jumlah }} &nbsp;&nbsp;
                @endforeach
            </td>
        </tr>
    </table>

    <h2>Produk Ditambahkan</h2>
    <table>
        <tr>
            <th>Nama Produk</th>
            <th>Tanggal</th>
        </tr>
        @foreach($produkDitambah as $p)
        <tr>
            <td>{{ $p->prd_name }}</td>
            <td>{{ $p->created_at }}</td>
        </tr>
        @endforeach
    </table>

    <h2>Produk Dihapus</h2>
    <table>
        <tr>
            <th>Nama Produk</th>
            <th>Dihapus Pada</th>
        </tr>
        @foreach($produkDihapus as $p)
        <tr>
            <td>{{ $p->prd_name }}</td>
            <td>{{ $p->deleted_at }}</td>
        </tr>
        @endforeach
    </table>

    <h2>Perubahan Hutang</h2>
    <table>
        <tr>
            <th>Nama Pelanggan</th>
            <th>Jumlah</th>
            <th>Dibayar</th>
            <th>Jatuh Tempo</th>
            <th>Status</th>
        </tr>
        @foreach($hutangPerubahan as $h)
        <tr>
            <td>{{ $h->csm_name }}</td>
            <td>Rp {{ number_format($h->deb_amount, 0, ',', '.') }}</td>
            <td>Rp {{ number_format($h->deb_paid_amount, 0, ',', '.') }}</td>
            <td>{{ $h->deb_due_date }}</td>
            <td>{{ ucfirst($h->deb_status) }}</td>
        </tr>
        @endforeach
    </table>

    <p style="text-align:center; margin-top:30px; font-size:11px; color:#666;">
        Dibuat otomatis oleh sistem LEDIASHIER — {{ now()->format('d-m-Y H:i') }}
    </p>
</body>

</html>