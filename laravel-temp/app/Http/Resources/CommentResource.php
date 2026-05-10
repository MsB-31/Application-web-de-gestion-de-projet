<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => (string) $this->id,
            'taskId'         => (string) $this->task_id,
            'authorId'       => (string) $this->user_id,
            'authorName'     => $this->whenLoaded('user', fn() => $this->user->prenom . ' ' . $this->user->nom),
            'authorInitials' => $this->whenLoaded('user', fn() => strtoupper(substr($this->user->prenom, 0, 1) . substr($this->user->nom, 0, 1))),
            'content'        => $this->content,
            'editedAt'       => $this->edited_at?->toISOString(),
            'createdAt'      => $this->created_at?->toISOString(),
        ];
    }
}
