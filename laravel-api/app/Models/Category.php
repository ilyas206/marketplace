<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'parent_id', 'created_by',
    ];

    // The category this one belongs to (if it's a subcategory)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Subcategories under this one
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Admin who created it
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // All products in this category
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
