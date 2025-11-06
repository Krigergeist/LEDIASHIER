<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    protected $primaryKey = 'tsnd_id';
    protected $fillable = ['tsnd_tsn_id', 'tsnd_prd_id', 'tsnd_qty', 'tsnd_price'];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'tsnd_tsn_id', 'tsn_id');
    }

    public function product()
    {
        return $this->belongsTo(\App\Models\Product::class, 'tsnd_prd_id', 'prd_id');
    }
}
