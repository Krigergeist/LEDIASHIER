<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Debt extends Model
{
    protected $primaryKey = 'deb_id';
    protected $fillable = ['deb_tsn_id', 'deb_csm_id', 'deb_amount', 'deb_paid_amount', 'deb_due_date', 'deb_status'];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'deb_tsn_id', 'tsn_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'deb_csm_id', 'csm_id');
    }
}
