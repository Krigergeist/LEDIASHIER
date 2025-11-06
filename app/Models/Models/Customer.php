<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $primaryKey = 'csm_id';
    protected $fillable = ['csm_nik', 'csm_name', 'csm_phone', 'csm_address'];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'tsn_csm_id', 'csm_id');
    }

    public function debts()
    {
        return $this->hasMany(Debt::class, 'deb_csm_id', 'csm_id');
    }
}
