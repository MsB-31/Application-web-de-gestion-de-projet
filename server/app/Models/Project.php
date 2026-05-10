<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['nom', 'description', 'statut', 'date_debut', 'date_fin', 'chef_id'])]
class Project extends Model
{
    use HasFactory;

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    public function membres()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')->withTimestamps();
    }

    public function taches()
    {
        return $this->hasMany(Task::class, 'projet_id');
    }
}
