<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function indexByProject(Request $request, Project $project)
    {
        $params = $request->validate([
            'statut' => ['sometimes', 'in:A_FAIRE,EN_COURS,TERMINE'],
            'assigneAId' => ['sometimes', 'string', 'exists:users,id'],
        ]);

        $query = $project->taches()->with(['assigneA']);

        if (! empty($params['statut'])) {
            $query->where('statut', $params['statut']);
        }

        if (! empty($params['assigneAId'])) {
            $query->where('assigne_a_id', $params['assigneAId']);
        }

        return response()->json($query->get()->map(fn ($task) => $this->formatTask($task)));
    }

    public function show(Task $task)
    {
        $task->load(['assigneA']);
        return response()->json($this->formatTask($task));
    }

    public function store(Request $request)
    {
        $this->authenticate($request);

        $payload = $request->validate([
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'priorite' => ['required', 'in:BASSE,MOYENNE,HAUTE'],
            'assigneAId' => ['sometimes', 'nullable', 'string', 'exists:users,id'],
            'dateEcheance' => ['sometimes', 'nullable', 'date'],
            'projetId' => ['required', 'string', 'exists:projects,id'],
        ]);

        $task = Task::create([
            'titre' => $payload['titre'],
            'description' => $payload['description'] ?? null,
            'priorite' => $payload['priorite'],
            'assigne_a_id' => $payload['assigneAId'] ?? null,
            'date_echeance' => $payload['dateEcheance'] ?? null,
            'projet_id' => $payload['projetId'],
            'statut' => 'A_FAIRE',
        ]);

        $task->load(['assigneA']);
        return response()->json($this->formatTask($task), 201);
    }

    public function update(Request $request, Task $task)
    {
        $this->authenticate($request);

        $payload = $request->validate([
            'titre' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'priorite' => ['sometimes', 'in:BASSE,MOYENNE,HAUTE'],
            'assigneAId' => ['sometimes', 'nullable', 'string', 'exists:users,id'],
            'dateEcheance' => ['sometimes', 'nullable', 'date'],
            'projetId' => ['sometimes', 'string', 'exists:projects,id'],
            'statut' => ['sometimes', 'in:A_FAIRE,EN_COURS,TERMINE'],
        ]);

        $task->update([
            'titre' => $payload['titre'] ?? $task->titre,
            'description' => array_key_exists('description', $payload) ? $payload['description'] : $task->description,
            'priorite' => $payload['priorite'] ?? $task->priorite,
            'assigne_a_id' => array_key_exists('assigneAId', $payload) ? $payload['assigneAId'] : $task->assigne_a_id,
            'date_echeance' => array_key_exists('dateEcheance', $payload) ? $payload['dateEcheance'] : $task->date_echeance,
            'projet_id' => $payload['projetId'] ?? $task->projet_id,
            'statut' => $payload['statut'] ?? $task->statut,
        ]);

        $task->load(['assigneA']);
        return response()->json($this->formatTask($task));
    }

    public function updateStatus(Request $request, Task $task)
    {
        $this->authenticate($request);

        $payload = $request->validate([
            'statut' => ['required', 'in:A_FAIRE,EN_COURS,TERMINE'],
        ]);

        $task->statut = $payload['statut'];
        $task->save();

        $task->load(['assigneA']);
        return response()->json($this->formatTask($task));
    }

    public function assignTask(Request $request, Task $task)
    {
        $this->authenticate($request);

        $payload = $request->validate([
            'userId' => ['required', 'string', 'exists:users,id'],
        ]);

        $task->assigne_a_id = $payload['userId'];
        $task->save();

        $task->load(['assigneA']);
        return response()->json($this->formatTask($task));
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authenticate($request);

        $task->delete();
        return response()->json(['message' => 'Tâche supprimée.']);
    }
}
