<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => (string) $this->id,
            'nom'         => $this->nom,
            'description' => $this->description,
            'statut'      => $this->statut,
            'dateDebut'   => $this->date_debut?->toDateString(),
            'dateFin'     => $this->date_fin?->toDateString(),
            'chef'        => $this->whenLoaded('chef', fn() => new UserResource($this->chef)),
            'membres'     => UserResource::collection($this->whenLoaded('membres')),
            'taches'      => TaskResource::collection($this->whenLoaded('taches')),
            'createdAt'   => $this->created_at?->toISOString(),
            'updatedAt'   => $this->updated_at?->toISOString(),
        ];
    }
}
