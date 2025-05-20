<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;
use App\Models\Scholarships;

class Applicant extends Model
{
    use HasFactory;

    protected $fillable = [
        'scholarship_id',
        'student_id',
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

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scholarships()
    {
        return $this->belongsTo(Scholarships::class, 'scholarship_id');
    }
}