<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function bestSelling(Request $request)
    {
        $results = OrderItem::query()
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->where('seller_id', $request->user()->id)
            ->whereIn('item_status', ['confirmed', 'shipped', 'delivered'])
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->with('product:id,title,slug')
            ->get();

        return response()->json($results);
    }

    public function topCategories(Request $request)
    {
        $results = OrderItem::query()
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select('categories.id', 'categories.name', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->where('order_items.seller_id', $request->user()->id)
            ->whereIn('order_items.item_status', ['confirmed', 'shipped', 'delivered'])
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_sold')
            ->get();

        return response()->json($results);
    }

    public function income(Request $request)
    {
        $period = $request->period ?? 'month'; // day | week | month

        $dateFormat = match ($period) {
            'day' => '%Y-%m-%d',
            'week' => '%X-%V', // ISO year-week
            default => '%Y-%m',
        };

        $results = OrderItem::query()
            ->select(
                DB::raw("DATE_FORMAT(order_items.created_at, '{$dateFormat}') as period"),
                DB::raw('SUM(subtotal) as income')
            )
            ->where('seller_id', $request->user()->id)
            ->where('item_status', 'delivered') // only count confirmed revenue
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        return response()->json($results);
    }
}