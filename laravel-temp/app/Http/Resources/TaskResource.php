<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => (string) $this->id,
            'projetId'     => (string) $this->project_id,
            'titre'        => $this->titre,
            'description'  => $this->description,
            'statut'       => $this->statut,
            'priorite'     => $this->priorite,
            'assigneA'     => $this->whenLoaded('assigneA', fn() => new UserResource($this->assigneA)),
            'dateEcheance' => $this->date_echeance?->toDateString(),
            'commentaires' => CommentResource::collection($this->whenLoaded('commentaires')),
            'historique'   => HistoryResource::collection($this->whenLoaded('historique')),
            'createdAt'    => $this->created_at?->toISOString(),
            'updatedAt'    => $this->updated_at?->toISOString(),
        ];
    }
}
