<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['titre', 'description', 'statut', 'priorite', 'projet_id', 'assigne_a_id', 'date_echeance'])]
class Task extends Model
{
    use HasFactory;

    protected $casts = [
        'date_echeance' => 'date',
    ];

    public function projet()
    {
        return $this->belongsTo(Project::class, 'projet_id');
    }

    public function assigneA()
    {
        return $this->belongsTo(User::class, 'assigne_a_id');
    }
}
