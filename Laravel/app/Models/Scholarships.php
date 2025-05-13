<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholarships extends Model  // Idealnya menggunakan Scholarship (singular)
{
    use HasFactory;
    
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
        'admin_id',
        'user_id'
    ];
    
    // Konversi otomatis untuk beberapa kolom
    protected $casts = [
        'time_limit' => 'date'
    ];
    
    // Relasi dengan user (owner/creator)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    // Relasi dengan admin (jika ada)
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
