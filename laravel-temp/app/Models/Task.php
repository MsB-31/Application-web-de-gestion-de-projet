<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table = 'tasks';

    protected $fillable = [
        'project_id', 'titre', 'description', 'statut',
        'priorite', 'assigne_a_id', 'date_echeance',
    ];

    protected $casts = [
        'date_echeance' => 'date:Y-m-d',
    ];

    public function projet()
    {
        return $this->belongsTo(Project::class);
    }

    public function assigneA()
    {
        return $this->belongsTo(User::class, 'assigne_a_id');
    }

    public function commentaires()
    {
        return $this->hasMany(TaskComment::class);
    }

    public function historique()
    {
        return $this->hasMany(TaskHistory::class);
    }
}
