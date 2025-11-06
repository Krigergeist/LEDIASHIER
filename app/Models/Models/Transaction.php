<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $primaryKey = 'tsn_id';
    protected $fillable = [
        'tsn_usr_id',
        'tsn_csm_id',
        'tsn_date',
        'tsn_metode',
        'tsn_total',
        'tsn_paid',
        'tsn_paid_return'
    ];

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'tsn_usr_id', 'id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'tsn_csm_id', 'csm_id');
    }

    public function details()
    {
        return $this->hasMany(TransactionDetail::class, 'tsnd_tsn_id', 'tsn_id');
    }

    public function debt()
    {
        return $this->hasOne(Debt::class, 'deb_tsn_id', 'tsn_id');
    }
}
