<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $primaryKey = 'prd_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'prd_name',
        'prd_price',
        'prd_stock',
        'prd_description',
        'prd_img',
    ];
}
