<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
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

        return TaskResource::collection($query->orderBy('created_at', 'desc')->get());
    }

    public function show(Task $task)
    {
        return new TaskResource($task->load(['assigneA', 'commentaires.user', 'historique.user']));
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

        $this->logHistory($task->id, $request->user()->id, 'CREATED', null, null, $task->titre);

        return new TaskResource($task->load('assigneA'));
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

        if (isset($data['statut']) && $data['statut'] !== $task->statut) {
            $this->logHistory($task->id, $request->user()->id, 'STATUS_CHANGED', 'statut', $task->statut, $data['statut']);
        }
        if (isset($data['priorite']) && $data['priorite'] !== $task->priorite) {
            $this->logHistory($task->id, $request->user()->id, 'PRIORITY_CHANGED', 'priorite', $task->priorite, $data['priorite']);
        }

        $task->update([
            'titre'         => $data['titre']       ?? $task->titre,
            'description'   => array_key_exists('description', $data) ? $data['description'] : $task->description,
            'statut'        => $data['statut']      ?? $task->statut,
            'priorite'      => $data['priorite']    ?? $task->priorite,
            'assigne_a_id'  => array_key_exists('assigneAId', $data) ? $data['assigneAId'] : $task->assigne_a_id,
            'date_echeance' => array_key_exists('dateEcheance', $data) ? $data['dateEcheance'] : $task->date_echeance,
        ]);

        return new TaskResource($task->fresh()->load('assigneA'));
    }

    public function updateStatus(Request $request, Task $task)
    {
        $data = $request->validate([
            'statut' => 'required|in:A_FAIRE,EN_COURS,TERMINE',
        ]);

        $old = $task->statut;
        $task->update(['statut' => $data['statut']]);
        $this->logHistory($task->id, $request->user()->id, 'STATUS_CHANGED', 'statut', $old, $data['statut']);

        return new TaskResource($task->fresh()->load('assigneA'));
    }

    public function assign(Request $request, Task $task)
    {
        $data = $request->validate([
            'userId' => 'required|exists:users,id',
        ]);

        $old = $task->assigne_a_id;
        $task->update(['assigne_a_id' => $data['userId']]);
        $this->logHistory($task->id, $request->user()->id, 'ASSIGNED', 'assigne_a_id', (string)$old, (string)$data['userId']);

        return new TaskResource($task->fresh()->load('assigneA'));
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
            'created_at'=> now(),
        ]);
    }
}
