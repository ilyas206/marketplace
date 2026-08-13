<?php

use App\Http\Controllers\Api\Admin\SellerApprovalController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\ComplaintController as AdminComplaintController;

use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SellerApplicationController;

use App\Http\Controllers\Api\Seller\OrderItemController;
use App\Http\Controllers\Api\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Api\Seller\StatsController;
use App\Http\Controllers\Api\WishlistController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::middleware(['auth:sanctum', 'suspended'])->group(function () {
    Route::post('/seller/apply', [SellerApplicationController::class, 'store']);
    Route::get('/seller/application-status', [SellerApplicationController::class, 'status']);
    Route::post('/cart/merge', [CartController::class, 'merge']);
    Route::post('/checkout', [CheckoutController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    // Buyer-side complaints
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::get('/complaints', [ComplaintController::class, 'index']);
    // buyer/seller messages
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/conversations', [MessageController::class, 'conversations']);
    Route::get('/messages/thread/{user}', [MessageController::class, 'thread']);
});

Route::middleware(['auth:sanctum', 'role:admin', 'suspended'])->prefix('admin')->group(function () {
    Route::post('/categories', [AdminCategoryController::class, 'store']);
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update']);
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy']);

    Route::get('/products', [AdminProductController::class, 'index']);
    Route::get('/products/{product}', [AdminProductController::class, 'show']);
    Route::patch('/products/{product}/status', [AdminProductController::class, 'updateStatus']);

    Route::get('/users', [AdminUserController::class, 'index']);
    Route::patch('/users/{user}/toggle-suspension', [AdminUserController::class, 'toggleSuspension']);

    Route::get('/complaints', [AdminComplaintController::class, 'index']);
    Route::patch('/complaints/{complaint}/resolve', [AdminComplaintController::class, 'resolve']);

    Route::get('/seller-requests', [SellerApprovalController::class, 'index']);
    Route::get('/seller-requests/{sellerProfile}', [SellerApprovalController::class, 'show']);
    Route::post('/seller-requests/{sellerProfile}/approve', [SellerApprovalController::class, 'approve']);
    Route::post('/seller-requests/{sellerProfile}/reject', [SellerApprovalController::class, 'reject']);
});

Route::middleware(['auth:sanctum', 'role:seller', 'suspended'])->prefix('seller')->group(function () {
    Route::apiResource('products', SellerProductController::class)->except(['show'])->names('seller.products'); // → seller.products.index, seller.products.store, etc.;
    // 'show' excluded: sellers can reuse the public GET /api/products/{slug} for viewing;
    // no need for a duplicate authenticated single-product endpoint

    Route::get('/stats/best-selling', [StatsController::class, 'bestSelling']);
    Route::get('/stats/top-categories', [StatsController::class, 'topCategories']);
    Route::get('/stats/income', [StatsController::class, 'income']);
    Route::get('/order-items', [OrderItemController::class, 'index']);
    Route::patch('/order-items/{orderItem}/status', [OrderItemController::class, 'updateStatus']);
});

// Public — categories should be visible to everyone for browsing/filtering
Route::get('/categories', [AdminCategoryController::class, 'index']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}/related', [ProductController::class, 'related']);

// Public — reviews visible to guests on product page
Route::get('/products/{productSlug}/reviews', [ReviewController::class, 'index']);

Route::middleware(['auth:sanctum', 'suspended'])->group(function () {
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
});

Route::middleware(['auth.optional', 'suspended'])->group(function() {
    Route::get('/products/{slug}', [ProductController::class, 'show']);
    Route::get('/cart', [CartController::class, 'show']);
    Route::post('/cart/items', [CartController::class, 'store']);
    Route::put('/cart/items/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/items/{cartItem}', [CartController::class, 'destroy']);
});

require __DIR__.'/auth.php';