<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index(Request $request)
    {
        $complaints = $request->user()->complaintsAgainst()
            ->with('buyer:id,name', 'order:id')
            ->latest()
            ->paginate(10);

        return response()->json($complaints);
    }
}