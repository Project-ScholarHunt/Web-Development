<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Selections extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_id',
        'status',
        'note',
    ];

    protected $table = 'selections';
    protected $primaryKey = 'selection_id';

    public function applicant()
    {
        return $this->belongsTo(Applicants::class, 'applicant_id');
    }
}
