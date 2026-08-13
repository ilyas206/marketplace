<?php

namespace App\Http\Requests;

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
            'receiver_id' => ['required', 'exists:users,id', 'different:sender_placeholder'],
            'order_id' => ['nullable', 'exists:orders,id'],
            'body' => ['required', 'string', 'max:2000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $sender = $this->user();
            $receiver = \App\Models\User::find($this->receiver_id);

            if (! $receiver) {
                return; // already caught by 'exists' rule
            }

            if ($sender->id === $receiver->id) {
                $validator->errors()->add('receiver_id', 'You cannot message yourself.');
                return;
            }

            $roles = [$sender->getRoleNames()->first(), $receiver->getRoleNames()->first()];
            sort($roles);
            if ($roles !== ['buyer', 'seller']) {
                $validator->errors()->add('receiver_id', 'Chat is only allowed between a buyer and a seller.');
                return;
            }

            if ($this->order_id) {
                $order = \App\Models\Order::with('items')->find($this->order_id);

                if (! $order) {
                    return;
                }

                $buyerId = $sender->hasRole('buyer') ? $sender->id : $receiver->id;
                $sellerId = $sender->hasRole('seller') ? $sender->id : $receiver->id;

                $isLinked = $order->buyer_id === $buyerId
                    && $order->items->contains('seller_id', $sellerId);

                if (! $isLinked) {
                    $validator->errors()->add('order_id', 'This order does not link these two users.');
                }
            }
        });
    }
}