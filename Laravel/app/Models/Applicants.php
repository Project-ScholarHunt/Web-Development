<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Scholarships;
use App\Models\Selections;

class Applicants extends Model
{
    use HasFactory;

    protected $primaryKey = 'applicant_id';

    protected $fillable = [
        'scholarship_id',
        'user_id',
        'fullname',
        'nim',
        'semester',
        'university',
        'major',
        'ipk',
        'registration_date',
        'recommendation_letter',
        'statement_letter',
        'grade_transcript',
        'city',
        'province',
        'postal_code',
        'address',
    ];

    protected $casts = [
        'registration_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scholarships()
    {
        return $this->belongsTo(Scholarships::class, 'scholarship_id');
    }

    public function selection()
    {
        return $this->hasOne(Selections::class, 'applicant_id');
    }
}