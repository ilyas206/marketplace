<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function store(SendMessageRequest $request)
    {
        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'order_id' => $request->order_id,
            'body' => $request->body,
        ]);

        return new MessageResource($message);
    }

    // List distinct conversations for the current user, with last message + unread count
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        // Distinct "other user" IDs this user has exchanged messages with
        $otherUserIds = Message::where('sender_id', $userId)
            ->pluck('receiver_id')
            ->merge(
                Message::where('receiver_id', $userId)->pluck('sender_id')
            )
            ->unique();

        $conversations = $otherUserIds->map(function ($otherId) use ($userId) {
            $lastMessage = Message::where(function ($q) use ($userId, $otherId) {
                    $q->where('sender_id', $userId)->where('receiver_id', $otherId);
                })->orWhere(function ($q) use ($userId, $otherId) {
                    $q->where('sender_id', $otherId)->where('receiver_id', $userId);
                })
                ->latest()
                ->first();

            $unreadCount = Message::where('sender_id', $otherId)
                ->where('receiver_id', $userId)
                ->whereNull('read_at')
                ->count();

            $otherUser = User::find($otherId);

            return [
                'user' => ['id' => $otherUser->id, 'name' => $otherUser->name],
                'last_message' => $lastMessage->body,
                'last_message_at' => $lastMessage->created_at,
                'unread_count' => $unreadCount,
            ];
            // values reset conversations array indexes (0, 1, 2 ...)
        })->sortByDesc('last_message_at')->values();

        return response()->json($conversations);
    }

    // Full thread with a specific user, marks their messages to me as read
    public function thread(Request $request, User $user)
    {
        $userId = $request->user()->id;

        $messages = Message::where(function ($q) use ($userId, $user) {
                $q->where('sender_id', $userId)->where('receiver_id', $user->id);
            })->orWhere(function ($q) use ($userId, $user) {
                $q->where('sender_id', $user->id)->where('receiver_id', $userId);
            })
            ->when($request->order_id, fn ($q) => $q->where('order_id', $request->order_id))
            ->orderBy('created_at')
            ->get();

        // Mark incoming messages as read
        Message::where('sender_id', $user->id)
            ->where('receiver_id', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return MessageResource::collection($messages);
    }
}