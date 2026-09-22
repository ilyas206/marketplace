import { useState } from 'react';
import { useAdminProducts, useUpdateProductStatus } from '../../hooks/useAdmin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from "sonner";

export default function AdminProducts() {
  const [statusFilter, setStatusFilter] = useState('');
  const [activatingProduct, setActivatingProduct] = useState(null);
  const { data, isLoading } = useAdminProducts({ status: statusFilter || undefined });
  const updateStatus = useUpdateProductStatus();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">All Products</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">All statuses</SelectItem>
            <SelectItem value="active" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Active</SelectItem>
            <SelectItem value="inactive" className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      )}

      {data && data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow className="border-b-borders">
              <TableHead className="text-center">Product</TableHead>
              <TableHead className="text-center">Seller</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Activate/Deactivate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-darker/80 font-semibold">
            {data.data.map((product) => (
              <TableRow key={product.id} className="border-b-borders">
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.seller?.name}</TableCell>
                <TableCell>{product.category?.name}</TableCell>
                <TableCell>
                  <Badge className={product.status === 'active' ? 'bg-darker' : 'bg-lighter'}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => setActivatingProduct(product)}
                    className={product.status === 'active' ? "text-destructive bg-destructive/20 hover:bg-destructive/30" : "text-action bg-action/20 hover:bg-action/30"}
                  >
                    {product.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!activatingProduct} onOpenChange={(open) => !open && setActivatingProduct(null)}>
        {
          activatingProduct && 
            <DialogContent>
              <DialogHeader><DialogTitle>{activatingProduct.status === 'active' ? 'Deactivating' : 'Activating'} product</DialogTitle></DialogHeader>
              <DialogDescription>
                  Are you sure you want to {activatingProduct.status === 'active' ? 'deactivate' : 'activate'} <b>{activatingProduct.title}</b>
              </DialogDescription>
              <DialogFooter className="border-t-borders">
                  <DialogClose>
                      <Button size="sm" variant="outline" className="w-full">Cancel</Button>
                  </DialogClose>
                  <Button 
                    size="sm"
                    disabled={updateStatus.isPending}
                    className={activatingProduct.status === 'active' ? "text-destructive bg-destructive/20 hover:bg-destructive/30" : "text-action bg-action/20 hover:bg-action/30"}
                    onClick={() =>
                      updateStatus.mutate({
                        id: activatingProduct.id,
                        status: activatingProduct.status === 'active' ? 'inactive' : 'active',
                      }, {
                        onSuccess: () => {
                          setActivatingProduct(null);
                          toast.success(activatingProduct.status === 'active' ? "Product deactivated successfully." : 'Product activated successfully.', {
                            style: {
                              background: 'var(--success)',
                              color: 'var(--background)',
                              border: 'transparent'
                            },
                          })
                        }
                          
                      })
                    }
                    >
                      {
                        activatingProduct.status === 'active' ? 'Deactivate' : 'Activate'
                      }
                  </Button>
              </DialogFooter>
            </DialogContent>
        }
      </Dialog>
    </div>
  );
}