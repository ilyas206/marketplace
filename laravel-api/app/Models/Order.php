<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id', 'shipping_address', 'phone',
        'payment_method', 'total_amount', 'status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function syncStatus(): void
    {
        $statuses = $this->items()->pluck('item_status');

        if ($statuses->isNotEmpty() && $statuses->every(fn ($s) => $s === 'cancelled')) {
            $this->status = 'cancelled';
        } elseif ($statuses->isNotEmpty() && $statuses->every(fn ($s) => $s === 'delivered')) {
            $this->status = 'completed';
        } elseif ($statuses->contains(fn ($s) => in_array($s, ['confirmed', 'shipped', 'delivered']))) {
            $this->status = 'processing';
        } else {
            $this->status = 'pending';
        }

        $this->save();
    }
}