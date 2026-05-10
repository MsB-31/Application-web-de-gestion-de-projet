<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $params = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'pageSize' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'search' => ['sometimes', 'string'],
            'sortBy' => ['sometimes', 'string'],
            'sortOrder' => ['sometimes', 'in:asc,desc'],
        ]);

        $page = $params['page'] ?? 1;
        $pageSize = $params['pageSize'] ?? 9;

        $query = Project::with(['chef', 'membres']);

        if (! empty($params['search'])) {
            $query->where(function ($query) use ($params) {
                $query->where('nom', 'like', '%'.$params['search'].'%')
                    ->orWhere('description', 'like', '%'.$params['search'].'%');
            });
        }

        if (! empty($params['sortBy']) && in_array($params['sortBy'], ['nom', 'statut', 'date_debut', 'date_fin', 'created_at'], true)) {
            $query->orderBy($params['sortBy'], $params['sortOrder'] ?? 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        return response()->json([
            'data' => $paginator->items(),
            'total' => $paginator->total(),
            'page' => $paginator->currentPage(),
            'pageSize' => $paginator->perPage(),
        ]);
    }

    public function show(Project $project)
    {
        $project->load(['chef', 'membres']);

        return response()->json($this->formatProject($project));
    }

    public function store(Request $request)
    {
        $user = $this->authenticate($request);

        $payload = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'dateDebut' => ['required', 'date'],
            'dateFin' => ['sometimes', 'nullable', 'date', 'after_or_equal:dateDebut'],
            'membresIds' => ['sometimes', 'array'],
            'membresIds.*' => ['string', 'exists:users,id'],
        ]);

        $project = Project::create([
            'nom' => $payload['nom'],
            'description' => $payload['description'],
            'date_debut' => $payload['dateDebut'],
            'date_fin' => $payload['dateFin'] ?? null,
            'statut' => 'ACTIF',
            'chef_id' => $user->id,
        ]);

        if (! empty($payload['membresIds'])) {
            $project->membres()->sync($payload['membresIds']);
        }

        $project->load(['chef', 'membres']);

        return response()->json($this->formatProject($project), 201);
    }

    public function update(Request $request, Project $project)
    {
        $user = $this->authenticate($request);

        $payload = $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'dateDebut' => ['sometimes', 'nullable', 'date'],
            'dateFin' => ['sometimes', 'nullable', 'date', 'after_or_equal:dateDebut'],
            'statut' => ['sometimes', 'in:ACTIF,EN_PAUSE,TERMINE'],
            'membresIds' => ['sometimes', 'array'],
            'membresIds.*' => ['string', 'exists:users,id'],
        ]);

        $project->update([
            'nom' => $payload['nom'] ?? $project->nom,
            'description' => $payload['description'] ?? $project->description,
            'date_debut' => $payload['dateDebut'] ?? $project->date_debut,
            'date_fin' => array_key_exists('dateFin', $payload) ? $payload['dateFin'] : $project->date_fin,
            'statut' => $payload['statut'] ?? $project->statut,
        ]);

        if (array_key_exists('membresIds', $payload)) {
            $project->membres()->sync($payload['membresIds'] ?? []);
        }

        $project->load(['chef', 'membres']);

        return response()->json($this->formatProject($project));
    }

    public function destroy(Request $request, Project $project)
    {
        $user = $this->authenticate($request);

        $project->delete();

        return response()->json(['message' => 'Projet supprimé.']);
    }

    public function addMember(Request $request, Project $project)
    {
        $this->authenticate($request);

        $payload = $request->validate([
            'userId' => ['required', 'string', 'exists:users,id'],
        ]);

        $project->membres()->syncWithoutDetaching([$payload['userId']]);
        $project->load(['chef', 'membres']);

        return response()->json($this->formatProject($project));
    }

    public function removeMember(Request $request, Project $project, User $user)
    {
        $this->authenticate($request);

        $project->membres()->detach($user->id);
        $project->load(['chef', 'membres']);

        return response()->json($this->formatProject($project));
    }
}
