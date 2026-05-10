<?php

namespace App\Providers;

use App\Models\TaskComment;
use App\Policies\TaskCommentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    protected $policies = [
        TaskComment::class => TaskCommentPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
