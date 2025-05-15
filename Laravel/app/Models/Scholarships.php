<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarships extends Model  // Idealnya menggunakan Scholarship (singular)
{
    use HasFactory;

    protected $table = 'scholarships';
    
    // Tentukan primary key jika tidak menggunakan 'id'
    protected $primaryKey = 'scholarship_id';
    
    // Tentukan kolom yang bisa diisi dengan mass assignment
    protected $fillable = [
        'scholarship_name',
        'partner',
        'description',
        'terms_and_conditions',
        'quota',
        'time_limit',
        'logo',
        'thumbnail',
        'user_id'
    ];
    
    // Konversi otomatis untuk beberapa kolom
    protected $casts = [
        'time_limit' => 'datetime',
        'quota' => 'integer'
    ];
    
    // Relasi dengan user (owner/creator)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
