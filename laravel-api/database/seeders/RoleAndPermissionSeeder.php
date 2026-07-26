<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles/permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'browse-products',
            'create-products',
            'edit-products',
            'delete-products',
            'manage-categories',
            'place-order',
            'view-own-orders',
            'update-order-item-status',
            'write-review',
            'send-message',
            'approve-seller-requests',
            'view-seller-stats',
            'view-seller-financials',
            'file-complaint',
            'resolve-complaints',
            'manage-users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $buyer = Role::firstOrCreate(['name' => 'buyer']);
        $buyer->givePermissionTo([
            'browse-products', 'place-order', 'view-own-orders',
            'write-review', 'send-message', 'file-complaint',
        ]);

        $seller = Role::firstOrCreate(['name' => 'seller']);
        $seller->givePermissionTo([
            'browse-products', 'create-products', 'edit-products', 'delete-products',
            'view-own-orders', 'update-order-item-status',
            'view-seller-stats', 'view-seller-financials', 'send-message',
        ]);

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all()); // admin gets everything
    }
}