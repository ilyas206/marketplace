<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'exists:users,id'],
            'order_id' => ['nullable', 'exists:orders,id'],
            'body' => ['required', 'string', 'max:2000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $sender = $this->user();
            $receiver = User::find($this->receiver_id);

            if (! $receiver) return;

            if ($sender->id === $receiver->id) {
                $validator->errors()->add('receiver_id', 'You cannot message yourself.');
                return;
            }

            $senderRoles = $sender->getRoleNames();
            $receiverRoles = $receiver->getRoleNames();

            // Allowed conversation pairings — buyer support stays through the complaint
            // system (Step 68), not direct chat with admin. Seller<->admin is the new addition.
            $allowedPairs = [
                ['buyer', 'seller'],
                ['seller', 'admin'],
            ];

            $isValidPair = collect($allowedPairs)->contains(function ($pair) use ($senderRoles, $receiverRoles) {
                [$roleA, $roleB] = $pair;
                return ($senderRoles->contains($roleA) && $receiverRoles->contains($roleB))
                    || ($senderRoles->contains($roleB) && $receiverRoles->contains($roleA));
            });

            if (! $isValidPair) {
                $validator->errors()->add('receiver_id', 'You are not allowed to message this user.');
            }

            if ($this->order_id) {
                $order = \App\Models\Order::with('items')->find($this->order_id);

                // Order-linking only makes sense for buyer<->seller (order-scoped);
                // seller<->admin conversations are never tied to a specific order
                if ($senderRoles->contains('admin') || $receiverRoles->contains('admin')) {
                    $validator->errors()->add('order_id', 'Admin conversations cannot be linked to an order.');
                    return;
                }

                $buyerId = $senderRoles->contains('buyer') ? $sender->id : $receiver->id;
                $sellerId = $senderRoles->contains('seller') ? $sender->id : $receiver->id;

                $isLinked = $order->buyer_id === $buyerId
                    && $order->items->contains('seller_id', $sellerId);

                if (! $isLinked) {
                    $validator->errors()->add('order_id', 'This order does not link these two users.');
                }
            }
        });
    }
}