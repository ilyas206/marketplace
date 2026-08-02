<?php

use App\Http\Controllers\Api\Admin\SellerApprovalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SellerApplicationController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/seller/apply', [SellerApplicationController::class, 'store']);
    Route::get('/seller/application-status', [SellerApplicationController::class, 'status']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/seller-requests', [SellerApprovalController::class, 'index']);
    Route::get('/seller-requests/{sellerProfile}', [SellerApprovalController::class, 'show']);
    Route::post('/seller-requests/{sellerProfile}/approve', [SellerApprovalController::class, 'approve']);
    Route::post('/seller-requests/{sellerProfile}/reject', [SellerApprovalController::class, 'reject']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{slug}/related', [ProductController::class, 'related']);

require __DIR__.'/auth.php';