<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Builder;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';
    protected $primaryKey = 'usr_id';
    public $timestamps = false;

    protected $fillable = [
        'usr_name',
        'usr_email',
        'usr_password',
    ];

    protected $hidden = [
        'usr_password',
        'usr_remembered_token',
    ];

    protected $casts = [
        'usr_email_verified_at' => 'datetime',
    ];

    /** === Bagian Autentikasi === */
    public function getAuthPassword()
    {
        return $this->usr_password;
    }

    public function username()
    {
        return 'usr_email';
    }

    public function getEmailForPasswordReset()
    {
        return $this->usr_email;
    }

    public function routeNotificationForMail($notification)
    {
        return $this->usr_email;
    }

    /** === Alias dan pemetaan paksa === */
    public function getEmailAttribute()
    {
        return $this->usr_email;
    }

    public function setEmailAttribute($value)
    {
        $this->attributes['usr_email'] = $value;
    }

    /** === Perintah PENTING: ubah semua query where('email', ...) jadi usr_email === */
    protected static function booted()
    {
        static::addGlobalScope('mapEmailColumn', function (Builder $builder) {
            // Intercept kondisi pencarian "email"
            $builder->macro('where', function (Builder $builder, ...$params) {
                if (isset($params[0]) && $params[0] === 'email') {
                    $params[0] = 'usr_email';
                }
                return $builder->callParentMacro('where', $params);
            });
        });
    }

    /** === Laravel 10+ memerlukan cara alternatif untuk macro where === */
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('forceUsrEmail', function (Builder $builder) {
            $builder->getQuery()->wheres = collect($builder->getQuery()->wheres ?? [])
                ->map(function ($where) {
                    if (isset($where['column']) && $where['column'] === 'email') {
                        $where['column'] = 'usr_email';
                    }
                    return $where;
                })
                ->toArray();
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'tsn_usr_id', 'usr_id');
    }
}
