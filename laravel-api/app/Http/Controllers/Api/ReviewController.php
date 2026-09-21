<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    // Public — reviews are shown on the product detail page to guests too
    public function index(Request $request, string $productSlug)
    {
        $reviews = Review::whereHas('product', fn ($q) => $q->where('slug', $productSlug))
            ->with('buyer:id,name')
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }

    public function mine(Request $request)
    {
        $reviews = Review::where('buyer_id', $request->user()->id)
            ->with('product:id,title,slug')
            ->latest()
            ->paginate(10);

        return response()->json($reviews);
    }

    public function store(StoreReviewRequest $request)
    {
        // updateOrCreate: the DB unique constraint (product_id + buyer_id) from Step 21
        // means a buyer can only ever have one review per product — this lets them edit it
        // by resubmitting, rather than getting a raw SQL unique-violation error
        $review = Review::updateOrCreate(
            ['product_id' => $request->product_id, 'buyer_id' => $request->user()->id],
            ['rating' => $request->rating, 'comment' => $request->comment]
        );

        return new ReviewResource($review->load('buyer:id,name'));
    }

    public function destroy(Request $request, Review $review)
    {
        abort_unless($review->buyer_id === $request->user()->id, 403);

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}