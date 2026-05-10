<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $fillable = [
        'nom', 'description', 'statut', 'date_debut', 'date_fin', 'chef_id',
    ];

    protected $casts = [
        'date_debut' => 'date:Y-m-d',
        'date_fin'   => 'date:Y-m-d',
    ];

    public function chef()
    {
        return $this->belongsTo(User::class, 'chef_id');
    }

    public function membres()
    {
        return $this->belongsToMany(User::class, 'project_members');
    }

    public function taches()
    {
        return $this->hasMany(Task::class);
    }
}
