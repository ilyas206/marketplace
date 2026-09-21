import { useState } from 'react';
import { useUsers, useToggleUserSuspension } from '../../hooks/useAdmin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { 
  Dialog, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogClose, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from "sonner";

const ROLES_COLORS = {
  'admin' : 'mr-1 bg-amber-200 text-darker',
  'seller' : 'mr-1 bg-emerald-200 text-darker',
  'buyer' : 'mr-1 bg-blue-200 text-darker',
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [openUserId, setOpenUserId] = useState(null);
  const { data, isLoading } = useUsers({ search: search || undefined });
  const toggleSuspension = useToggleUserSuspension();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-action">Users</h1>
        <Input
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs text-darker"
        />
      </div>

      {isLoading && (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      )}

      {data && (
        <Table>
          <TableHeader>
            <TableRow className="border-b-borders">
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Suspension</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-darker/80 font-semibold">
            {data.data.map((user) => (
              <TableRow key={user.id} className="border-b-borders">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.roles?.map((r) => (
                    <Badge key={r.name} variant="secondary" className={ROLES_COLORS[r.name]}>{r.name}</Badge>
                  ))}
                </TableCell>
                <TableCell>
                  {user.is_suspended ? (
                    <Badge variant="destructive">Suspended</Badge>
                  ) : (
                    <Badge>Active</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!user.roles?.some((r) => r.name === 'admin') && (
                    <Dialog
                      open={openUserId === user.id}
                      onOpenChange={(open) => setOpenUserId(open ? user.id : null)}
                    >
                      <DialogTrigger asChild>
                         <Button
                          className={user.is_suspended ? 'text-action bg-action/20 hover:bg-action/30' : 'text-destructive bg-destructive/20 hover:bg-destructive/30'}
                          size="sm"
                        >
                          {user.is_suspended ? 'Reinstate' : 'Suspend'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>{user.is_suspended ? 'Reinstating' : 'Suspending'} User</DialogTitle></DialogHeader>
                        <DialogDescription>
                            Are you sure you want to {user.is_suspended ? 'Reinstate' : 'Suspend'} <b>{user.name}</b> ?
                        </DialogDescription>
                        <DialogFooter className="border-t-borders">
                            <DialogClose>
                                <Button size="sm" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button
                              disabled={toggleSuspension.isPending}
                              onClick={() => toggleSuspension.mutate(user.id, {
                                onSuccess: (response) => {
                                  setOpenUserId(null);
                                  toast.success(response.message , {
                                    style: {
                                      background: 'var(--success)',
                                      color: 'var(--background)',
                                      border: 'transparent'
                                    },
                                  })
                                }
                              })}
                              size="sm"
                              className={user.is_suspended ? 'text-action bg-action/20 hover:bg-action/30' : 'text-destructive bg-destructive/20 hover:bg-destructive/30'}
                            >
                                {user.is_suspended ? 'Reinstate' : 'Suspend'}
                            </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}