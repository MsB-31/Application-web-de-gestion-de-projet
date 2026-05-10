<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommentResource;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\TaskHistory;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function index(Task $task)
    {
        $comments = $task->commentaires()->with('user')->orderBy('created_at', 'asc')->get();

        return CommentResource::collection($comments);
    }

    public function store(Request $request, Task $task)
    {
        $data = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment = TaskComment::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id,
            'content' => $data['content'],
        ]);

        // Historique
        TaskHistory::create([
            'task_id'    => $task->id,
            'user_id'    => $request->user()->id,
            'action'     => 'COMMENT_ADDED',
            'new_value'  => $data['content'],
            'created_at' => now(),
        ]);

        return new CommentResource($comment->load('user'));
    }

    public function update(Request $request, TaskComment $comment)
    {
        $this->authorize('update', $comment);

        $data = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $comment->update([
            'content'   => $data['content'],
            'edited_at' => now(),
        ]);

        return new CommentResource($comment->fresh()->load('user'));
    }

    public function destroy(Request $request, TaskComment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(null, 204);
    }
}
