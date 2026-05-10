<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with(['chef', 'membres', 'taches.assigneA']);

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom',         'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
            });
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        $sortBy    = in_array($request->sortBy, ['nom', 'created_at', 'date_debut'])
            ? $request->sortBy
            : 'created_at';
        $sortOrder = $request->sortOrder === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $pageSize  = (int) ($request->pageSize ?? 9);
        $paginated = $query->paginate($pageSize);

        return response()->json([
            'data'     => ProjectResource::collection($paginated->items()),
            'total'    => $paginated->total(),
            'page'     => $paginated->currentPage(),
            'pageSize' => $paginated->perPage(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'         => 'required|string|max:255',
            'description' => 'required|string',
            'dateDebut'   => 'required|date',
            'dateFin'     => 'nullable|date|after_or_equal:dateDebut',
            'membresIds'  => 'nullable|array',
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

        if (! empty($data['membresIds'])) {
            $project->membres()->sync($data['membresIds']);
        }

        // Ajouter le chef comme membre automatiquement
        $project->membres()->syncWithoutDetaching([$request->user()->id]);

        return new ProjectResource($project->load(['chef', 'membres', 'taches.assigneA']));
    }

    public function show(Project $project)
    {
        return new ProjectResource($project->load(['chef', 'membres', 'taches.assigneA']));
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
            'date_fin'    => array_key_exists('dateFin', $data) ? $data['dateFin'] : $project->date_fin,
        ]);

        if (isset($data['membresIds'])) {
            $project->membres()->sync($data['membresIds']);
        }

        return new ProjectResource($project->fresh()->load(['chef', 'membres', 'taches.assigneA']));
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

        return new ProjectResource($project->load(['chef', 'membres']));
    }

    public function removeMember(Project $project, User $user)
    {
        $project->membres()->detach($user->id);

        return new ProjectResource($project->load(['chef', 'membres']));
    }
}
