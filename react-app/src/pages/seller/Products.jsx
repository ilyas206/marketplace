import { useState } from 'react';
import {
  useSellerProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/useSellerProducts';
import ProductForm from '../../components/seller/ProductForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus } from 'lucide-react';

export default function SellerProducts() {
  const { data, isLoading } = useSellerProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const handleCreate = (formData) => {
    createProduct.mutate(formData, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleUpdate = (payload) => {
    updateProduct.mutate(
      { productId: editingProduct.id, payload },
      { onSuccess: () => setEditingProduct(null) }
    );
  };

  const handleDelete = (productId) => {
    deleteProduct.mutate(
        productId,
        { onSuccess: () => setDeletingProduct(null) }
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">My Products</h1>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-action hover:bg-darker"><Plus /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className='text-darker'>New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              mode="create"
              onSubmit={handleCreate}
              isPending={createProduct.isPending}
              errors={createProduct.error?.response?.data?.errors}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {data && data.data.length === 0 && (
        <img src="/no_products.png" alt="No products added" className="mx-auto w-3/5 max-h-80" />
      )}

      {data && data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="border-b-borders">
              <TableHead className="text-center">Product</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-darker/80 font-semibold">
            {data.data.map((product) => (
              <TableRow key={product.id} className="border-b-borders">
                <TableCell>{product.title}</TableCell>
                <TableCell>{product.category?.name ?? '—'}</TableCell>
                <TableCell>
                  {product.discount_price ?? product.price} MAD
                  {product.discount_price && (
                    <span className="ml-1 text-xs text-slate-400 line-through">
                      {product.price}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={product.stock === 0 ? 'text-destructive' : ''}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={product.status === 'active' ? 'bg-action' : 'bg-lighter/30 text-darker'}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeletingProduct(product)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-darker'>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              mode="edit"
              initialData={editingProduct}
              onSubmit={handleUpdate}
              isPending={updateProduct.isPending}
              errors={updateProduct.error?.response?.data?.errors}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className='text-darker'>Delete Product</DialogTitle>
          </DialogHeader>
            <DialogDescription>
                Remove <b>{deletingProduct?.title}</b> ? This can't be undone from here
            </DialogDescription>
            <DialogFooter className="border-t-borders">
                <DialogClose>
                    <Button size="sm" variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => handleDelete(deletingProduct?.id)} disabled={deleteProduct.isPending} size="sm" className="bg-destructive/50 hover:bg-destructive">
                    {
                        deleteProduct.isPending ? 'Deleting...' : 'Delete'
                    }
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}