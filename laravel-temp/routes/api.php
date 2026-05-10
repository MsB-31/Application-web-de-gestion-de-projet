<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TaskCommentController;
use App\Http\Controllers\Api\UserController;

// ── Authentification (publique) ────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ── Routes protégées (Sanctum) ─────────────────────────────────
Route::middleware(['auth:sanctum', \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class])->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me',          [AuthController::class, 'me']);
        Route::put('/me',          [AuthController::class, 'updateProfile']);
        Route::put('/me/password', [AuthController::class, 'changePassword']);
        Route::post('/logout',     [AuthController::class, 'logout']);
    });

    // Utilisateurs / Membres
    Route::apiResource('users', UserController::class);

    // Projets
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{project}/membres',           [ProjectController::class, 'addMember']);
    Route::delete('/projects/{project}/membres/{user}',  [ProjectController::class, 'removeMember']);

    // Tâches
    Route::get('/projects/{project}/taches',   [TaskController::class, 'byProject']);
    Route::apiResource('taches', TaskController::class)->except(['index']);
    Route::patch('/taches/{task}/statut',      [TaskController::class, 'updateStatus']);
    Route::patch('/taches/{task}/assignation', [TaskController::class, 'assign']);

    // Commentaires sur les tâches
    Route::get('/taches/{task}/commentaires',    [TaskCommentController::class, 'index']);
    Route::post('/taches/{task}/commentaires',   [TaskCommentController::class, 'store']);
    Route::put('/commentaires/{comment}',        [TaskCommentController::class, 'update']);
    Route::delete('/commentaires/{comment}',     [TaskCommentController::class, 'destroy']);
});
