<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('me', [AuthController::class, 'updateProfile']);
    Route::put('me/password', [AuthController::class, 'changePassword']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::get('projects', [ProjectController::class, 'index']);
Route::post('projects', [ProjectController::class, 'store']);
Route::get('projects/{project}', [ProjectController::class, 'show']);
Route::put('projects/{project}', [ProjectController::class, 'update']);
Route::delete('projects/{project}', [ProjectController::class, 'destroy']);
Route::post('projects/{project}/membres', [ProjectController::class, 'addMember']);
Route::delete('projects/{project}/membres/{user}', [ProjectController::class, 'removeMember']);
Route::get('projects/{project}/taches', [TaskController::class, 'indexByProject']);

Route::get('taches/{task}', [TaskController::class, 'show']);
Route::post('taches', [TaskController::class, 'store']);
Route::put('taches/{task}', [TaskController::class, 'update']);
Route::patch('taches/{task}/statut', [TaskController::class, 'updateStatus']);
Route::patch('taches/{task}/assignation', [TaskController::class, 'assignTask']);
Route::delete('taches/{task}', [TaskController::class, 'destroy']);
