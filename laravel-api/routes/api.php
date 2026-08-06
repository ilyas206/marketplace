<?php

use App\Http\Controllers\Api\Admin\SellerApprovalController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\Seller\OrderItemController;
use App\Http\Controllers\Api\SellerApplicationController;
use App\Http\Controllers\Api\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Api\Seller\StatsController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/seller/apply', [SellerApplicationController::class, 'store']);
    Route::get('/seller/application-status', [SellerApplicationController::class, 'status']);
    Route::post('/cart/merge', [CartController::class, 'merge']);
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/seller-requests', [SellerApprovalController::class, 'index']);
    Route::get('/seller-requests/{sellerProfile}', [SellerApprovalController::class, 'show']);
    Route::post('/seller-requests/{sellerProfile}/approve', [SellerApprovalController::class, 'approve']);
    Route::post('/seller-requests/{sellerProfile}/reject', [SellerApprovalController::class, 'reject']);
});

Route::middleware(['auth:sanctum', 'role:seller'])->prefix('seller')->group(function () {
    Route::apiResource('products', SellerProductController::class)->except(['show']);
    // 'show' excluded: sellers can reuse the public GET /api/products/{slug} for viewing;
    // no need for a duplicate authenticated single-product endpoint

    Route::get('/stats/best-selling', [StatsController::class, 'bestSelling']);
    Route::get('/stats/top-categories', [StatsController::class, 'topCategories']);
    Route::get('/stats/income', [StatsController::class, 'income']);
    Route::get('/order-items', [OrderItemController::class, 'index']);
    Route::patch('/order-items/{orderItem}/status', [OrderItemController::class, 'updateStatus']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{slug}/related', [ProductController::class, 'related']);

Route::middleware('auth.optional')->group(function() {
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'store']);
    Route::put('/cart/items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy']);
});

require __DIR__.'/auth.php';