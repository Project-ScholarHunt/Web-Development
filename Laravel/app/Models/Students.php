<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Students extends Authenticatable
{
    use Notifiable;

    protected $primaryKey = 'student_id';

    protected $fillable = [
        'name', 'email', 'password', 'phone',
    ];

    protected $hidden = [
        'password',
    ];
}