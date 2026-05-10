# Backend Laravel – Digital Solutions
## Guide d'implémentation complet

> **Stack :** Laravel 11 · PHP 8.2+ · MySQL 8 · Laravel Sanctum (JWT-like tokens)

---

## 1. Prérequis & Installation

```bash
composer create-project laravel/laravel digital-solutions-api
cd digital-solutions-api

# Authentification par token
composer require laravel/sanctum

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### `.env` (extrait)
```env
APP_NAME="Digital Solutions API"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=digital_solutions
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

### `config/cors.php`
```php
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'supports_credentials' => true,
```

---

## 2. Routes API (`routes/api.php`)

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;

// ── Authentification (publique) ────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ── Routes protégées (Sanctum) ─────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::get('/me',              [AuthController::class, 'me']);
        Route::put('/me',              [AuthController::class, 'updateProfile']);
        Route::put('/me/password',     [AuthController::class, 'changePassword']);
        Route::post('/logout',         [AuthController::class, 'logout']);
    });

    // Membres (utilisateurs)
    Route::apiResource('users', UserController::class)->only(['index', 'show', 'store', 'update', 'destroy']);

    // Projets
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{project}/membres',           [ProjectController::class, 'addMember']);
    Route::delete('/projects/{project}/membres/{user}',  [ProjectController::class, 'removeMember']);

    // Tâches
    Route::get('/projects/{project}/taches', [TaskController::class, 'byProject']);
    Route::apiResource('taches', TaskController::class)->except(['index']);
    Route::patch('/taches/{task}/statut',      [TaskController::class, 'updateStatus']);
    Route::patch('/taches/{task}/assignation', [TaskController::class, 'assign']);
});
```

---

## 3. Tableau récapitulatif des endpoints

| Méthode | Endpoint                              | Contrôleur                    | Auth |
|---------|---------------------------------------|-------------------------------|------|
| POST    | `/api/auth/register`                  | AuthController@register       | ✗    |
| POST    | `/api/auth/login`                     | AuthController@login          | ✗    |
| GET     | `/api/auth/me`                        | AuthController@me             | ✓    |
| PUT     | `/api/auth/me`                        | AuthController@updateProfile  | ✓    |
| PUT     | `/api/auth/me/password`               | AuthController@changePassword | ✓    |
| POST    | `/api/auth/logout`                    | AuthController@logout         | ✓    |
| GET     | `/api/users`                          | UserController@index          | ✓    |
| POST    | `/api/users`                          | UserController@store          | ✓    |
| GET     | `/api/users/{id}`                     | UserController@show           | ✓    |
| PUT     | `/api/users/{id}`                     | UserController@update         | ✓    |
| DELETE  | `/api/users/{id}`                     | UserController@destroy        | ✓    |
| GET     | `/api/projects`                       | ProjectController@index       | ✓    |
| POST    | `/api/projects`                       | ProjectController@store       | ✓    |
| GET     | `/api/projects/{id}`                  | ProjectController@show        | ✓    |
| PUT     | `/api/projects/{id}`                  | ProjectController@update      | ✓    |
| DELETE  | `/api/projects/{id}`                  | ProjectController@destroy     | ✓    |
| POST    | `/api/projects/{id}/membres`          | ProjectController@addMember   | ✓    |
| DELETE  | `/api/projects/{id}/membres/{userId}` | ProjectController@removeMember| ✓    |
| GET     | `/api/projects/{id}/taches`           | TaskController@byProject      | ✓    |
| POST    | `/api/taches`                         | TaskController@store          | ✓    |
| GET     | `/api/taches/{id}`                    | TaskController@show           | ✓    |
| PUT     | `/api/taches/{id}`                    | TaskController@update         | ✓    |
| DELETE  | `/api/taches/{id}`                    | TaskController@destroy        | ✓    |
| PATCH   | `/api/taches/{id}/statut`             | TaskController@updateStatus   | ✓    |
| PATCH   | `/api/taches/{id}/assignation`        | TaskController@assign         | ✓    |

---

## 4. Modèles Eloquent

### `app/Models/User.php`
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = ['nom', 'prenom', 'email', 'password', 'role', 'avatar'];
    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = ['email_verified_at' => 'datetime'];

    public function projetsChef()    { return $this->hasMany(Project::class, 'chef_id'); }
    public function projets()        { return $this->belongsToMany(Project::class, 'project_members'); }
    public function tachesAssignees(){ return $this->hasMany(Task::class, 'assigne_a_id'); }
}
```

### `app/Models/Project.php`
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table    = 'projects';
    protected $fillable = ['nom', 'description', 'statut', 'date_debut', 'date_fin', 'chef_id'];
    protected $casts    = ['date_debut' => 'date', 'date_fin' => 'date'];

    public function chef()    { return $this->belongsTo(User::class, 'chef_id'); }
    public function membres() { return $this->belongsToMany(User::class, 'project_members'); }
    public function taches()  { return $this->hasMany(Task::class); }
}
```

### `app/Models/Task.php`
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $table    = 'tasks';
    protected $fillable = [
        'project_id','titre','description','statut',
        'priorite','assigne_a_id','date_echeance'
    ];
    protected $casts = ['date_echeance' => 'date'];

    public function projet()   { return $this->belongsTo(Project::class); }
    public function assigneA() { return $this->belongsTo(User::class, 'assigne_a_id'); }
    public function commentaires() { return $this->hasMany(TaskComment::class); }
    public function historique()   { return $this->hasMany(TaskHistory::class); }
}
```

---

## 5. Contrôleurs

### `app/Http/Controllers/Api/AuthController.php`
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:users',
            'motDePasse' => 'required|string|min:8',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'password' => Hash::make($data['motDePasse']),
            'role'     => 'Membre',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'email'      => 'required|email',
            'motDePasse' => 'required|string',
        ]);

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['motDePasse'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Identifiants incorrects.']);
        }

        $user->tokens()->delete(); // Révoque les anciens tokens
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'nom'    => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email'  => 'sometimes|email|unique:users,email,' . $request->user()->id,
            'role'   => 'sometimes|string|max:100',
            'avatar' => 'sometimes|nullable|url',
        ]);

        $request->user()->update($data);
        return response()->json($request->user()->fresh());
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword'     => 'required|string|min:8|different:currentPassword',
        ]);

        if (!Hash::check($data['currentPassword'], $request->user()->password)) {
            return response()->json(['message' => 'Mot de passe actuel incorrect.'], 422);
        }

        $request->user()->update(['password' => Hash::make($data['newPassword'])]);
        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }
}
```

### `app/Http/Controllers/Api/UserController.php`
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('nom', 'like', "%$s%")
                  ->orWhere('prenom', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%")
                  ->orWhere('role', 'like', "%$s%")
            );
        }
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        return response()->json($query->orderBy('nom')->get());
    }

    public function show(User $user)
    {
        return response()->json($user->load('projets'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:users',
            'role'       => 'required|string|max:100',
            'motDePasse' => 'required|string|min:8',
        ]);

        $user = User::create([
            'nom'      => $data['nom'],
            'prenom'   => $data['prenom'],
            'email'    => $data['email'],
            'role'     => $data['role'],
            'password' => Hash::make($data['motDePasse']),
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'nom'    => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email'  => 'sometimes|email|unique:users,email,' . $user->id,
            'role'   => 'sometimes|string|max:100',
        ]);

        $user->update($data);
        return response()->json($user->fresh());
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
```

### `app/Http/Controllers/Api/ProjectController.php`
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['chef', 'membres', 'taches']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) =>
                $q->where('nom', 'like', "%$s%")
                  ->orWhere('description', 'like', "%$s%")
            );
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        // Tri
        $sortBy    = in_array($request->sortBy, ['nom','created_at','date_debut']) ? $request->sortBy : 'created_at';
        $sortOrder = $request->sortOrder === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $pageSize = (int) ($request->pageSize ?? 9);
        $paginated = $query->paginate($pageSize);

        return response()->json([
            'data'     => $paginated->items(),
            'total'    => $paginated->total(),
            'page'     => $paginated->currentPage(),
            'pageSize' => $paginated->perPage(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'        => 'required|string|max:255',
            'description'=> 'required|string',
            'dateDebut'  => 'required|date',
            'dateFin'    => 'nullable|date|after_or_equal:dateDebut',
            'membresIds' => 'nullable|array',
            'membresIds.*'=> 'exists:users,id',
        ]);

        $project = Project::create([
            'nom'         => $data['nom'],
            'description' => $data['description'],
            'date_debut'  => $data['dateDebut'],
            'date_fin'    => $data['dateFin'] ?? null,
            'chef_id'     => $request->user()->id,
            'statut'      => 'ACTIF',
        ]);

        if (!empty($data['membresIds'])) {
            $project->membres()->sync($data['membresIds']);
        }

        return response()->json($project->load(['chef', 'membres', 'taches']), 201);
    }

    public function show(Project $project)
    {
        return response()->json($project->load(['chef', 'membres', 'taches.assigneA']));
    }

    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'nom'         => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'statut'      => 'sometimes|in:ACTIF,EN_PAUSE,TERMINE',
            'dateDebut'   => 'sometimes|date',
            'dateFin'     => 'nullable|date',
            'membresIds'  => 'nullable|array',
            'membresIds.*'=> 'exists:users,id',
        ]);

        $project->update([
            'nom'         => $data['nom']         ?? $project->nom,
            'description' => $data['description'] ?? $project->description,
            'statut'      => $data['statut']      ?? $project->statut,
            'date_debut'  => $data['dateDebut']   ?? $project->date_debut,
            'date_fin'    => $data['dateFin']     ?? $project->date_fin,
        ]);

        if (isset($data['membresIds'])) {
            $project->membres()->sync($data['membresIds']);
        }

        return response()->json($project->fresh()->load(['chef', 'membres', 'taches']));
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }

    public function addMember(Request $request, Project $project)
    {
        $data = $request->validate(['userId' => 'required|exists:users,id']);
        $project->membres()->syncWithoutDetaching([$data['userId']]);
        return response()->json($project->load(['chef', 'membres']));
    }

    public function removeMember(Project $project, User $user)
    {
        $project->membres()->detach($user->id);
        return response()->json($project->load(['chef', 'membres']));
    }
}
```

### `app/Http/Controllers/Api/TaskController.php`
```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskHistory;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function byProject(Request $request, Project $project)
    {
        $query = $project->taches()->with('assigneA');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('assigneAId')) {
            $query->where('assigne_a_id', $request->assigneAId);
        }
        if ($request->filled('priorite')) {
            $query->where('priorite', $request->priorite);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function show(Task $task)
    {
        return response()->json($task->load(['assigneA', 'commentaires.user', 'historique.user']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'projetId'     => 'required|exists:projects,id',
            'titre'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'priorite'     => 'required|in:BASSE,MOYENNE,HAUTE',
            'assigneAId'   => 'nullable|exists:users,id',
            'dateEcheance' => 'nullable|date',
        ]);

        $task = Task::create([
            'project_id'    => $data['projetId'],
            'titre'         => $data['titre'],
            'description'   => $data['description'] ?? null,
            'priorite'      => $data['priorite'],
            'assigne_a_id'  => $data['assigneAId'] ?? null,
            'date_echeance' => $data['dateEcheance'] ?? null,
            'statut'        => 'A_FAIRE',
        ]);

        $this->logHistory($task->id, $request->user()->id, 'CREATED');

        return response()->json($task->load('assigneA'), 201);
    }

    public function update(Request $request, Task $task)
    {
        $data = $request->validate([
            'titre'        => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'statut'       => 'sometimes|in:A_FAIRE,EN_COURS,TERMINE',
            'priorite'     => 'sometimes|in:BASSE,MOYENNE,HAUTE',
            'assigneAId'   => 'nullable|exists:users,id',
            'dateEcheance' => 'nullable|date',
        ]);

        // Audit des changements
        if (isset($data['statut']) && $data['statut'] !== $task->statut) {
            $this->logHistory($task->id, $request->user()->id, 'STATUS_CHANGED', 'statut', $task->statut, $data['statut']);
        }
        if (isset($data['priorite']) && $data['priorite'] !== $task->priorite) {
            $this->logHistory($task->id, $request->user()->id, 'PRIORITY_CHANGED', 'priorite', $task->priorite, $data['priorite']);
        }

        $task->update([
            'titre'         => $data['titre']       ?? $task->titre,
            'description'   => $data['description'] ?? $task->description,
            'statut'        => $data['statut']       ?? $task->statut,
            'priorite'      => $data['priorite']    ?? $task->priorite,
            'assigne_a_id'  => array_key_exists('assigneAId', $data) ? $data['assigneAId'] : $task->assigne_a_id,
            'date_echeance' => $data['dateEcheance'] ?? $task->date_echeance,
        ]);

        return response()->json($task->fresh()->load('assigneA'));
    }

    public function updateStatus(Request $request, Task $task)
    {
        $data = $request->validate(['statut' => 'required|in:A_FAIRE,EN_COURS,TERMINE']);
        $old  = $task->statut;
        $task->update(['statut' => $data['statut']]);
        $this->logHistory($task->id, $request->user()->id, 'STATUS_CHANGED', 'statut', $old, $data['statut']);
        return response()->json($task->fresh()->load('assigneA'));
    }

    public function assign(Request $request, Task $task)
    {
        $data = $request->validate(['userId' => 'required|exists:users,id']);
        $task->update(['assigne_a_id' => $data['userId']]);
        $this->logHistory($task->id, $request->user()->id, 'ASSIGNED', 'assigne_a_id', null, $data['userId']);
        return response()->json($task->fresh()->load('assigneA'));
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }

    private function logHistory(int $taskId, int $userId, string $action, ?string $field = null, ?string $oldValue = null, ?string $newValue = null): void
    {
        TaskHistory::create([
            'task_id'   => $taskId,
            'user_id'   => $userId,
            'action'    => $action,
            'field'     => $field,
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }
}
```

---

## 6. Resources JSON (Transformers)

```bash
php artisan make:resource UserResource
php artisan make:resource ProjectResource
php artisan make:resource TaskResource
```

### `app/Http/Resources/UserResource.php`
```php
public function toArray($request): array {
    return [
        'id'        => $this->id,
        'nom'       => $this->nom,
        'prenom'    => $this->prenom,
        'email'     => $this->email,
        'role'      => $this->role,
        'avatar'    => $this->avatar,
        'createdAt' => $this->created_at?->toISOString(),
    ];
}
```

---

## 7. Migrations (ordre d'exécution)

```bash
php artisan make:migration create_projects_table
php artisan make:migration create_project_members_table
php artisan make:migration create_tasks_table
php artisan make:migration create_task_comments_table
php artisan make:migration create_task_history_table
php artisan migrate
```

---

## 8. Tests Artisan utiles

```bash
# Créer un utilisateur de test
php artisan tinker
>>> User::create(['nom'=>'Admin','prenom'=>'Test','email'=>'admin@test.com','password'=>bcrypt('password'),'role'=>'Chef de projet'])

# Lister les routes
php artisan route:list --path=api

# Vider le cache
php artisan config:clear && php artisan cache:clear
```

---

## 9. Connexion depuis le Frontend React

Modifier `src/services/api.ts` :
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

Créer `.env.local` dans le projet React :
```env
VITE_API_URL=http://localhost:8000/api
```
