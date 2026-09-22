import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from "sonner";

export default function Categories() {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', parent_id: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    createCategory.mutate(
      { name: form.name, parent_id: form.parent_id || null },
      { onSuccess: () => { setOpen(false); setForm({ name: '', parent_id: '' }); toast.success("Category created successfully.", {
        style: {
          background: 'var(--success)',
          color: 'var(--background)',
          border: 'transparent'
        },
      })
    } }
    );
  };

  const handleEdit = (e) => {
    e.preventDefault();
    updateCategory.mutate(
      {
        id: editingCategory.id,
        payload: {
          name: editingCategory.name,
          parent_id: editingCategory.parent_id || null,
        },
      },
      { onSuccess: () => { setEditDialogOpen(false); setEditingCategory(null); toast.success("Category edited successfully.", {
        style: {
          background: 'var(--lighter)',
          color: 'var(--darker)',
          border: 'transparent'
        },
      })
    } }
    );
  };

  const handleDelete = (id) => {
    deleteCategory.mutate(id, {
      onSettled: () => setDeletingCategory(null),
      onSuccess: () => toast.error("Category deleted permanently.", {
        style: {
          background: 'var(--destructive)',
          color: 'var(--background)',
          border: 'transparent'
        },
      })
    });
  };

  const errorMsg = createCategory.error?.response?.data?.message
    ?? deleteCategory.error?.response?.data?.message;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">Categories</h1>
        <Dialog 
          open={open} 
          onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="bg-action hover:bg-darker">+ Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                {createCategory.error?.response?.data?.errors?.name && (
                  <p className="text-sm text-destructive">
                    {createCategory.error.response.data.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Parent category (optional)</Label>
                <Select value={form.parent_id} onValueChange={(v) => setForm({ ...form, parent_id: v })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!" value="">None (top-level)</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">{cat.id} - {cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-action hover:bg-darker" disabled={createCategory.isPending}>
                Create
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={editDialogOpen}
          onOpenChange={(isOpen) => {
            setEditDialogOpen(isOpen);
            if (!isOpen) setEditingCategory(null);
          }}
        >
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={editingCategory?.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} required />
                {updateCategory.error?.response?.data?.errors?.name && (
                  <p className="text-sm text-destructive">
                    {updateCategory.error.response.data.errors.name[0]}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Parent category (optional)</Label>
                <Select value={editingCategory?.parent_id} onValueChange={(v) => setEditingCategory({ ...editingCategory, parent_id: v })}>
                  <SelectTrigger className="w-full" asChild><SelectValue placeholder="None (top-level)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!" value="">None (top-level)</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="data-highlighted:bg-action data-highlighted:text-background! data-highlighted:**:text-background!">{cat.id} - {cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-action hover:bg-darker" disabled={updateCategory.isPending}>
                Edit
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog 
          open={!!deletingCategory} 
          onOpenChange={(open) => !open && setDeletingCategory(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className='text-darker'>Delete Category</DialogTitle>
            </DialogHeader>
              <DialogDescription>
                  Delete <b>{deletingCategory?.name}</b> ? This can't be undone from here
              </DialogDescription>
              <DialogFooter className="border-t-borders">
                  <DialogClose>
                      <Button size="sm" variant="outline" className="w-full">Cancel</Button>
                  </DialogClose>
                  <Button onClick={() => handleDelete(deletingCategory?.id)} disabled={deleteCategory.isPending} size="sm" className="bg-destructive/50 hover:bg-destructive">
                      {
                          deleteCategory.isPending ? 'Deleting...' : 'Delete'
                      }
                  </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {errorMsg && <p className="mb-4 text-sm font-semibold text-destructive">{errorMsg}</p>}

      {isLoading && (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
      )}

      <div className="space-y-3">
        {categories?.map((cat) => (
          <div key={cat.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{cat.name}</span>
                <Badge variant="secondary">{cat.products_count} products</Badge>
              </div>
              <div className='flex items-center gap-1'>
                <Button size="xs" onClick={() => { setEditingCategory(cat); setEditDialogOpen(true); }} className="text-action bg-action/20 hover:bg-action/30">
                    Edit
                </Button>
                <Button variant="destructive" size="xs" onClick={() => setDeletingCategory(cat)}>
                    Delete
                </Button>
              </div>
            </div>

            {cat.children?.length > 0 && (
              <div className="mt-3 md:ml-4 space-y-2 border-l border-slate-200 pl-4">
                {cat.children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-slate-700">{child.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {child.products_count} products
                      </Badge>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Button size="xs" onClick={() => { setEditingCategory(child); setEditDialogOpen(true); }} className="text-action bg-action/20 hover:bg-action/30">
                            Edit
                        </Button>
                        <Button variant="destructive" size="xs" onClick={() => setDeletingCategory(child)}>
                            Delete
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}