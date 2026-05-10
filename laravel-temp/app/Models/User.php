<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'nom', 'prenom', 'email', 'password', 'role', 'avatar',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    public function projetsChef()
    {
        return $this->hasMany(Project::class, 'chef_id');
    }

    public function projets()
    {
        return $this->belongsToMany(Project::class, 'project_members')->withTimestamps();
    }

    public function tachesAssignees()
    {
        return $this->hasMany(Task::class, 'assigne_a_id');
    }

    public function commentaires()
    {
        return $this->hasMany(TaskComment::class);
    }
}
